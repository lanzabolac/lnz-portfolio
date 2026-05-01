// ── GEMINI CHATBOT WIDGET ──────────────────────────────────
const SYSTEM_CONTEXT = `You are a helpful AI assistant named Pau, embedded on Lanz Paulo Abolac's personal portfolio website. Your role is to help visitors learn about Lanz and his work. Here is everything about Lanz:

- Full name: Lanz Paulo Abolac
- Role: Web Developer (fresh graduate, focused on backend development)
- Education: BS Information Technology, Bulacan State University - Bustos Campus (2022-2026). Senior High: ICT Programming, Aclc College of Baliuag (2020-2022)
- Experience: Web Developer Intern at Magellan Solutions (December 2025 - March 2026). Developed backend features using Laravel and MySQL. Improved system performance by 30% and reduced response time by 25%.
- Tech Stack: C++, Java, Django, PHP, Node.js, JavaScript, HTML, CSS, MySQL, Python, Figma, Canva, Laravel
- Projects: (1) User Acceptance Form (UAT) - Laravel/MySQL system built during OJT at Magellan Solutions. (2) BulSU Faculty Management System - Capstone project for Bulacan State University Bustos Campus using PHP and MySQL. (3) Coffee Spot - Web 2 project. (4) Pasta and Co. - Frontend restaurant website using HTML, CSS, JavaScript.
- Certifications: Cisco Networking Academy Introduction to Packet Tracer (May 2024)
- Interests: Food, Music, Guitar, Curious by nature
- Contact: abolaclanzpaulo@gmail.com, phone +63 949 8748 964, located in Bustos, Bulacan, Philippines
- Social media: GitHub at lanzabolac, LinkedIn at /in/abolac/, Facebook, Instagram at flrslnz_

Keep answers concise, friendly, and professional. Only answer questions about Lanz or general web development topics.`;

// Chat history — push to this BEFORE calling the API
let chatHistory = [];

function injectGeminiChat() {

  // ── BUBBLE ────────────────────────────────────────────────
  const bubble = document.createElement("button");
  bubble.className = "gchat-bubble";
  bubble.setAttribute("aria-label", "Open AI chat assistant");
  bubble.innerHTML = `
    <span class="gchat-gem-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gemGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stop-color="#4285f4"/>
            <stop offset="33%"  stop-color="#ea4335"/>
            <stop offset="66%"  stop-color="#fbbc04"/>
            <stop offset="100%" stop-color="#34a853"/>
          </linearGradient>
        </defs>
        <path d="M12 2L8.5 8.5L2 12L8.5 15.5L12 22L15.5 15.5L22 12L15.5 8.5L12 2Z" fill="url(#gemGrad)"/>
        <circle cx="12" cy="12" r="2.5" fill="#111"/>
      </svg>
    </span>
    <span class="gchat-close-icon">&times;</span>
  `;

  // ── PANEL ─────────────────────────────────────────────────
  const panel = document.createElement("div");
  panel.className = "gchat-panel";
  panel.innerHTML = `
    <div class="gchat-header">
      <div class="gchat-header-icon">
        <svg viewBox="0 0 24 24" fill="white">
          <path d="M12 2L8.5 8.5L2 12L8.5 15.5L12 22L15.5 15.5L22 12L15.5 8.5L12 2Z"/>
        </svg>
      </div>
      <div class="gchat-header-text">
        <h4>Pau</h4>
        <p>Ask about Lanz's portfolio</p>
      </div>
      <div class="gchat-status-dot"></div>
    </div>
    <div class="gchat-messages" id="gchatMessages">
      <div class="gchat-msg bot">
        <div class="gchat-msg-bubble">Hey! I am Pau, Lanz's AI assistant. Ask me anything about his skills, projects, or experience!</div>
        <div class="gchat-msg-time">Just now</div>
      </div>
    </div>
    <div class="gchat-quick-btns" id="gchatQuickBtns">
      <button class="gchat-quick-btn" data-q="What are Lanz's main skills?">Skills</button>
      <button class="gchat-quick-btn" data-q="Tell me about his projects">Projects</button>
      <button class="gchat-quick-btn" data-q="What is his work experience?">Experience</button>
      <button class="gchat-quick-btn" data-q="How can I contact Lanz?">Contact</button>
    </div>
    <div class="gchat-footer">
      <textarea class="gchat-input" id="gchatInput" placeholder="Ask me anything..." rows="1"></textarea>
      <button class="gchat-send-btn" id="gchatSend">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
    <div class="gchat-powered">Powered by Google Gemini</div>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector("#gchatMessages");
  const inputEl    = panel.querySelector("#gchatInput");
  const sendBtn    = panel.querySelector("#gchatSend");

  // ── TOGGLE ────────────────────────────────────────────────
  bubble.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("open");
    bubble.classList.toggle("open", isOpen);
    if (isOpen) setTimeout(() => inputEl.focus(), 250);
  });

  // ── QUICK BUTTONS ─────────────────────────────────────────
  panel.querySelectorAll(".gchat-quick-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      sendMessage(btn.getAttribute("data-q"));
    });
  });

  // ── AUTO-RESIZE TEXTAREA ──────────────────────────────────
  inputEl.addEventListener("input", () => {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + "px";
  });

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener("click", () => sendMessage());

  // ── HELPERS ───────────────────────────────────────────────
  function getTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function appendMessage(role, text) {
    const el = document.createElement("div");
    el.className = "gchat-msg " + role;
    el.innerHTML = `
      <div class="gchat-msg-bubble">${formatText(text)}</div>
      <div class="gchat-msg-time">${getTime()}</div>
    `;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function formatText(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }

  function showTyping() {
    const el = document.createElement("div");
    el.className = "gchat-msg bot";
    el.id = "gchatTyping";
    el.innerHTML = `<div class="gchat-typing"><span></span><span></span><span></span></div>`;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById("gchatTyping");
    if (el) el.remove();
  }

  // ── SEND ──────────────────────────────────────────────────
  async function sendMessage(overrideText) {
    const text = (overrideText || inputEl.value).trim();
    if (!text) return;

    appendMessage("user", text);
    inputEl.value = "";
    inputEl.style.height = "auto";

    sendBtn.disabled = true;
    inputEl.disabled = true;
    showTyping();

    // FIX: Push user message into history BEFORE the API call
    chatHistory.push({ role: "user", parts: [{ text }] });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // FIX: Only send history — the API route no longer appends message separately
        body: JSON.stringify({ history: chatHistory }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("[API Error]", response.status, errData);
        throw new Error(`API error ${response.status}`);
      }

      const data = await response.json();
const parts = data?.candidates?.[0]?.content?.parts ?? [];
const reply = parts.find(p => p.text && !p.thought)?.text;
      if (!reply) {
        console.error("[Empty Reply] Full response:", JSON.stringify(data));
        throw new Error("Empty reply from Gemini.");
      }

      // Push model reply into history to maintain conversation context
      chatHistory.push({ role: "model", parts: [{ text: reply }] });

      removeTyping();
      appendMessage("bot", reply);

    } catch (err) {
      removeTyping();
      console.error("[Gemini Error]", err.message);
      // Remove the failed user message from history so it doesn't corrupt context
      chatHistory.pop();
      appendMessage("bot", "Sorry, something went wrong. Please try again.");
    } finally {
      sendBtn.disabled = false;
      inputEl.disabled = false;
      inputEl.focus();
    }
  }
}

// ── INIT ──────────────────────────────────────────────────
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectGeminiChat);
} else {
  injectGeminiChat();
}