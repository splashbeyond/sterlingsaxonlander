document.documentElement.classList.add("motion-ready");

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const year = document.querySelector("[data-year]");
const heroVideo = document.querySelector(".hero-media video");
const desktopVideoQuery = window.matchMedia("(min-width: 641px)");

if (year) {
  year.textContent = new Date().getFullYear();
}

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.playsInline = true;

  const startHeroVideo = () => {
    if (!desktopVideoQuery.matches) {
      heroVideo.pause();
      return;
    }

    const playAttempt = heroVideo.play();

    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {
        heroVideo.setAttribute("controls", "");
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startHeroVideo, { once: true });
  } else {
    startHeroVideo();
  }

  desktopVideoQuery.addEventListener("change", startHeroVideo);
}

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navMenu?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

navMenu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    navToggle?.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }
});

const revealSections = document.querySelectorAll(".reveal-section");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const showSection = (section) => {
  section.classList.add("is-visible");
};

if (motionQuery.matches || !("IntersectionObserver" in window)) {
  revealSections.forEach(showSection);
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showSection(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -14% 0px",
      threshold: 0.16,
    }
  );

  revealSections.forEach((section) => {
    revealObserver.observe(section);
  });
}
