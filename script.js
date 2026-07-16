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
  const waterTextTargets = document.querySelectorAll(
    [
      "main section:not(.hero) .section-number",
      "main section:not(.hero) h2",
      "main section:not(.hero) h3",
      "main section:not(.hero) p",
      ".in-progress-note",
      "blockquote p",
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

  const createEntranceFlow = (target) => {
    const bounds = target.getBoundingClientRect();
    const flow = document.createElement("span");
    const dropletCount = 2 + Math.floor(Math.random() * 3);
    const flowDistance = 44 + Math.random() * 14;

    flow.className = "water-splash water-splash--entrance";
    flow.setAttribute("aria-hidden", "true");
    flow.style.setProperty(
      "--splash-x",
      `${Math.min(window.innerWidth - 14, bounds.right - 4)}px`
    );
    flow.style.setProperty("--splash-y", `${bounds.top + bounds.height * 0.55}px`);
    flow.innerHTML = Array.from(
      { length: dropletCount },
      () => {
        const width = 12 + Math.random() * 6;
        const height = 3.5 + Math.random() * 2;
        const startY = -6 + Math.random() * 12;
        const curveDirection = Math.random() < 0.5 ? -1 : 1;
        const curveY = curveDirection * (7 + Math.random() * 10);
        const endY = -startY;
        const lateY = curveY * 0.38 + endY * 0.62;
        const duration = 560 + Math.random() * 360;
        const delay = Math.random() * 180;
        const stretch = 0.9 + Math.random() * 0.85;

        return `<i class="water-droplet" style="--flow-y:${startY}px; --flow-curve-y:${curveY}px; --flow-late-y:${lateY}px; --flow-end-y:${endY}px; --flow-distance:${flowDistance}px; --flow-width:${width}px; --flow-height:${height}px; --flow-duration:${duration}ms; --flow-delay:${delay}ms; --flow-stretch:${stretch}"></i>`;
      }
    ).join("");

    document.body.append(flow);
    window.setTimeout(() => flow.remove(), 1200);
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

  // Introduce research modules as they enter view without hiding content when JS is unavailable.
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.classList.add("motion-ready");
    moduleRevealTargets.forEach((target) => target.classList.add("reveal-target"));
    waterTextTargets.forEach((target, index) => {
      target.classList.add("water-reveal");
      target.style.setProperty("--reveal-delay", `${(index % 6) * 70}ms`);
    });

    const revealObserver = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          if (entry.target.classList.contains("water-reveal")) {
            const delay = Number.parseFloat(
              entry.target.style.getPropertyValue("--reveal-delay")
            ) || 0;
            window.setTimeout(() => createEntranceFlow(entry.target), delay + 780);
          }
          activeObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -45px" }
    );

    [...moduleRevealTargets, ...waterTextTargets].forEach((target) =>
      revealObserver.observe(target)
    );
  }

  // Keep the copyright year current automatically.
  document.querySelector("#current-year").textContent = new Date().getFullYear();
});
