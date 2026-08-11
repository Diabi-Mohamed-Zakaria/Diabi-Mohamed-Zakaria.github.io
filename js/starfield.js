(() => {
  "use strict";

  const canvas = document.getElementById("starfield-canvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");

  const MOBILE_QUERY = window.matchMedia("(max-width: 640px)");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const STAR_COUNT_DESKTOP = 180;
  const STAR_COUNT_MOBILE = 60;
  const MOUSE_PARALLAX_PX = 14; // max mouse-driven offset, in css px
  const SCROLL_PARALLAX_FACTOR = 0.04; // fraction of scroll delta applied as offset
  const LERP_EASE = 0.06;

  // faint white / amber / pale-azure, matching the terminal accent palette
  const STAR_COLORS = ["255,255,255", "245,166,35", "154,196,255"];

  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let cssWidth = window.innerWidth;
  let cssHeight = window.innerHeight;
  let stars = [];

  let mouseTargetX = 0, mouseTargetY = 0, mouseX = 0, mouseY = 0;
  let scrollTargetY = 0, scrollY = 0;
  let rafId = null;

  function isMobile() {
    return MOBILE_QUERY.matches;
  }

  function randomStar() {
    return {
      x: Math.random() * cssWidth,
      y: Math.random() * cssHeight,
      r: 1 + Math.random(), // 1-2px
      color: STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0],
      baseAlpha: 0.35 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.6
    };
  }

  function generateStars() {
    const count = isMobile() ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;
    stars = Array.from({ length: count }, randomStar);
  }

  function sizeCanvas() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    cssWidth = window.innerWidth;
    cssHeight = window.innerHeight;
    canvas.style.width = cssWidth + "px";
    canvas.style.height = cssHeight + "px";
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawFrame(timeMs) {
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const offsetX = mouseX;
    const offsetY = mouseY + scrollY * SCROLL_PARALLAX_FACTOR;
    const t = timeMs * 0.001;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const twinkle = prefersReducedMotion
        ? s.baseAlpha
        : s.baseAlpha * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      const alpha = Math.max(0.05, Math.min(1, twinkle));

      ctx.beginPath();
      ctx.fillStyle = `rgba(${s.color},${alpha})`;
      ctx.arc(s.x + offsetX, s.y + offsetY, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tick(timeMs) {
    mouseX += (mouseTargetX - mouseX) * LERP_EASE;
    mouseY += (mouseTargetY - mouseY) * LERP_EASE;
    scrollY += (scrollTargetY - scrollY) * LERP_EASE;

    drawFrame(timeMs);
    rafId = requestAnimationFrame(tick);
  }

  function onMouseMove(e) {
    if (isMobile()) return;
    const nx = e.clientX / cssWidth - 0.5;
    const ny = e.clientY / cssHeight - 0.5;
    // stars drift opposite to the cursor
    mouseTargetX = -nx * MOUSE_PARALLAX_PX;
    mouseTargetY = -ny * MOUSE_PARALLAX_PX;
  }

  function onScroll() {
    if (isMobile()) return;
    scrollTargetY = -window.scrollY;
  }

  let resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      sizeCanvas();
      generateStars();
      if (prefersReducedMotion) drawFrame(0);
    }, 150);
  }

  function init() {
    sizeCanvas();
    generateStars();

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    if (prefersReducedMotion) {
      drawFrame(0);
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  window.addEventListener("pagehide", () => {
    if (rafId) cancelAnimationFrame(rafId);
  });

  init();
})();
