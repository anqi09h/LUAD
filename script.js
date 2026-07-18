// Always return to Home after a refresh instead of restoring the previous scroll position.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const navigationEntry = performance.getEntriesByType("navigation")[0];
if (navigationEntry?.type === "reload") {
  history.replaceState(null, "", `${location.pathname}${location.search}`);
  window.scrollTo(0, 0);
  window.addEventListener("load", () => window.scrollTo(0, 0), { once: true });
}

// Wait until the HTML is ready before finding page elements.
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".site-loader");
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-button");
  const navLinks = document.querySelector(".nav-links");
  const technicalButton = document.querySelector(".technical-toggle");
  const technicalDetails = document.querySelector("#technical-details");
  const sectionLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("main section[id]");
  const moduleRevealTargets = document.querySelectorAll(
    ".feature-card, .tool-card, .workflow-list li, .plot-card, .next-list li, .learning-grid article"
  );
  const waveTextTargets = document.querySelectorAll(
    [
      "main section:not(.hero) .section-number",
      "main section:not(.hero) h2",
      "main section:not(.hero) h3",
      "main section:not(.hero) p:not(.in-progress-note p)",
      "blockquote cite"
    ].join(", ")
  );

  const createWaterSplash = (originX, originY, dropletCount = 10) => {
    const splash = document.createElement("span");
    splash.className = "water-splash";
    splash.setAttribute("aria-hidden", "true");
    splash.style.setProperty("--splash-x", `${originX}px`);
    splash.style.setProperty("--splash-y", `${originY}px`);
    splash.innerHTML = Array.from(
      { length: dropletCount },
      (_, index) =>
        `<i class="water-droplet" style="--drop-index:${index}; --drop-angle:${
          index * (360 / dropletCount) + (index % 2) * 11
        }deg; --drop-distance:${34 + (index % 4) * 10}px"></i>`
    ).join("");

    document.body.append(splash);
    window.setTimeout(() => splash.remove(), 900);
  };

  let waveId = 0;

  const prepareFluidWave = (target, index) => {
    const namespace = `fluid-wave-${waveId++}`;
    const content = document.createElement("span");
    const overlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    content.className = "wave-reveal__content";
    while (target.firstChild) content.append(target.firstChild);

    overlay.classList.add("wave-reveal__overlay");
    overlay.setAttribute("viewBox", "0 0 1200 180");
    overlay.setAttribute("preserveAspectRatio", "none");
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
      <defs>
        <linearGradient id="${namespace}-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="var(--wave-shadow)" stop-opacity="0" />
          <stop offset="0.34" stop-color="var(--wave-accent)" stop-opacity="0.18" />
          <stop offset="0.76" stop-color="var(--wave-accent)" stop-opacity="0.52" />
          <stop offset="1" stop-color="var(--wave-accent-secondary)" stop-opacity="0.38" />
        </linearGradient>
        <linearGradient id="${namespace}-glass" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="var(--wave-shadow)" stop-opacity="0.08" />
          <stop offset="0.55" stop-color="var(--wave-accent)" stop-opacity="0.28" />
          <stop offset="1" stop-color="var(--wave-highlight)" stop-opacity="0.3" />
        </linearGradient>
        <radialGradient id="${namespace}-crest" cx="0.62" cy="0.42" r="0.62">
          <stop offset="0" stop-color="var(--wave-highlight)" stop-opacity="0.24" />
          <stop offset="0.48" stop-color="var(--wave-accent)" stop-opacity="0.6" />
          <stop offset="1" stop-color="var(--wave-shadow)" stop-opacity="0.16" />
        </radialGradient>
        <filter id="${namespace}-distortion" x="-12%" y="-30%" width="124%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.055" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="0.28" />
        </filter>
        <mask id="${namespace}-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="180">
          <rect width="1200" height="180" fill="black" />
          <path fill="white" d="M0 83 C150 44 300 125 438 72 C565 24 655 40 752 77 C813 100 864 93 902 66 C873 103 870 132 900 157 C828 127 767 137 696 154 C548 188 402 116 267 144 C151 168 73 136 0 151 Z" />
        </mask>
      </defs>
      <g class="wave-reveal__fluid" mask="url(#${namespace}-mask)" filter="url(#${namespace}-distortion)">
        <path class="wave-reveal__trail wave-reveal__trail--deep" fill="url(#${namespace}-body)" d="M-50 133 C133 85 244 143 390 105 C520 71 625 36 770 83 C824 100 863 99 904 73 C864 119 861 143 900 169 C765 141 671 178 534 157 C359 130 235 175 -50 155 Z" />
        <path class="wave-reveal__trail" fill="url(#${namespace}-glass)" d="M-20 103 C129 55 269 125 409 82 C547 40 650 48 756 91 C807 112 854 108 897 79 C851 125 844 147 868 166 C754 137 666 155 553 143 C381 125 244 149 -20 128 Z" />
        <path class="wave-reveal__fold" fill="none" d="M80 117 C244 75 325 132 472 91 C584 59 675 66 771 107 C817 127 855 122 887 98" />
        <path class="wave-reveal__fold wave-reveal__fold--soft" fill="none" d="M168 143 C311 101 399 155 548 118 C659 90 742 92 831 128" />
        <path class="wave-reveal__crest" fill="url(#${namespace}-crest)" d="M850 153 C897 137 931 105 924 72 C917 39 876 26 841 43 C811 57 798 91 815 116 C804 82 825 58 854 58 C884 59 900 81 893 104 C885 130 862 145 833 155 C842 156 847 155 850 153 Z" />
        <path class="wave-reveal__crest-inner" fill="none" d="M826 120 C811 87 828 54 857 48 C889 41 918 61 918 89 C918 115 897 141 863 153" />
        <path class="wave-reveal__reflection" fill="none" d="M28 101 C199 63 307 116 453 75 C583 39 682 55 778 91 C827 109 863 104 895 76" />
        <path class="wave-reveal__reflection wave-reveal__reflection--fine" fill="none" d="M322 133 C449 101 535 126 646 103 C727 86 789 96 848 121" />
      </g>
    `;

    target.classList.add("wave-reveal");
    target.style.setProperty("--wave-delay", `${(index % 5) * 55}ms`);
    target.append(content, overlay);
  };

  // Keep the welcome screen visible long enough to read, then reveal the site.
  if (loader) {
    const minimumDisplayTime = 1700;
    const loaderStartedAt = performance.now();

    const dismissLoader = () => {
      const elapsed = performance.now() - loaderStartedAt;
      const remaining = Math.max(0, minimumDisplayTime - elapsed);

      window.setTimeout(() => {
        loader.classList.add("is-exiting");
        document.body.classList.add("site-ready");
        window.setTimeout(() => loader.remove(), 650);
      }, remaining);
    };

    if (document.readyState === "complete") {
      dismissLoader();
    } else {
      window.addEventListener("load", dismissLoader, { once: true });
    }
  }

  // Create a transparent water splash at every primary pointer press.
  document.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;

    createWaterSplash(event.clientX, event.clientY);
  });

  // Use a cyberpunk targeting cursor on precise pointing devices.
  const supportsCustomCursor = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (supportsCustomCursor) {
    const cursor = document.createElement("div");
    cursor.className = "cyber-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML = `
      <span class="cyber-cursor-bracket"></span>
      <span class="cyber-cursor-core"></span>
      <span class="cyber-cursor-label">SYS//PTR</span>
    `;
    document.body.append(cursor);
    document.documentElement.classList.add("custom-cursor-ready");

    let pointerX = -100;
    let pointerY = -100;
    let framePending = false;

    const positionCursor = () => {
      cursor.style.setProperty("--cursor-x", `${pointerX}px`);
      cursor.style.setProperty("--cursor-y", `${pointerY}px`);
      framePending = false;
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        cursor.classList.add("is-visible");

        if (!framePending) {
          requestAnimationFrame(positionCursor);
          framePending = true;
        }
      },
      { passive: true }
    );

    document.addEventListener("pointerover", (event) => {
      cursor.classList.toggle(
        "is-interactive",
        Boolean(event.target.closest("a, button, [role='button']"))
      );
    });

    document.addEventListener("pointerdown", () => cursor.classList.add("is-active"));
    document.addEventListener("pointerup", () => cursor.classList.remove("is-active"));
    document.documentElement.addEventListener("mouseleave", () =>
      cursor.classList.remove("is-visible")
    );
  }

  // Add a background to the fixed header after the visitor starts scrolling.
  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Open and close the navigation menu on small screens.
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  // Close the mobile menu after a navigation link is selected.
  sectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  // Show or hide the optional technical details.
  technicalButton.addEventListener("click", () => {
    const isExpanded = technicalButton.getAttribute("aria-expanded") === "true";
    technicalButton.setAttribute("aria-expanded", String(!isExpanded));
    technicalDetails.hidden = isExpanded;
  });

  // Hide broken images so the designed placeholder underneath remains visible.
  document.querySelectorAll(".plot-image img").forEach((image) => {
    image.addEventListener("error", () => image.classList.add("is-missing"));

    // Handle images that failed before the event listener was added.
    if (image.complete && image.naturalWidth === 0) {
      image.classList.add("is-missing");
    }
  });

  // Highlight the navigation link that matches the section currently in view.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        sectionLinks.forEach((link) => {
          const matchesSection = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", matchesSection);
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );

  sections.forEach((section) => observer.observe(section));

  // Introduce research modules and fluid text waves without hiding content if JS is unavailable.
  if (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    "IntersectionObserver" in window
  ) {
    document.body.classList.add("motion-ready");
    moduleRevealTargets.forEach((target) => target.classList.add("reveal-target"));
    waveTextTargets.forEach(prepareFluidWave);

    const moduleObserver = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -45px" }
    );

    const waveObserver = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target;
          const overlay = target.querySelector(".wave-reveal__overlay");
          const delay = Number.parseFloat(
            target.style.getPropertyValue("--wave-delay")
          ) || 0;

          target.classList.add("is-wave-revealed");
          window.setTimeout(() => {
            target.classList.add("is-wave-complete");
            overlay?.remove();
          }, delay + 1500);
          activeObserver.unobserve(target);
        });
      },
      { threshold: 0.24, rootMargin: "0px 0px -35px" }
    );

    moduleRevealTargets.forEach((target) => moduleObserver.observe(target));
    waveTextTargets.forEach((target) => waveObserver.observe(target));
    document.documentElement.classList.add("wave-animation-ready");
  }

  // Keep the copyright year current automatically.
  document.querySelector("#current-year").textContent = new Date().getFullYear();
});
