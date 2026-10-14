(() => {
  "use strict";
  if (document.getElementById("dz-mascot")) return;

  const SIZE = 52;
  const FLEE_THRESHOLD = 120;
  const SAFE_MARGIN = 16;
  const FLEE_DURATION = 220;   // ms — should stay >= the CSS left/top transition
  const SCARED_HOLD = 250;     // ms the "scared" face stays after fleeing
  const HAPPY_DURATION = 650; // ms of celebration after being clicked/tapped
  const TAUNT_DURATION = 2200;
  const TAUNT_COOLDOWN = 3000;
  const lines = {
    it: { welcome: "Benvenuto nel mio portfolio! Prova a prendermi 🙂", chase: ["Troppo lento!", "Quasi preso!", "Riprova!"], caught: "Mi hai preso!" },
    en: { welcome: "Welcome to my portfolio! Try to catch me 🙂", chase: ["Too slow!", "Almost got me!", "Try again!"], caught: "You got me!" },
    fr: { welcome: "Bienvenue dans mon portfolio ! Essaie de m'attraper 🙂", chase: ["Trop lent !", "Presque !", "Essaie encore !"], caught: "Tu m'as eu !" }
  };
  const contextualLines = {
    it: { projects: "È difficile trascinare o vedere tutti i pianeti? Premi «Vista griglia» per esplorare tutti i progetti.", contact: "Qui puoi scaricare il mio CV o contattarmi." },
    en: { projects: "Hard to drag or see every planet? Choose “Grid view” to explore all projects.", contact: "Here you can download my CV or contact me." },
    fr: { projects: "Difficile de déplacer ou voir toutes les planètes ? Choisis « Vue grille » pour tous les projets.", contact: "Ici, tu peux télécharger mon CV ou me contacter." }
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const interactive = !prefersReducedMotion && !isTouch;

  const style = document.createElement("style");
  style.textContent = `
    .dz-mascot {
      position: fixed;
      width: ${SIZE}px;
      height: ${SIZE}px;
      border-radius: 50%;
      padding: 0;
      background: linear-gradient(135deg, rgb(255 255 255 / .16), rgb(255 255 255 / .025) 48%, rgb(255 255 255 / .08));
      border: 1px solid rgb(255 255 255 / .3);
      box-shadow: inset 0 1px 2px rgb(255 255 255 / .45), inset 0 -1px 1px rgb(255 255 255 / .12), 0 6px 20px rgb(0 0 0 / .18);
      backdrop-filter: blur(8px) saturate(150%);
      -webkit-backdrop-filter: blur(8px) saturate(150%);
      z-index: 75;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      cursor: pointer;
      pointer-events: auto;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      transition: left 200ms cubic-bezier(0.16, 1, 0.3, 1),
                  top 200ms cubic-bezier(0.16, 1, 0.3, 1),
                  border-color 200ms ease;
    }
    .dz-mascot::before {
      content: '';
      position: absolute;
      inset: 3px 9px auto;
      height: 25%;
      border-radius: 50%;
      background: linear-gradient(180deg, rgb(255 255 255 / .2), transparent);
      pointer-events: none;
    }
    html[data-theme="light"] .dz-mascot {
      border-color: rgb(255 255 255 / .8);
      box-shadow: inset 0 1px 2px rgb(255 255 255 / .9), inset 0 -1px 1px rgb(0 0 0 / .06), 0 6px 20px rgb(30 24 14 / .14);
    }
    .dz-mascot[data-expression="scared"] { border-color: rgb(var(--color-signal-rgb)); }
    .dz-mascot.dz-bounce { animation: dz-bounce 450ms cubic-bezier(0.34, 1.56, 0.64, 1); }
    @keyframes dz-bounce {
      0%   { transform: scale(1) rotate(0deg); }
      30%  { transform: scale(1.25) rotate(-12deg); }
      55%  { transform: scale(0.92) rotate(10deg); }
      75%  { transform: scale(1.08) rotate(-4deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    .dz-eyes { display: flex; gap: 6px; }
    .dz-eye {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: rgb(var(--color-bone-rgb));
      position: relative;
      transition: width 150ms ease, height 150ms ease;
    }
    .dz-mascot[data-expression="scared"] .dz-eye { width: 18px; height: 18px; }
    .dz-mascot[data-expression="happy"] .dz-eye {
      height: 3px;
      border-radius: 3px;
      align-self: center;
    }
    .dz-pupil {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: rgb(var(--color-ink-rgb));
      transform: translate(-50%, -50%);
    }
    .dz-mascot[data-expression="happy"] .dz-pupil { opacity: 0; }
    .dz-mouth {
      width: 14px;
      height: 3px;
      border-radius: 2px;
      background: rgb(var(--color-bone-rgb));
    }
    .dz-mascot[data-expression="scared"] .dz-mouth {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgb(var(--color-bone-rgb));
    }
    .dz-mascot[data-expression="happy"] .dz-mouth {
      width: 16px;
      height: 8px;
      border-radius: 0 0 8px 8px;
      background: transparent;
      border: none;
      border-bottom: 2px solid rgb(var(--color-bone-rgb));
    }
    .dz-fx {
      position: absolute;
      left: 50%;
      top: -4px;
      transform: translate(-50%, 0);
      font-size: 20px;
      line-height: 1;
      opacity: 0;
      pointer-events: none;
    }
    .dz-fx.dz-fx-active { animation: dz-fx-pop 650ms ease-out forwards; }
    .dz-mascot-bubble {
      position: fixed;
      z-index: 75;
      max-width: min(260px, calc(100vw - 32px));
      padding: 9px 12px;
      border-radius: 9px;
      border: 1px solid rgb(var(--color-signal-rgb));
      background: rgb(var(--color-panel-rgb));
      color: rgb(var(--color-bone-rgb));
      box-shadow: 0 4px 14px rgba(0,0,0,.25);
      font: 600 13px/1.4 'JetBrains Mono', monospace;
      text-align: center;
      pointer-events: none;
      opacity: 0;
      transition: opacity 160ms ease;
    }
    .dz-mascot-bubble::after {
      content: '';
      position: absolute;
      left: var(--dz-pointer-x, 25px);
      bottom: -6px;
      width: 10px;
      height: 10px;
      background: rgb(var(--color-panel-rgb));
      border-right: 1px solid rgb(var(--color-signal-rgb));
      border-bottom: 1px solid rgb(var(--color-signal-rgb));
      transform: rotate(45deg);
    }
    .dz-mascot-bubble[data-placement="below"]::after {
      top: -6px;
      bottom: auto;
      border: 0;
      border-left: 1px solid rgb(var(--color-signal-rgb));
      border-top: 1px solid rgb(var(--color-signal-rgb));
    }
    .dz-mascot-bubble[data-visible="true"] { opacity: 1; }
    @keyframes dz-fx-pop {
      0%   { opacity: 0; transform: translate(-50%, 0) scale(0.6); }
      20%  { opacity: 1; transform: translate(-50%, -6px) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -34px) scale(1); }
    }
    .dz-mascot:focus-visible { outline: 3px solid rgb(var(--color-signal-rgb)); outline-offset: 7px; }
  `;
  document.head.appendChild(style);

  const root = document.createElement("button");
  root.id = "dz-mascot";
  root.className = "dz-mascot";
  root.type = "button";
  root.setAttribute("aria-label", "Prova a prendere la mascotte");
  root.setAttribute("data-expression", "neutral");
  root.innerHTML = `
    <div class="dz-eyes" aria-hidden="true">
      <div class="dz-eye"><span class="dz-pupil"></span></div>
      <div class="dz-eye"><span class="dz-pupil"></span></div>
    </div>
    <div class="dz-mouth" aria-hidden="true"></div>
    <div class="dz-fx" aria-hidden="true"></div>
  `;
  document.body.appendChild(root);
  const bubble = document.createElement("div");
  bubble.className = "dz-mascot-bubble";
  bubble.setAttribute("aria-hidden", "true");
  document.body.appendChild(bubble);

  const eyes = root.querySelectorAll(".dz-eye");
  const pupils = root.querySelectorAll(".dz-pupil");
  const fx = root.querySelector(".dz-fx");

  function headerHeight() {
    const h = document.querySelector("header");
    return h ? h.getBoundingClientRect().height : 56;
  }

  function bounds() {
    const minY = headerHeight() + SAFE_MARGIN;
    return {
      minX: SAFE_MARGIN,
      maxX: Math.max(SAFE_MARGIN, window.innerWidth - SIZE - SAFE_MARGIN),
      minY,
      maxY: Math.max(minY, window.innerHeight - SIZE - SAFE_MARGIN)
    };
  }

  function clampPos(x, y) {
    const b = bounds();
    return {
      x: Math.min(Math.max(x, b.minX), b.maxX),
      y: Math.min(Math.max(y, b.minY), b.maxY)
    };
  }

  let pos = clampPos(24, window.innerHeight - SIZE - 28);
  function placeBubble() {
    const width = bubble.offsetWidth || 150;
    const left = Math.max(8, Math.min(window.innerWidth - width - 8, pos.x + SIZE / 2 - width / 2));
    bubble.style.left = left + "px";
    bubble.style.setProperty("--dz-pointer-x", Math.max(12, Math.min(width - 22, pos.x + SIZE / 2 - left - 5)) + "px");
    const above = pos.y >= headerHeight() + 72;
    bubble.dataset.placement = above ? "above" : "below";
    bubble.style.top = above ? "auto" : Math.round(pos.y + SIZE + 10) + "px";
    bubble.style.bottom = above ? Math.round(window.innerHeight - pos.y + 10) + "px" : "auto";
  }
  function applyPos() {
    root.style.left = pos.x + "px";
    root.style.top = pos.y + "px";
    placeBubble();
  }
  applyPos();

  function center() {
    return { x: pos.x + SIZE / 2, y: pos.y + SIZE / 2 };
  }

  function randomPos(avoidPoint) {
    const b = bounds();
    let candidate = { x: b.minX, y: b.minY };
    for (let i = 0; i < 10; i++) {
      const x = b.minX + Math.random() * (b.maxX - b.minX);
      const y = b.minY + Math.random() * (b.maxY - b.minY);
      candidate = { x, y };
      if (!avoidPoint) break;
      const cx = x + SIZE / 2, cy = y + SIZE / 2;
      if (Math.hypot(cx - avoidPoint.x, cy - avoidPoint.y) > FLEE_THRESHOLD * 1.4) break;
    }
    return candidate;
  }

  let isFleeing = false;
  let isCaptured = false;
  let expressionResetTimer = null;
  let bubbleTimer = null;
  let lastTaunt = -TAUNT_COOLDOWN;
  let tauntIndex = 0;
  const language = () => lines[document.documentElement.lang] || lines.it;

  function say(message, duration = TAUNT_DURATION, kind = "") {
    clearTimeout(bubbleTimer);
    bubble.textContent = message;
    bubble.dataset.kind = kind;
    bubble.dataset.visible = "true";
    placeBubble();
    bubbleTimer = setTimeout(() => { bubble.dataset.visible = "false"; }, duration);
  }

  say(language().welcome, 4200, "welcome");
  new MutationObserver(() => {
    if (bubble.dataset.visible === "true" && bubble.dataset.kind === "welcome") {
      bubble.textContent = language().welcome;
      placeBubble();
    }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  function setExpression(name, holdMs) {
    root.setAttribute("data-expression", name);
    if (expressionResetTimer) clearTimeout(expressionResetTimer);
    if (holdMs) {
      expressionResetTimer = setTimeout(() => {
        if (!isCaptured) root.setAttribute("data-expression", "neutral");
      }, holdMs);
    }
  }

  function flee(mouse) {
    if (isFleeing || isCaptured) return;
    isFleeing = true;
    setExpression("scared", SCARED_HOLD);
    pos = randomPos(mouse);
    applyPos();
    if (performance.now() - lastTaunt >= TAUNT_COOLDOWN) {
      say(language().chase[tauntIndex++ % language().chase.length]);
      lastTaunt = performance.now();
    }
    setTimeout(() => { isFleeing = false; }, FLEE_DURATION);
  }

  if (interactive) {
    let lastMouse = null;

    document.addEventListener("pointermove", (e) => {
      lastMouse = { x: e.clientX, y: e.clientY };
    }, { passive: true });

    function tick() {
      requestAnimationFrame(tick);
      if (!lastMouse) return;

      eyes.forEach((eye, i) => {
        const r = eye.getBoundingClientRect();
        const ex = r.left + r.width / 2, ey = r.top + r.height / 2;
        const dx = lastMouse.x - ex, dy = lastMouse.y - ey;
        const dist = Math.hypot(dx, dy) || 1;
        const range = 3.5;
        const pull = Math.min(range, dist / 8);
        const ox = (dx / dist) * pull, oy = (dy / dist) * pull;
        pupils[i].style.transform = `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`;
      });

      if (isCaptured) return;
      const c = center();
      if (Math.hypot(lastMouse.x - c.x, lastMouse.y - c.y) < FLEE_THRESHOLD) {
        flee(lastMouse);
      }
    }
    requestAnimationFrame(tick);
  }

  root.addEventListener("click", () => {
    isCaptured = true;
    if (expressionResetTimer) clearTimeout(expressionResetTimer);
    setExpression("happy");
    say(language().caught, 1200);

    root.classList.remove("dz-bounce");
    void root.offsetWidth; // restart the CSS animation
    root.classList.add("dz-bounce");

    fx.textContent = "🎉";
    fx.classList.remove("dz-fx-active");
    void fx.offsetWidth;
    fx.classList.add("dz-fx-active");

    setTimeout(() => {
      isCaptured = false;
      root.setAttribute("data-expression", "neutral");
      root.classList.remove("dz-bounce");
      fx.classList.remove("dz-fx-active");
    }, HAPPY_DURATION);
  });

  if ("IntersectionObserver" in window) {
    const shown = new Set();
    let lastHint = -12000;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const section = entry.target.id;
        if (!entry.isIntersecting || shown.has(section) || document.hidden) continue;
        if (section === "projects" && document.getElementById("solar-view-toggle").classList.contains("hidden")) continue;
        if (performance.now() - lastHint < 12000) continue;
        shown.add(section);
        lastHint = performance.now();
        const lang = document.documentElement.lang;
        say((contextualLines[lang] || contextualLines.it)[section], section === "projects" ? 6000 : 4500);
      }
    }, { threshold: 0.1 });
    ["projects", "contact"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      pos = clampPos(pos.x, pos.y);
      applyPos();
    }, 150);
  });
})();
