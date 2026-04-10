// ─────────────────────────────────────────────────────────────
//  landingpage.js  –  static portfolio interactions
// ─────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── 1. BODY FADE-IN ────────────────────────────────────────
  // Triggered on "load" (all assets ready) rather than DOMContentLoaded
  // so the fade feels intentional rather than a flash of unstyled content.
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });


  // ── 2. BURGER MENU ─────────────────────────────────────────
  const toggler = document.querySelector(".navbar-toggler");
  const collapse = document.getElementById("navbarSupportedContent");

  if (toggler && collapse) {
    toggler.addEventListener("click", () => {
      const expanded = toggler.getAttribute("aria-expanded") === "true";
      toggler.setAttribute("aria-expanded", String(!expanded));
      collapse.classList.toggle("open");
    });

    // Close menu when a nav link is clicked (mobile UX)
    collapse.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        toggler.setAttribute("aria-expanded", "false");
        collapse.classList.remove("open");
      });
    });
  }


  // ── 3. SMOOTH SCROLL WITH OFFSET ───────────────────────────
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");
  const SCROLL_OFFSET = 90; // height of sticky nav + breathing room

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const position = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top: position, behavior: "smooth" });
    });
  });


  // ── 4. ACTIVE NAV HIGHLIGHT ON SCROLL ──────────────────────
  const sections = document.querySelectorAll("#home, #about, #experience, #projects");
  const TRIGGER_POINT = window.innerHeight / 2;

  function updateActiveLink() {
    let current = "";

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= TRIGGER_POINT && rect.bottom >= TRIGGER_POINT) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      );
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink(); // run once on load


  // ── 5. SCROLL REVEAL ───────────────────────────────────────
  const reveals = document.querySelectorAll(".reveal");
  const REVEAL_POINT = 120;

  function checkReveals() {
    const windowHeight = window.innerHeight;
    reveals.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - REVEAL_POINT) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", checkReveals, { passive: true });
  checkReveals(); // run once on load so above-fold items show immediately


  // ── 6. ABOUT IMAGE FLIP ────────────────────────────────────
  const aboutImage = document.querySelector(".aboutme-image");
  if (aboutImage) {
    aboutImage.addEventListener("click", () => {
      aboutImage.classList.toggle("flipped");
    });
  }

});


// cursor glow
const glow = document.querySelector('.cursor-glow');

let x = 0, y = 0;
let targetX = 0, targetY = 0;

document.addEventListener('mousemove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

function animate() {
  x += (targetX - x) * 0.2;
  y += (targetY - y) * 0.2;

  glow.style.left = x + 'px';
  glow.style.top = y + 'px';

  requestAnimationFrame(animate);
}

animate();


