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
    collapse.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        toggler.setAttribute("aria-expanded", "false");
        collapse.classList.remove("open");
      });
    });
  }

  // ── 3. SMOOTH SCROLL WITH PER-SECTION OFFSET ─────────────────
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");

  // 🔥 custom offsets per section
  const offsets = {
    home: 100,
    about: 200,
    experience: 250,
    project: 230,
    contact: 80,
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").substring(1); // remove #
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      // 🔥 get correct offset
      const offset = offsets[targetId] || 100;

      const position =
        target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: position,
        behavior: "smooth",
      });
    });
  });

  // ── 4. ACTIVE NAV HIGHLIGHT ON SCROLL ──────────────────────
  const sections = document.querySelectorAll(
    "#home, #about, #experience, #project, #contact",
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
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`,
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
const glow = document.querySelector(".cursor-glow");

let x = 0,
  y = 0;
let targetX = 0,
  targetY = 0;

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

// MAIN MODAL ELEMENTS
let currentImages = [];
const modal = document.getElementById("projectModal");
const overlay = modal.querySelector(".modal-overlay");
const closeBtn = modal.querySelector(".modal-close");

const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalImage = document.getElementById("modalImage");
const modalDescription = document.getElementById("modalDescription");
const modalTags = document.getElementById("modalTags");
const modalDetails = document.getElementById("modalDetails");
const modalFeatures = document.getElementById("modalFeatures");

// IMAGE MODAL
const imageModal = document.getElementById("imageModal");
const imageOverlay = imageModal.querySelector(".image-overlay");
const imageClose = imageModal.querySelector(".image-close");
const galleryImage = document.getElementById("galleryImage");
const openGallery = document.getElementById("openGallery");
const galleryContainer = document.getElementById("galleryContainer");
// OPEN PROJECT MODAL
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", () => {
    modalTitle.textContent = card.dataset.title;
    modalSubtitle.textContent = card.dataset.subtitle;
    modalImage.src = card.dataset.image;
    modalDescription.textContent = card.dataset.description;

    // SAVE IMAGES FOR THIS PROJECT
    currentImages = card.dataset.images ? card.dataset.images.split(",") : [];

    // TAGS
    modalTags.innerHTML = "";
    card.dataset.tags.split(",").forEach((tag) => {
      modalTags.innerHTML += `<span>${tag.trim()}</span>`;
    });

    // DETAILS
    modalDetails.innerHTML = `
      <p><strong>PROJECT</strong> ${card.dataset.project}</p>
      <p><strong>CLIENT</strong> ${card.dataset.client}</p>
      <p><strong>ROLE</strong> ${card.dataset.role}</p>
      <p><strong>PERIOD</strong> ${card.dataset.period}</p>
      <p><strong>TOOLS</strong> ${card.dataset.tools}</p>
    `;

    // FEATURES
    modalFeatures.innerHTML = "";
    card.dataset.features.split(",").forEach((f) => {
      modalFeatures.innerHTML += `<li>${f.trim()}</li>`;
    });

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  });
});

// CLOSE MAIN MODAL
function closeModal() {
  modal.classList.remove("open");
  setTimeout(() => {
    document.body.style.overflow = "";
  }, 300);
}

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// ================= IMAGE VIEWER =================

// OPEN IMAGE MODAL
openGallery.addEventListener("click", () => {
  galleryContainer.innerHTML = "";

  if (currentImages.length === 0) {
    galleryContainer.innerHTML = "<p>No screenshots available.</p>";
    return;
  }

  currentImages.forEach((src) => {
    const img = document.createElement("img");
    img.src = src.trim();
    img.alt = "project screenshot";
    galleryContainer.appendChild(img);
  });

  imageModal.classList.add("open");
});

// CLOSE IMAGE MODAL
function closeImageModal() {
  imageModal.classList.remove("open");
}

imageClose.addEventListener("click", closeImageModal);
imageOverlay.addEventListener("click", closeImageModal);



// contact
// ===============================
// COUNTRY DATA (WITH ISO CODES)
// ===============================
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

// ===============================
// ELEMENTS
// ===============================
const btn = document.getElementById("countryBtn");
const dd = document.getElementById("dropdown");
const ddList = document.getElementById("ddList");
const searchInput = document.getElementById("searchInput");
const selectedFlagImg = document.getElementById("selectedFlagImg");
const selectedCode = document.getElementById("selectedCode");

const phoneInput = document.getElementById("phoneInput");
const phoneError = document.getElementById("phoneError");

// ===============================
// DEFAULT COUNTRY
// ===============================
let selectedCountry = countries.find(c => c.iso === "ph");

// ===============================
// RENDER LIST
// ===============================
function renderList(filter = "") {
  const f = filter.toLowerCase();
  ddList.innerHTML = "";

  countries
    .filter(c =>
      c.name.toLowerCase().includes(f) ||
      c.code.includes(f)
    )
    .forEach(c => {
      const item = document.createElement("div");
      item.className = "c-dd-item";

      item.innerHTML = `
        <span class="c-dd-flag">
          <img src="https://flagcdn.com/w40/${c.iso}.png" alt="${c.name}">
        </span>
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

// ===============================
// TOGGLE DROPDOWN
// ===============================
btn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = dd.classList.toggle("open");
  btn.classList.toggle("open", isOpen);

  if (isOpen) setTimeout(() => searchInput.focus(), 10);
});

// ===============================
// SEARCH
// ===============================
searchInput.addEventListener("input", () => {
  renderList(searchInput.value);
});

// ===============================
// CLOSE OUTSIDE CLICK
// ===============================
document.addEventListener("click", (e) => {
  if (!dd.contains(e.target) && e.target !== btn) {
    dd.classList.remove("open");
    btn.classList.remove("open");
  }
});

// ===============================
// PHONE VALIDATION
// ===============================
function validatePhone() {
  if (!phoneInput) return;

  const value = phoneInput.value.replace(/\s+/g, "");
  const code = selectedCountry.code;

  if (value.length === 0) {
    phoneError.textContent = "";
    return;
  }

  // must be numbers only
  if (!/^\d+$/.test(value)) {
    phoneError.textContent = "Numbers only allowed";
    phoneError.style.color = "red";
    return;
  }

  // basic length rules
  const rules = {
    "+63": [10, 10],
    "+1": [10, 10],
    "+44": [10, 11],
    default: [7, 15]
  };

  const [min, max] = rules[code] || rules.default;

  if (value.length < min || value.length > max) {
    phoneError.textContent = "Invalid number length";
    phoneError.style.color = "red";
    return;
  }

  phoneError.textContent = "Valid number";
  phoneError.style.color = "green";
}

// ===============================
// INPUT LISTENER
// ===============================
if (phoneInput) {
  phoneInput.addEventListener("input", validatePhone);
}

// ===============================
// INIT
// ===============================
renderList();

// default UI
selectedFlagImg.src = `https://flagcdn.com/w40/${selectedCountry.iso}.png`;
selectedCode.textContent = selectedCountry.code;


// email
// ================= EMAILJS INIT =================
emailjs.init("JazOQBFJPsktzFUvD");

// ================= SUBMIT FORM =================
document.querySelector(".contact-submit").addEventListener("click", function () {
  
  const name = document.querySelector("input[type='text']").value;
  const email = document.querySelector("input[type='email']").value;
  const phone = document.getElementById("phoneInput").value;
  const message = document.querySelector("textarea").value;
  const countryCode = document.getElementById("selectedCode").textContent;

  if (!name || !email || !phone || !message) {
    alert("Please fill all fields");
    return;
  }

  const params = {
    name: name,
    email: email,
    phone: countryCode + " " + phone,
    message: message
  };

  emailjs.send("service_lyg4qwe", "template_esa8mnl", params)
    .then(() => {
      alert("Message sent successfully! ✅");

      // clear form
      document.querySelector("input[type='text']").value = "";
      document.querySelector("input[type='email']").value = "";
      document.getElementById("phoneInput").value = "";
      document.querySelector("textarea").value = "";

    })
    .catch((error) => {
      console.error(error);
      alert("Failed to send message ❌");
    });
});