const menuButton = document.querySelector(".site-header__menu-button");
const primaryNav = document.querySelector("#primary-navigation");

if (menuButton && primaryNav) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    primaryNav.classList.remove("is-open");
    document.body.classList.remove("is-menu-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Open navigation menu" : "Close navigation menu"
    );
    primaryNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("is-menu-open", !isOpen);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 721px)").matches) {
      closeMenu();
    }
  });
}

/* Scroll Reveal Animations */
function initScrollAnimations() {
  const revealElements = [];

  const addReveal = (el, staggerIndex = null) => {
    if (!el) return;
    el.classList.add("reveal-element");
    if (staggerIndex !== null) {
      el.style.setProperty("--stagger-index", staggerIndex);
    }
    revealElements.push(el);
  };

  // 1. Generic Section Headings
  document.querySelectorAll(".section-heading").forEach(el => addReveal(el));

  // 2. Company Logos Grid Items
  const logosGrid = document.querySelector(".company-logos-section__grid");
  if (logosGrid) {
    Array.from(logosGrid.children).forEach((child, idx) => addReveal(child, idx));
  }

  // 3. Feature Showcase Rows
  document.querySelectorAll(".feature-showcase-section__row").forEach(el => {
    addReveal(el);
  });

  // 4. Grids with children to be staggered
  const staggerGrids = [
    ".operations-section__grid",
    ".capability-columns-section__grid",
    ".company-brain-section__grid",
    ".clinical-data-section__grid",
    ".resource-cards-section__grid",
    ".ai-workforce-section__grid",
    ".runtime-capabilities-section__grid",
    ".org-intelligence-section__chips-grid",
    ".agent-consensus-section__flow",
    ".executive-decisions-section__chips-grid",
    ".org-memory-section__cards-grid",
    ".continuous-learning-section__flow",
    ".hierarchy-grid"
  ];

  staggerGrids.forEach(selector => {
    const grid = document.querySelector(selector);
    if (grid) {
      Array.from(grid.children).forEach((child, idx) => addReveal(child, idx));
    }
  });

  // 5. Integrations Section
  const integrationsSection = document.querySelector(".integrations-section");
  if (integrationsSection) {
    const eyebrow = integrationsSection.querySelector(".integrations-section__eyebrow");
    const title = integrationsSection.querySelector(".integrations-section__title");
    const card = integrationsSection.querySelector(".integrations-section__code-card");
    const note = integrationsSection.querySelector(".integrations-section__note");
    
    addReveal(eyebrow);
    addReveal(title);
    addReveal(card);
    addReveal(note);
  }

  // 6. Communication Section Rows
  document.querySelectorAll(".communication-section__row").forEach(el => {
    const content = el.querySelector(".communication-section__content");
    const media = el.querySelector(".communication-section__media");
    addReveal(content);
    addReveal(media);
  });

  // 7. New Story-driven Two-Column Sections
  const storySections = [
    ".org-intelligence-section",
    ".executive-counterpart-section",
    ".agent-consensus-section",
    ".executive-decisions-section",
    ".org-memory-section"
  ];
  storySections.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      const content = el.querySelector(`${selector}__content`);
      const media = el.querySelector(`${selector}__media`);
      if (content) addReveal(content);
      if (media) addReveal(media);
    });
  });

  // 8. Consumer Hero
  const ceoCard = document.querySelector(".ceo-card");
  if (ceoCard) addReveal(ceoCard);
  const connectors = document.querySelector(".hierarchy-connectors");
  if (connectors) addReveal(connectors);

  // 9. Final CTA Section
  const finalCta = document.querySelector(".final-cta-section");
  if (finalCta) {
    const title = finalCta.querySelector(".final-cta-section__title");
    const desc = finalCta.querySelector(".final-cta-section__description");
    const actions = finalCta.querySelector(".final-cta-section__actions");
    addReveal(title);
    addReveal(desc);
    addReveal(actions);
  }

  // Set up Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px", // Trigger when the element is 60px inside the viewport bottom
    threshold: 0.05 // Trigger when 5% of the element is visible
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target); // Animate once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* Vanta.js animated background */
function initVantaBackground() {
  const bgElement = document.querySelector("#vanta-bg");
  if (bgElement && typeof VANTA !== 'undefined') {
    window.vantaEffect = VANTA.DOTS({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0xa17df8,
      color2: 0xa17df8,
      backgroundColor: 0xffffff,
      size: 3.00,
      spacing: 35.00,
      showLines: false
    });

    // Immediately set the camera position to its target coordinates to skip the entry/fly-in animation
    if (window.vantaEffect && window.vantaEffect.camera) {
      window.vantaEffect.camera.position.set(0, 50, 350);
    }
  }
}

/* Capability Card Image Carousel */
function initCardCarousels() {
  const containers = document.querySelectorAll(".capability-columns-section__image-container");

  containers.forEach(container => {
    const slider = container.querySelector(".capability-columns-section__image-slider");
    const prevBtn = container.querySelector(".capability-columns-section__carousel-btn--prev");
    const nextBtn = container.querySelector(".capability-columns-section__carousel-btn--next");

    if (!slider || !prevBtn || !nextBtn) return;

    const images = slider.querySelectorAll(".capability-columns-section__image");
    if (images.length <= 1) return;

    let currentIndex = 0;
    let autoScrollInterval = null;

    const updateSlider = (newIndex) => {
      currentIndex = (newIndex + images.length) % images.length;
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    const startAutoScroll = () => {
      stopAutoScroll();
      autoScrollInterval = setInterval(() => {
        updateSlider(currentIndex + 1);
      }, 4500);
    };

    const stopAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    };

    // Initialize auto scroll
    startAutoScroll();

    // Reset auto-scroll timer when user interacts manually
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      updateSlider(currentIndex - 1);
      startAutoScroll();
    });

    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      updateSlider(currentIndex + 1);
      startAutoScroll();
    });

    // Pause on hover
    container.addEventListener("mouseenter", stopAutoScroll);
    container.addEventListener("mouseleave", startAutoScroll);
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initScrollAnimations();
    initVantaBackground();
    initCardCarousels();
  });
} else {
  initScrollAnimations();
  initVantaBackground();
  initCardCarousels();
}

