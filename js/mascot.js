(() => {
  "use strict";
  if (document.getElementById("dz-mascot")) return;

  const SIZE = 52;
  const FLEE_THRESHOLD = 120;
  const SAFE_MARGIN = 16;
  const FLEE_DURATION = 320;   // ms — should stay >= the CSS left/top transition
  const SCARED_HOLD = 380;     // ms the "scared" face stays after fleeing
  const HAPPY_DURATION = 1000; // ms of celebration after being clicked/tapped

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
      background: rgb(var(--color-panel2-rgb));
      border: 2px solid rgb(var(--color-edge-rgb));
      box-shadow: 0 4px 14px rgba(0,0,0,0.35);
      z-index: 2147483000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      cursor: pointer;
      pointer-events: auto;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      transition: left 300ms cubic-bezier(0.16, 1, 0.3, 1),
                  top 300ms cubic-bezier(0.16, 1, 0.3, 1),
                  border-color 200ms ease;
    }
    .dz-mascot[data-expression="scared"] { border-color: rgb(var(--color-signal-rgb)); }
    .dz-mascot.dz-bounce { animation: dz-bounce 550ms cubic-bezier(0.34, 1.56, 0.64, 1); }
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
      background: rgb(var(--color-fog-rgb));
    }
    .dz-mascot[data-expression="scared"] .dz-mouth {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgb(var(--color-ink-rgb));
    }
    .dz-mascot[data-expression="happy"] .dz-mouth {
      width: 16px;
      height: 8px;
      border-radius: 0 0 8px 8px;
      background: transparent;
      border: none;
      border-bottom: 2px solid rgb(var(--color-ink-rgb));
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
    .dz-fx.dz-fx-active { animation: dz-fx-pop 900ms ease-out forwards; }
    @keyframes dz-fx-pop {
      0%   { opacity: 0; transform: translate(-50%, 0) scale(0.6); }
      20%  { opacity: 1; transform: translate(-50%, -6px) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -34px) scale(1); }
    }
  `;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.id = "dz-mascot";
  root.className = "dz-mascot";
  root.setAttribute("aria-hidden", "true");
  root.setAttribute("data-expression", "neutral");
  root.innerHTML = `
    <div class="dz-eyes">
      <div class="dz-eye"><span class="dz-pupil"></span></div>
      <div class="dz-eye"><span class="dz-pupil"></span></div>
    </div>
    <div class="dz-mouth"></div>
    <div class="dz-fx"></div>
  `;
  document.body.appendChild(root);

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

  let pos = clampPos(window.innerWidth - SIZE - 24, window.innerHeight - SIZE - 24);
  function applyPos() {
    root.style.left = pos.x + "px";
    root.style.top = pos.y + "px";
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

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      pos = clampPos(pos.x, pos.y);
      applyPos();
    }, 150);
  });
})();
