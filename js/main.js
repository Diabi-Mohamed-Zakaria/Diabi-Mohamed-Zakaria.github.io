(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     Icons (small inline SVGs, currentColor so they inherit text color)
  --------------------------------------------------------------- */
  const ICON = {
    email: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 4h12v8H2V4Z" stroke="currentColor" stroke-width="1.3"/><path d="M2.5 4.5 8 9l5.5-4.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    phone: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 2.5h2L6.5 5 5 6.2c.5 1.4 1.9 2.8 3.3 3.3L9.5 8l2.5 1v2c0 .8-.7 1.5-1.5 1.5C6 12.5 3.5 10 3.5 5.5c0-.8.7-1.5 1.5-1.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    whatsapp: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2.5a5.5 5.5 0 0 0-4.7 8.4L2.5 13.5l2.7-.8A5.5 5.5 0 1 0 8 2.5Z" stroke="currentColor" stroke-width="1.2"/><path d="M5.8 5.7c.1-.3.4-.3.6-.3h.4c.1 0 .3 0 .4.3.2.4.5 1.2.5 1.3.1.1.1.2 0 .3l-.4.5c-.1.1-.1.2 0 .4.2.3.6.9 1.2 1.3.6.4.9.5 1.1.6.1 0 .2 0 .3-.1l.5-.6c.1-.2.2-.2.4-.1l1.1.5c.2.1.2.1.2.3 0 .2 0 .8-.3 1.1-.3.3-.9.6-1.6.5-1.6-.2-3.4-1.6-4.1-3.1-.2-.4-.4-1.1-.2-1.7Z" fill="currentColor"/></svg>',
    github: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.5a6.5 6.5 0 0 0-2.06 12.67c.33.06.44-.14.44-.31v-1.2c-1.8.39-2.18-.78-2.18-.78-.3-.75-.72-.95-.72-.95-.59-.4.04-.4.04-.4.65.05.99.67.99.67.58.99 1.52.7 1.89.54.06-.42.23-.7.41-.87-1.44-.16-2.95-.72-2.95-3.2 0-.71.25-1.28.67-1.74-.07-.16-.29-.83.06-1.73 0 0 .55-.18 1.79.66a6.2 6.2 0 0 1 3.26 0c1.24-.84 1.79-.66 1.79-.66.35.9.13 1.57.06 1.73.42.46.67 1.03.67 1.74 0 2.49-1.51 3.03-2.95 3.2.24.2.44.6.44 1.21v1.79c0 .17.11.38.44.31A6.5 6.5 0 0 0 8 1.5Z" fill="currentColor"/></svg>',
    linkedin: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M5 6.8V11M5 5v.01M7.5 11V6.8M7.5 8.5c0-.9.7-1.7 1.6-1.7s1.4.7 1.4 1.7V11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pin: '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 14.5S3 10 3 6.5a5 5 0 0 1 10 0c0 3.5-5 8-5 8Z" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="6.5" r="1.6" stroke="currentColor" stroke-width="1.2"/></svg>',
    copy: '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.2" stroke="currentColor" stroke-width="1.2"/><path d="M10.5 5.5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" stroke="currentColor" stroke-width="1.2"/></svg>'
  };

  const LINK_ORDER = ["email", "phone", "whatsapp", "github", "linkedin"];

  /* ---------------------------------------------------------------
     Language handling
  --------------------------------------------------------------- */
  function detectLang() {
    const stored = localStorage.getItem("lang");
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
    const nav = (navigator.language || "it").slice(0, 2).toLowerCase();
    return SUPPORTED_LANGS.includes(nav) ? nav : "it";
  }

  let currentLang = detectLang();
  let typeTimer = null;

  /* ---------------------------------------------------------------
     Theme handling (dark / light)
  --------------------------------------------------------------- */
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function renderTheme(t) {
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.setAttribute("aria-label", t.theme.label);
  }

  /* ---------------------------------------------------------------
     Render helpers
  --------------------------------------------------------------- */
  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function renderMeta(t) {
    document.documentElement.lang = currentLang;
    document.title = t.meta.title;
    document.getElementById("meta-description").setAttribute("content", t.meta.description);
    document.getElementById("meta-og-title").setAttribute("content", t.meta.title);
    document.getElementById("meta-og-description").setAttribute("content", t.meta.description);
  }

  function renderNav(t) {
    const items = [
      ["about", t.nav.about],
      ["path", t.nav.path],
      ["projects", t.nav.projects],
      ["skills", t.nav.skills],
      ["contact", t.nav.contact]
    ];

    const buildTabs = (extraClass) => items.map(([id, label]) =>
      `<a href="#${id}" data-nav-target="${id}" class="nav-tab ${extraClass}">${label}</a>`
    ).join("");

    document.getElementById("main-nav").innerHTML = buildTabs("");
    document.getElementById("mobile-nav").innerHTML = items.map(([id, label]) =>
      `<a href="#${id}" data-nav-target="${id}" class="nav-tab block px-2 py-2 rounded">${label}</a>`
    ).join("");

    const langBtns = (extraClass) => SUPPORTED_LANGS.map(l =>
      `<button type="button" data-lang="${l}" class="lang-pill ${extraClass} ${l === currentLang ? "is-active" : ""}">${l.toUpperCase()}</button>`
    ).join("");

    document.getElementById("lang-switch").innerHTML = langBtns("");
    document.getElementById("mobile-lang").innerHTML = langBtns("px-2 py-1 border border-edge rounded");
  }

  function renderHero(t) {
    document.getElementById("hero-eyebrow").textContent = t.hero.eyebrow;
    document.getElementById("hero-name").textContent = t.hero.name;
    document.getElementById("hero-bio").textContent = t.hero.bio;
    document.getElementById("hero-location").innerHTML = `${ICON.pin}<span>${t.hero.location}</span>`;
    document.getElementById("hero-status").innerHTML = `<span class="w-2 h-2 rounded-full bg-ok inline-block"></span><span>${t.hero.status}</span>`;
    document.getElementById("hero-cta-primary").textContent = t.hero.ctaPrimary;
    document.getElementById("hero-cta-secondary").textContent = t.hero.ctaSecondary;
    document.getElementById("hero-whoami-cmd").textContent = t.hero.whoamiCmd;

    const linksWrap = document.getElementById("hero-links");
    linksWrap.innerHTML = LINK_ORDER.map(key => {
      const label = t.contact.links[key];
      const href = CONTACT_HREF[key];
      const external = key === "github" || key === "linkedin" || key === "whatsapp";
      return `<a href="${href}" class="chip-link" ${external ? 'target="_blank" rel="noopener noreferrer"' : ""} aria-label="${label}">${ICON[key]}<span>${label}</span></a>`;
    }).join("");

    typeTagline(t.hero.tagline);
  }

  function typeTagline(text) {
    const node = document.getElementById("hero-tagline");
    if (typeTimer) clearInterval(typeTimer);

    if (prefersReducedMotion) {
      node.innerHTML = `${text}<span class="cursor-blink text-signal">▍</span>`;
      return;
    }

    node.innerHTML = '<span class="cursor-blink text-signal">▍</span>';
    let i = 0;
    typeTimer = setInterval(() => {
      i++;
      node.innerHTML = `${text.slice(0, i)}<span class="cursor-blink text-signal">▍</span>`;
      if (i >= text.length) clearInterval(typeTimer);
    }, 28);
  }

  function logItem(entry, withDesc) {
    return `
      <li class="log-item reveal">
        <span class="log-period">${entry.period}</span>
        <p class="log-title">${entry.title}</p>
        <p class="log-sub">${entry.sub}</p>
        ${withDesc && entry.desc ? `<p class="log-desc">${entry.desc}</p>` : ""}
        ${entry.tags ? `<div class="flex flex-wrap gap-1.5 mt-3">${entry.tags.map(tg => `<span class="tag">${tg}</span>`).join("")}</div>` : ""}
      </li>`;
  }

  function renderPath(t) {
    document.getElementById("path-title").textContent = t.path.title;
    document.getElementById("education-title").textContent = t.path.educationTitle;
    document.getElementById("experience-title").textContent = t.path.experienceTitle;
    document.getElementById("education-list").innerHTML = t.path.education.map(e => logItem(e, false)).join("");
    document.getElementById("experience-list").innerHTML = t.path.experience.map(e => logItem(e, true)).join("");
  }

  function projectCard(p, doneLabel) {
    return `
      <article class="project-card reveal">
        <span class="project-path">${p.path}</span>
        <div class="flex items-start justify-between gap-3">
          <h3 class="project-name">${p.name}</h3>
          ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="GitHub — ${p.name}">${ICON.github}</a>` : ""}
        </div>
        <span class="project-period">${p.period}</span>
        ${p.done ? `<span class="badge-done"><svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>${doneLabel}</span>` : ""}
        <p class="project-desc">${p.desc}</p>
        <div class="flex flex-wrap gap-1.5 mt-1">${p.tags.map(tg => `<span class="tag">${tg}</span>`).join("")}</div>
      </article>`;
  }

  function renderProjects(t) {
    document.getElementById("projects-title").textContent = t.projects.title;
    document.getElementById("projects-grid").innerHTML = t.projects.items
      .map(p => projectCard(p, t.projects.doneLabel)).join("");
  }

  function renderSkills(t) {
    document.getElementById("skills-title").textContent = t.skills.title;
    document.getElementById("skills-grid").innerHTML = t.skills.categories.map(cat => `
      <div class="reveal">
        <p class="skill-key">"${cat.label}"<span class="skill-punct">:</span></p>
        <div class="flex flex-wrap gap-1.5 mt-2">
          ${cat.items.map(it => `<span class="tag">${it}</span>`).join("")}
        </div>
      </div>
    `).join("");

    document.getElementById("languages-title").textContent = t.skills.languagesTitle;
    document.getElementById("languages-list").innerHTML = t.skills.languages.map(lg => `
      <div class="lang-row reveal">
        <div class="flex items-baseline justify-between font-mono text-xs mb-1.5">
          <span class="text-bone">${lg.name}</span>
          <span class="text-fog">${lg.level}</span>
        </div>
        <div class="lang-track"><div class="lang-fill" style="width:${lg.pct}%"></div></div>
      </div>
    `).join("");
  }

  function renderContact(t) {
    document.getElementById("contact-tabname").textContent = t.contact.tabname;
    document.getElementById("contact-title").textContent = t.contact.title;
    document.getElementById("contact-subtitle").textContent = t.contact.subtitle;

    const linksWrap = document.getElementById("contact-links");
    linksWrap.innerHTML = LINK_ORDER.map(key => {
      const label = t.contact.links[key];
      const href = CONTACT_HREF[key];
      const external = key === "github" || key === "linkedin" || key === "whatsapp";
      return `<a href="${href}" class="chip-link" ${external ? 'target="_blank" rel="noopener noreferrer"' : ""} aria-label="${label}">${ICON[key]}<span>${label}</span></a>`;
    }).join("") + `<button type="button" data-copy-email class="chip-link" aria-label="${t.contact.copy}">${ICON.copy}<span data-copy-label>${t.contact.copy}</span></button>`;
  }

  function renderFooter(t) {
    const year = new Date().getFullYear();
    document.getElementById("footer-tagline").textContent = t.footer.tagline;
    document.getElementById("footer-meta").textContent = `© ${year} Diabi Mohamed Zakaria · ${t.footer.updated}`;
  }

  function render() {
    const t = SITE_CONTENT[currentLang];
    renderMeta(t);
    renderNav(t);
    renderTheme(t);
    renderHero(t);
    renderPath(t);
    renderProjects(t);
    renderSkills(t);
    renderContact(t);
    renderFooter(t);
    setupReveal();
    updateActiveNav();
  }

  /* ---------------------------------------------------------------
     Scroll spy (highlights the tab matching the section in view)
  --------------------------------------------------------------- */
  const sectionIds = ["about", "path", "projects", "skills", "contact"];

  function updateActiveNav() {
    const mid = window.scrollY + window.innerHeight * 0.3;
    let activeId = sectionIds[0];
    for (const id of sectionIds) {
      const sec = document.getElementById(id);
      if (sec && sec.offsetTop <= mid) activeId = id;
    }
    document.querySelectorAll("[data-nav-target]").forEach(a => {
      a.classList.toggle("is-active", a.getAttribute("data-nav-target") === activeId);
    });
  }

  /* ---------------------------------------------------------------
     Reveal-on-scroll
  --------------------------------------------------------------- */
  let revealObserver = null;
  function setupReveal() {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    }
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(node => revealObserver.observe(node));
  }

  /* ---------------------------------------------------------------
     Event delegation (survives re-renders since it's on document)
  --------------------------------------------------------------- */
  document.addEventListener("click", (e) => {
    const themeBtn = e.target.closest("#theme-toggle");
    if (themeBtn) {
      const next = currentTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      return;
    }

    const langBtn = e.target.closest("[data-lang]");
    if (langBtn) {
      const lang = langBtn.getAttribute("data-lang");
      if (lang !== currentLang) {
        currentLang = lang;
        localStorage.setItem("lang", lang);
        render();
      }
      closeMobilePanel();
      return;
    }

    const navLink = e.target.closest("[data-nav-target]");
    if (navLink) {
      closeMobilePanel();
      return;
    }

    const copyBtn = e.target.closest("[data-copy-email]");
    if (copyBtn) {
      const t = SITE_CONTENT[currentLang];
      navigator.clipboard.writeText("mohamedzakariadiabi@gmail.com").then(() => {
        const label = copyBtn.querySelector("[data-copy-label]");
        const original = t.contact.copy;
        label.textContent = t.contact.copied;
        setTimeout(() => { label.textContent = original; }, 1800);
      }).catch(() => {});
      return;
    }

    if (e.target.closest("#mobile-menu-btn")) {
      toggleMobilePanel();
    }
  });

  function toggleMobilePanel() {
    const panel = document.getElementById("mobile-panel");
    const btn = document.getElementById("mobile-menu-btn");
    const willOpen = panel.classList.contains("hidden");
    panel.classList.toggle("hidden", !willOpen);
    btn.setAttribute("aria-expanded", String(willOpen));
  }
  function closeMobilePanel() {
    document.getElementById("mobile-panel").classList.add("hidden");
    document.getElementById("mobile-menu-btn").setAttribute("aria-expanded", "false");
  }

  window.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateActiveNav);
  }, { passive: true });

  /* ---------------------------------------------------------------
     Init
  --------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", render);
})();
