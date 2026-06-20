/* ==========================================================
   THE PURANJAY HOTEL — MAIN SCRIPT
   ========================================================== */

/* ------------------------------------------------------------------
   CONFIGURATION — Change these values to customise the site
   ------------------------------------------------------------------ */

// Single WhatsApp number used for all booking buttons.
const WHATSAPP_NUMBER = "919236597973";

// Contact phone number (used for "Call Now" button).
const PHONE_NUMBER = "+919236597973";
const PHONE_DISPLAY = "+91 92365 97973";

// Instagram profile URL.
const INSTAGRAM_URL = "https://www.instagram.com/the_puranjay__hotel?igsh=dTAzeHBvN29mb28=";

// Standard booking message template — {room} will be replaced with room name.
const BOOKING_MESSAGE = (room) =>
  `Hello,\nI would like to book the ${room} at The Puranjay Hotel.\nPlease share availability and booking details.`;

// Hero carousel images (premium Varanasi / heritage hotel photography).
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
];

// Room data — three categories offered by The Puranjay Hotel.
const ROOMS = [
  {
    name: "Simple Room",
    type: "Simple",
    description:
      "A thoughtfully appointed retreat designed for the modern traveller. Soft lighting, comfortable bedding and a calming ambience offer the perfect setting to unwind after a day exploring the ghats of Varanasi.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    price: "₹1,500 – ₹2,000",
    priceMin: 1500,
    rating: 4.6,
    status: "available",
    statusLabel: "Available",
    size: "220 sq ft",
    occupancy: "2 Adults",
    bed: "Queen Bed",
    view: "Courtyard View",
    facilities: ["Comfortable Bed", "Free WiFi", "Attached Bathroom", "Air Conditioning", "Room Service"]
  },
  {
    name: "Deluxe Room",
    type: "Deluxe",
    description:
      "An elegant sanctuary featuring spacious interiors, premium bedding and curated amenities. Every detail — from the soft linens to the warm lighting — is crafted for a refined, restful stay.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    price: "₹2,000 – ₹3,000",
    priceMin: 2000,
    rating: 4.8,
    status: "available",
    statusLabel: "Available",
    size: "320 sq ft",
    occupancy: "2 Adults + 1 Child",
    bed: "King Bed",
    view: "City View",
    facilities: ["Spacious Interior", "Premium Bedding", "Smart TV", "Air Conditioning", "Free WiFi", "Room Service"]
  },
  {
    name: "Premium Room",
    type: "Premium",
    description:
      "Our signature accommodation — a luxurious haven offering a king-size bed, premium washroom, smart TV and a curated guest experience. Designed for those who seek the finest in comfort and hospitality.",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    price: "₹3,500 – ₹4,000",
    priceMin: 3500,
    rating: 4.9,
    status: "limited",
    statusLabel: "Limited",
    size: "420 sq ft",
    occupancy: "2 Adults + 2 Children",
    bed: "King Size Bed",
    view: "Premium View",
    facilities: ["Luxury Interior", "King Size Bed", "Smart TV", "Premium Washroom", "Air Conditioning", "High-Speed WiFi", "Room Service", "Premium Guest Experience"]
  }
];

/* ------------------------------------------------------------------
   UTILITIES
   ------------------------------------------------------------------ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const buildWhatsAppLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let stars = "";
  for (let i = 0; i < full; i++) stars += "★";
  if (half) stars += "☆";
  return stars;
};

/* ------------------------------------------------------------------
   NAVBAR — scroll behaviour + mobile menu
   ------------------------------------------------------------------ */
const initNavbar = () => {
  const navbar = $("#navbar");
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = $("#navToggle");
  const menu   = $("#navMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      toggle.classList.toggle("active", isOpen);
      toggle.setAttribute("aria-expanded", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    $$(".nav-link", menu).forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }
};

/* ------------------------------------------------------------------
   REVEAL ON SCROLL — IntersectionObserver
   ------------------------------------------------------------------ */
const initReveal = () => {
  const items = $$(".reveal");
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
  items.forEach(el => observer.observe(el));
};

/* ------------------------------------------------------------------
   GALLERY LIGHTBOX
   ------------------------------------------------------------------ */
const initLightbox = () => {
  const items = $$(".gallery-item");
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const closeBtn = $("#lightboxClose");
  if (!lightbox || !lightboxImg || !closeBtn) return;

  items.forEach(item => {
    item.addEventListener("click", () => {
      const src = item.getAttribute("data-src");
      if (!src) return;
      lightboxImg.src = src;
      lightboxImg.alt = item.querySelector("img")?.alt || "Gallery image";
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => { lightboxImg.src = ""; }, 300);
  };

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) closeLightbox();
  });
};

/* ------------------------------------------------------------------
   ROOMS PAGE — render cards
   ------------------------------------------------------------------ */
const renderRooms = () => {
  const grid = $("#roomsGrid");
  if (!grid) return;

  grid.innerHTML = ROOMS.map((room, idx) => `
    <article class="room-card" style="animation-delay:${0.05 + idx * 0.1}s">
      <div class="room-image">
        <img src="${room.image}" alt="${room.name} — The Puranjay Hotel Varanasi" loading="lazy" />
        <div class="room-badge">
          <span class="room-type-badge">${room.type}</span>
          <span class="room-status ${room.status}">
            <span class="dot"></span>${room.statusLabel}
          </span>
        </div>
        <div class="room-rating">
          <span class="star">★</span> ${room.rating.toFixed(1)}
        </div>
      </div>
      <div class="room-body">
        <h3 class="room-name">${room.name}</h3>
        <p class="room-desc">${room.description}</p>

        <div class="room-meta">
          <div class="room-meta-item"><span class="icon">📐</span><span><strong>${room.size}</strong> · Size</span></div>
          <div class="room-meta-item"><span class="icon">👤</span><span><strong>${room.occupancy}</strong> · Guests</span></div>
          <div class="room-meta-item"><span class="icon">🛏️</span><span><strong>${room.bed}</strong> · Bed</span></div>
          <div class="room-meta-item"><span class="icon">🌆</span><span><strong>${room.view}</strong> · View</span></div>
        </div>

        <div class="room-facilities">
          ${room.facilities.map(f => `<span class="facility">${f}</span>`).join("")}
        </div>

        <div class="room-footer">
          <div class="room-price-row">
            <div class="room-price">
              <span class="price-amount">${room.price}</span>
              <span class="price-unit">/ night</span>
            </div>
            <span class="room-rating-static">
              <span class="star">★</span> ${room.rating.toFixed(1)}
            </span>
          </div>
          <a class="btn-whatsapp"
             href="${buildWhatsAppLink(BOOKING_MESSAGE(room.name))}"
             target="_blank"
             rel="noopener"
             aria-label="Book ${room.name} on WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l.241.383-1 3.667 3.738-.998zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.298-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01a1.092 1.092 0 0 0-.793.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            Book on WhatsApp
          </a>
        </div>
      </div>
    </article>
  `).join("");
};

/* ------------------------------------------------------------------
   REVIEWS — animate progress bars on scroll
   ------------------------------------------------------------------ */
const initReviewBars = () => {
  const bars = $$(".review-bar-fill");
  if (!bars.length) return;
  if (!("IntersectionObserver" in window)) {
    bars.forEach(b => b.style.width = b.parentElement.dataset.value + "%");
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseFloat(e.target.dataset.value);
        e.target.style.width = target + "%";
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => obs.observe(b));
};

/* ------------------------------------------------------------------
   FOOTER — auto-update year, social links
   ------------------------------------------------------------------ */
const initFooter = () => {
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Wire Instagram link everywhere
  $$("[data-instagram]").forEach(a => a.href = INSTAGRAM_URL);

  // Concierge / WhatsApp CTA on rooms page
  const conciergeCta = $("#conciergeCta");
  if (conciergeCta) {
    conciergeCta.href = buildWhatsAppLink(
      "Hello, I would like to enquire about room availability at The Puranjay Hotel."
    );
  }
};

/* ------------------------------------------------------------------
   FLOATING WIDGETS — WhatsApp + Call (mobile)
   ------------------------------------------------------------------ */
const initFloatingWidgets = () => {
  const fab = $("#floatingActions");
  if (!fab) return;

  const whatsappBtn = $("#fabWhatsapp");
  const callBtn = $("#fabCall");
  const showAfter = 400;
  const toggleVisibility = () => {
    if (window.scrollY > showAfter) fab.classList.add("visible");
    else fab.classList.remove("visible");
  };
  window.addEventListener("scroll", toggleVisibility, { passive: true });
  toggleVisibility();

  if (whatsappBtn) {
    whatsappBtn.href = buildWhatsAppLink(
      "Hello, I would like to enquire about room availability at The Puranjay Hotel."
    );
  }
  if (callBtn) {
    callBtn.href = `tel:${PHONE_NUMBER}`;
    callBtn.setAttribute("aria-label", `Call The Puranjay Hotel at ${PHONE_DISPLAY}`);
  }
};

/* ------------------------------------------------------------------
   SMOOTH ANCHOR SCROLL (offset for fixed navbar)
   ------------------------------------------------------------------ */
const initSmoothAnchors = () => {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = $("#navbar")?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
};

/* ------------------------------------------------------------------
   INIT
   ------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initReveal();
  initLightbox();
  renderRooms();
  initReviewBars();
  initFooter();
  initFloatingWidgets();
  initSmoothAnchors();
});
