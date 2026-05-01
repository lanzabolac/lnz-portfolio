export const config = { runtime: "edge" };

const SYSTEM_CONTEXT = `
You are Pau, a helpful AI assistant embedded in Lanz Paulo Abolac's portfolio website.

Your role:
- Only answer questions about Lanz Paulo Abolac
- Or general web development topics
- Be concise, friendly, and professional

About Lanz:
- Full name: Lanz Paulo Abolac
- Role: Web Developer (fresh graduate, backend-focused)
- Education: BS Information Technology, Bulacan State University - Bustos Campus (2022-2026)
- Internship: Web Developer Intern at Magellan Solutions (Laravel, MySQL)
- Tech Stack: PHP, Laravel, Node.js, JavaScript, Python, MySQL, HTML, CSS, Django, Java, C++
- Projects:
  1. UAT System (Laravel + MySQL)
  2. BulSU Faculty Management System (PHP + MySQL)
  3. Coffee Spot (Web project)
  4. Pasta & Co (Frontend restaurant website)
- Interests: Food, Music, Guitar
- Location: Bustos, Bulacan, Philippines
`;

export default async function handler(req) {
  try {
    const { message, history } = await req.json();

    // ✅ sanitize history
    const cleanHistory = (history || []).map((msg) => ({
      role: msg.role === "model" ? "model" : "user",
      parts: Array.isArray(msg.parts) ? msg.parts : [{ text: msg.text || "" }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_CONTEXT }],
          },
          contents: [
            {
              role: "model",
              parts: [{ text: "Understood. I will follow the system instructions." }],
            },
            ...cleanHistory,
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    // ✅ error handling
    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: err }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}