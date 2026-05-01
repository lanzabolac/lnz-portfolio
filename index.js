// ─────────────────────────────────────────────────────────────
//  landingpage.js  –  static portfolio interactions
// ─────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // ── 1. BODY FADE-IN ────────────────────────────────────────
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

    collapse.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        toggler.setAttribute("aria-expanded", "false");
        collapse.classList.remove("open");
      });
    });
  }

  // ── 3. SMOOTH SCROLL WITH PER-SECTION OFFSET ─────────────────
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");

  const offsets = {
    home: 100,
    about: 200,
    experience: 250,
    project: 230,
    contact: 80,
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const offset = offsets[targetId] || 100;
      const position = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: position, behavior: "smooth" });
    });
  });

  // ── 4. ACTIVE NAV HIGHLIGHT ON SCROLL ──────────────────────
  const sections = document.querySelectorAll(
    "#home, #about, #experience, #project, #contact"
  );
  const TRIGGER_POINT = window.innerHeight / 2;

  function updateActiveLink() {
    let current = "";
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= TRIGGER_POINT && rect.bottom >= TRIGGER_POINT) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();

  // ── 5. SCROLL REVEAL ───────────────────────────────────────
  const reveals = document.querySelectorAll(".reveal");
  const REVEAL_POINT = 120;

  function checkReveals() {
    const windowHeight = window.innerHeight;
    reveals.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - REVEAL_POINT) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", checkReveals, { passive: true });
  checkReveals();

  // ── 6. ABOUT IMAGE FLIP ────────────────────────────────────
  const aboutImage = document.querySelector(".aboutme-image");
  if (aboutImage) {
    aboutImage.addEventListener("click", () => {
      aboutImage.classList.toggle("flipped");
    });
  }
});

// ── CURSOR GLOW ────────────────────────────────────────────
const glow = document.querySelector(".cursor-glow");
let x = 0, y = 0, targetX = 0, targetY = 0;

document.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

function animate() {
  x += (targetX - x) * 0.2;
  y += (targetY - y) * 0.2;
  glow.style.left = x + "px";
  glow.style.top = y + "px";
  requestAnimationFrame(animate);
}
animate();

// ── MODAL SETUP ────────────────────────────────────────────
let currentImages = [];
const modal = document.getElementById("projectModal");
const overlay = modal.querySelector(".modal-overlay");
const closeBtn = modal.querySelector(".modal-close");

function openShowcaseModal(slide) {
  document.getElementById("modalTitle").textContent       = slide.dataset.title       || "Untitled";
  document.getElementById("modalSubtitle").textContent    = slide.dataset.subtitle    || "";
  document.getElementById("modalImage").src               = slide.dataset.image       || "";
  document.getElementById("modalDescription").textContent = slide.dataset.description || "No description available.";

  currentImages = slide.dataset.images
    ? slide.dataset.images.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  // Tags
  const modalTags = document.getElementById("modalTags");
  modalTags.innerHTML = "";
  if (slide.dataset.tags) {
    slide.dataset.tags.split(",").forEach(tag => {
      if (tag.trim()) modalTags.innerHTML += `<span>${tag.trim()}</span>`;
    });
  }

  // Details
  document.getElementById("modalDetails").innerHTML = `
    <p><strong>PROJECT</strong> <span>${slide.dataset.project || "—"}</span></p>
    <p><strong>CLIENT</strong> <span>${slide.dataset.client || "—"}</span></p>
    <p><strong>ROLE</strong> <span>${slide.dataset.role || "—"}</span></p>
    <p><strong>PERIOD</strong> <span>${slide.dataset.period || "—"}</span></p>
    <p><strong>TOOLS</strong> <span>${slide.dataset.tools || "—"}</span></p>
  `;

  // Features
  const modalFeatures = document.getElementById("modalFeatures");
  modalFeatures.innerHTML = "";
  if (slide.dataset.features) {
    slide.dataset.features.split(",").forEach(f => {
      if (f.trim()) modalFeatures.innerHTML += `<li>${f.trim()}</li>`;
    });
  }

  // Gallery button
  const galleryBtn = document.getElementById("openGallery");
  galleryBtn.style.display = currentImages.length > 0 ? "inline-block" : "none";

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

// ─────────────────────────────────────────────────────────────
//  PROJECT SHOWCASE — 3D Carousel
//  Replace the entire "PROJECT SHOWCASE" block in index.js
//  (from "// ── PROJECT SHOWCASE" down to the touch swipe block)
// ─────────────────────────────────────────────────────────────

const track          = document.getElementById("showcaseTrack");
const dotsContainer  = document.getElementById("showcaseDots");
const showcaseTitle  = document.getElementById("showcaseTitle");
const showcaseSub    = document.getElementById("showcaseSubtitle");
const showcaseBtn    = document.getElementById("showcaseOpenBtn");
const slides         = Array.from(document.querySelectorAll(".showcase-slide"));

let currentSlide = 0;

// Build dots
slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "showcase-dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", `Slide ${i + 1}`);
  dot.addEventListener("click", () => goTo(i));
  dotsContainer.appendChild(dot);
});

function getSlideClass(distance) {
  if (distance === 0)  return "is-center";
  if (distance === -1) return "is-prev";
  if (distance === 1)  return "is-next";
  if (distance === -2) return "is-far-prev";
  if (distance === 2)  return "is-far-next";
  return "is-hidden";
}

function goTo(index) {
  currentSlide = ((index % slides.length) + slides.length) % slides.length;

  const total = slides.length;
  slides.forEach((slide, i) => {
    // Remove all state classes
    slide.classList.remove(
      "is-center", "is-prev", "is-next",
      "is-far-prev", "is-far-next", "is-hidden"
    );

    // Signed distance, wrapping around
    let dist = i - currentSlide;
    if (dist > total / 2)  dist -= total;
    if (dist < -total / 2) dist += total;

    slide.classList.add(getSlideClass(dist));
  });

  // Update dots
  document.querySelectorAll(".showcase-dot").forEach((d, i) => {
    d.classList.toggle("active", i === currentSlide);
  });

  // Update info
  const slide = slides[currentSlide];
  showcaseTitle.textContent = slide.dataset.title    || "";
  showcaseSub.textContent   = slide.dataset.subtitle || "";
  showcaseBtn.classList.toggle("visible", !!slide.dataset.project);
}

// Init
goTo(0);

document.querySelector(".showcase-prev").addEventListener("click", () => goTo(currentSlide - 1));
document.querySelector(".showcase-next").addEventListener("click", () => goTo(currentSlide + 1));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft")  goTo(currentSlide - 1);
  if (e.key === "ArrowRight") goTo(currentSlide + 1);
});

// Touch / swipe
let touchStartX = 0;
track.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener("touchend",   (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goTo(currentSlide + (diff > 0 ? 1 : -1));
});

// Click: side slides navigate, center slide opens modal
slides.forEach((slide, i) => {
  slide.addEventListener("click", () => {
    if (i !== currentSlide) {
      goTo(i);
    } else {
      openShowcaseModal(slide);
    }
  });
});

// "VIEW PROJECT →" button
showcaseBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  openShowcaseModal(slides[currentSlide]);
});

// ── IMAGE GALLERY MODAL ────────────────────────────────────
const imageModal      = document.getElementById("imageModal");
const imageOverlay    = imageModal.querySelector(".image-overlay");
const imageClose      = imageModal.querySelector(".image-close");
const galleryContainer = document.getElementById("galleryContainer");
const openGallery     = document.getElementById("openGallery");

openGallery.addEventListener("click", () => {
  galleryContainer.innerHTML = "";

  if (currentImages.length === 0) {
    galleryContainer.innerHTML = "<p>No screenshots available.</p>";
  } else {
    currentImages.forEach((src) => {
  const cleanSrc = src.trim();

  if (cleanSrc.endsWith(".mp4") || cleanSrc.endsWith(".webm")) {
    const video = document.createElement("video");
    video.src = cleanSrc;
    video.controls = true;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.style.width = "100%";
    video.style.borderRadius = "10px";
    galleryContainer.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = cleanSrc;
    img.alt = "project screenshot";
    galleryContainer.appendChild(img);
  }
});
  }

  imageModal.classList.add("open");
});

function closeImageModal() {
  imageModal.classList.remove("open");
}

imageClose.addEventListener("click", closeImageModal);
imageOverlay.addEventListener("click", closeImageModal);

// ── CONTACT: COUNTRY DROPDOWN ──────────────────────────────
const countries = [
  { name: "Afghanistan", code: "+93", iso: "af" },
  { name: "Albania", code: "+355", iso: "al" },
  { name: "Algeria", code: "+213", iso: "dz" },
  { name: "Argentina", code: "+54", iso: "ar" },
  { name: "Australia", code: "+61", iso: "au" },
  { name: "Austria", code: "+43", iso: "at" },
  { name: "Bangladesh", code: "+880", iso: "bd" },
  { name: "Belgium", code: "+32", iso: "be" },
  { name: "Brazil", code: "+55", iso: "br" },
  { name: "Canada", code: "+1", iso: "ca" },
  { name: "Chile", code: "+56", iso: "cl" },
  { name: "China", code: "+86", iso: "cn" },
  { name: "Colombia", code: "+57", iso: "co" },
  { name: "Denmark", code: "+45", iso: "dk" },
  { name: "Egypt", code: "+20", iso: "eg" },
  { name: "Finland", code: "+358", iso: "fi" },
  { name: "France", code: "+33", iso: "fr" },
  { name: "Germany", code: "+49", iso: "de" },
  { name: "Greece", code: "+30", iso: "gr" },
  { name: "India", code: "+91", iso: "in" },
  { name: "Indonesia", code: "+62", iso: "id" },
  { name: "Ireland", code: "+353", iso: "ie" },
  { name: "Israel", code: "+972", iso: "il" },
  { name: "Italy", code: "+39", iso: "it" },
  { name: "Japan", code: "+81", iso: "jp" },
  { name: "Malaysia", code: "+60", iso: "my" },
  { name: "Mexico", code: "+52", iso: "mx" },
  { name: "Netherlands", code: "+31", iso: "nl" },
  { name: "New Zealand", code: "+64", iso: "nz" },
  { name: "Nigeria", code: "+234", iso: "ng" },
  { name: "Norway", code: "+47", iso: "no" },
  { name: "Pakistan", code: "+92", iso: "pk" },
  { name: "Philippines", code: "+63", iso: "ph" },
  { name: "Poland", code: "+48", iso: "pl" },
  { name: "Portugal", code: "+351", iso: "pt" },
  { name: "Russia", code: "+7", iso: "ru" },
  { name: "Saudi Arabia", code: "+966", iso: "sa" },
  { name: "Singapore", code: "+65", iso: "sg" },
  { name: "South Africa", code: "+27", iso: "za" },
  { name: "South Korea", code: "+82", iso: "kr" },
  { name: "Spain", code: "+34", iso: "es" },
  { name: "Sri Lanka", code: "+94", iso: "lk" },
  { name: "Sweden", code: "+46", iso: "se" },
  { name: "Switzerland", code: "+41", iso: "ch" },
  { name: "Thailand", code: "+66", iso: "th" },
  { name: "Turkey", code: "+90", iso: "tr" },
  { name: "Ukraine", code: "+380", iso: "ua" },
  { name: "United Arab Emirates", code: "+971", iso: "ae" },
  { name: "United Kingdom", code: "+44", iso: "gb" },
  { name: "United States", code: "+1", iso: "us" },
  { name: "Vietnam", code: "+84", iso: "vn" }
];

const btn            = document.getElementById("countryBtn");
const dd             = document.getElementById("dropdown");
const ddList         = document.getElementById("ddList");
const searchInput    = document.getElementById("searchInput");
const selectedFlagImg = document.getElementById("selectedFlagImg");
const selectedCode   = document.getElementById("selectedCode");
const phoneInput     = document.getElementById("phoneInput");
const phoneError     = document.getElementById("phoneError");

let selectedCountry = countries.find(c => c.iso === "ph");

function renderList(filter = "") {
  const f = filter.toLowerCase();
  ddList.innerHTML = "";
  countries
    .filter(c => c.name.toLowerCase().includes(f) || c.code.includes(f))
    .forEach(c => {
      const item = document.createElement("div");
      item.className = "c-dd-item";
      item.innerHTML = `
        <span class="c-dd-flag"><img src="https://flagcdn.com/w40/${c.iso}.png" alt="${c.name}"></span>
        <span>${c.name}</span>
        <span class="c-dd-code">${c.code}</span>
      `;
      item.addEventListener("click", () => {
        selectedCountry = c;
        selectedFlagImg.src = `https://flagcdn.com/w40/${c.iso}.png`;
        selectedCode.textContent = c.code;
        dd.classList.remove("open");
        btn.classList.remove("open");
        searchInput.value = "";
        renderList();
        validatePhone();
      });
      ddList.appendChild(item);
    });
}

btn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = dd.classList.toggle("open");
  btn.classList.toggle("open", isOpen);
  if (isOpen) setTimeout(() => searchInput.focus(), 10);
});

searchInput.addEventListener("input", () => renderList(searchInput.value));

document.addEventListener("click", (e) => {
  if (!dd.contains(e.target) && e.target !== btn) {
    dd.classList.remove("open");
    btn.classList.remove("open");
  }
});

function validatePhone() {
  if (!phoneInput) return;
  const value = phoneInput.value.replace(/\s+/g, "");
  const code  = selectedCountry.code;

  if (value.length === 0) { phoneError.textContent = ""; return; }

  if (!/^\d+$/.test(value)) {
    phoneError.textContent = "Numbers only allowed";
    phoneError.style.color = "red";
    return;
  }

  const rules = { "+63": [10,10], "+1": [10,10], "+44": [10,11], default: [7,15] };
  const [min, max] = rules[code] || rules.default;

  if (value.length < min || value.length > max) {
    phoneError.textContent = "Invalid number length";
    phoneError.style.color = "red";
    return;
  }

  phoneError.textContent = "Valid number";
  phoneError.style.color = "green";
}

if (phoneInput) phoneInput.addEventListener("input", validatePhone);

renderList();
selectedFlagImg.src = `https://flagcdn.com/w40/${selectedCountry.iso}.png`;
selectedCode.textContent = selectedCountry.code;

// ── EMAILJS ────────────────────────────────────────────────
emailjs.init("JazOQBFJPsktzFUvD");

document.querySelector(".contact-submit").addEventListener("click", function () {
  const name        = document.querySelector("input[type='text']").value;
  const email       = document.querySelector("input[type='email']").value;
  const phone       = document.getElementById("phoneInput").value;
  const message     = document.querySelector("textarea").value;
  const countryCode = document.getElementById("selectedCode").textContent;
  const subject     = document.getElementById("subjectInput").value;

  if (!name || !email || !phone || !subject || !message) {
    alert("Please fill all fields");
    return;
  }

  const params = {
    name, email, subject,
    phone: countryCode + " " + phone,
    message,
    time: new Date().toLocaleString()
  };

  emailjs.send("service_lyg4qwe", "template_esa8mnl", params)
    .then(() => {
      alert("Message sent successfully! ✅");
      document.querySelector("input[type='text']").value  = "";
      document.querySelector("input[type='email']").value = "";
      document.getElementById("phoneInput").value         = "";
      document.getElementById("subjectInput").value       = "";
      document.querySelector("textarea").value            = "";
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to send message ❌");
    });
});

// ── EXPERIENCE TABS ────────────────────────────────────────
const expNavItems  = document.querySelectorAll('.exp-nav-item');
const expTabPanels = document.querySelectorAll('.exp-tab-panel');

expNavItems.forEach(function (navBtn) {
  navBtn.addEventListener('click', function () {
    const targetTab = this.dataset.tab;
    expNavItems.forEach(function (b) {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    this.classList.add('active');
    this.setAttribute('aria-selected', 'true');
    expTabPanels.forEach(function (panel) { panel.classList.remove('active'); });
    const targetPanel = document.getElementById('tab-' + targetTab);
    if (targetPanel) targetPanel.classList.add('active');
  });
});

// ── EXPERIENCE ACCORDION ───────────────────────────────────
document.querySelectorAll('.exp-expand-btn').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const card   = this.closest('.exp-card');
    const body   = card.querySelector('.exp-card-body');
    const isOpen = body.classList.contains('open');

    const panel = card.closest('.exp-tab-panel');
    if (panel) {
      panel.querySelectorAll('.exp-card-body.open').forEach(function (openBody) {
        openBody.classList.remove('open');
        openBody.closest('.exp-card').querySelector('.exp-expand-btn').classList.remove('open');
        openBody.closest('.exp-card').querySelector('.exp-expand-btn').setAttribute('aria-expanded', 'false');
      });
    }

    if (!isOpen) {
      body.classList.add('open');
      this.classList.add('open');
      this.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── CERTIFICATE MODAL ──────────────────────────────────────
const modalcert  = document.getElementById("certModal");
const modalImg   = document.getElementById("certModalImg");
const closeBtncert = document.querySelector(".cert-close");

document.querySelectorAll(".exp-view-cert-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    modalcert.style.display = "flex";
    modalImg.src = btn.getAttribute("data-cert");
  });
});

closeBtncert.onclick = () => modalcert.style.display = "none";
modalcert.onclick = (e) => { if (e.target === modalcert) modalcert.style.display = "none"; };