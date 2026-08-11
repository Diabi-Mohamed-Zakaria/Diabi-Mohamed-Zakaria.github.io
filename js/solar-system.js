(async () => {
  "use strict";

  const wrap = document.getElementById("solar-system-wrap");
  const grid = document.getElementById("projects-grid");
  const host = document.getElementById("solar-system-canvas-host");
  const toggleBtn = document.getElementById("solar-view-toggle");
  const tooltip = document.getElementById("solar-tooltip");
  const hintEl = document.getElementById("solar-hint");
  const modal = document.getElementById("project-modal");
  const modalClose = document.getElementById("project-modal-close");
  const modalBackdrop = document.getElementById("project-modal-backdrop");
  const modalPath = document.getElementById("project-modal-path");
  const modalTitle = document.getElementById("project-modal-title");
  const modalPeriod = document.getElementById("project-modal-period");
  const modalDesc = document.getElementById("project-modal-desc");
  const modalTags = document.getElementById("project-modal-tags");
  const modalDone = document.getElementById("project-modal-done");

  if (!wrap || !grid || !host || !toggleBtn || !tooltip || !modal) return;

  const CATEGORY_COLOR = {
    mobile: 0x4fd1c5,
    backend: 0xe8a33d,
    web: 0x6fa8dc,
    academic: 0xb18cf2,
    ai: 0xe8735d,
    database: 0x6fcf97
  };
  const DEFAULT_COLOR = 0x9098ac;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobileQuery = window.matchMedia("(max-width: 640px)");

  function getLang() {
    return document.documentElement.getAttribute("lang") || "it";
  }
  function getContent() {
    const dict = window.SITE_CONTENT;
    return (dict && dict[getLang()]) || (dict && dict.it);
  }
  function getProjectItems() {
    const t = getContent();
    return (t && t.projects && t.projects.items) || [];
  }

  let sceneActive = false;

  function applyStaticLabels() {
    const t = getContent();
    if (!t || !t.solar) return;
    hintEl.textContent = t.solar.hint;
    modalClose.setAttribute("aria-label", t.solar.close);
    toggleBtn.textContent = sceneActive ? t.solar.gridToggle : t.solar.sceneToggle;
  }

  new MutationObserver(applyStaticLabels).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });

  function supportsWebGL() {
    try {
      const c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext &&
        (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  }

  if (!supportsWebGL()) {
    console.info("[solar-system] WebGL non disponibile: resto sulla griglia.");
    return;
  }

  let THREE, OrbitControls;
  try {
    THREE = await import("three");
    ({ OrbitControls } = await import("three/addons/controls/OrbitControls.js"));
  } catch (err) {
    console.warn("[solar-system] impossibile caricare Three.js, resto sulla griglia.", err);
    return;
  }

  let renderer, scene, camera, controls, star, meshes = [];
  let rafId = null;
  let elapsed = 0;
  let timeScale = 1;
  let timeScaleTarget = 1;
  let hovered = null;

  function makeGlowTexture() {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(232,163,61,0.55)");
    grad.addColorStop(1, "rgba(232,163,61,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
  }

  function makeLabelTexture(text) {
    const size = 256;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#14110c"; // pairs with --color-on-signal
    ctx.font = "800 112px Sora, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, size / 2, size / 2 + 8);
    return new THREE.CanvasTexture(c);
  }

  function buildPlanets(items) {
    const group = new THREE.Group();
    scene.add(group);

    items.forEach((p, i) => {
      const a = 2.6 + i * 1.15;
      const b = a * (0.72 + (i % 3) * 0.08);
      const speed = 0.35 / Math.sqrt(a);
      const phase = (i / items.length) * Math.PI * 2 + i * 0.7;
      const radius = 0.34 + Math.min((p.tags || []).length, 8) * 0.03;
      const color = CATEGORY_COLOR[p.category] || DEFAULT_COLOR;

      const geo = new THREE.SphereGeometry(radius, 24, 24);
      const mat = new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: 0.25, roughness: 0.6, metalness: 0.1
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { index: i, a, b, speed, phase, baseEmissive: 0.25 };
      group.add(mesh);
      meshes.push(mesh);

      const segments = 128;
      const pts = [];
      for (let s = 0; s <= segments; s++) {
        const th = (s / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(th) * a, 0, Math.sin(th) * b));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const ringMat = new THREE.LineBasicMaterial({ color: 0x2a2f3a, transparent: true, opacity: 0.5 });
      group.add(new THREE.LineLoop(ringGeo, ringMat));
    });
  }

  function buildStar() {
    const geo = new THREE.SphereGeometry(1.1, 32, 32);
    const mat = new THREE.MeshBasicMaterial({ color: 0xe8a33d });
    star = new THREE.Mesh(geo, mat);
    scene.add(star);

    const glowMat = new THREE.SpriteMaterial({
      map: makeGlowTexture(), color: 0xe8a33d, transparent: true,
      opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(6, 6, 1);
    star.add(glow);

    const labelMat = new THREE.SpriteMaterial({
      map: makeLabelTexture("DMZ"), transparent: true, depthTest: false
    });
    const label = new THREE.Sprite(labelMat);
    label.scale.set(1.3, 1.3, 1);
    label.renderOrder = 999;
    star.add(label);

    const light = new THREE.PointLight(0xffd9a0, 2.2, 60, 2);
    star.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 0.6));
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function showTooltip(index, x, y) {
    const items = getProjectItems();
    const p = items[index];
    if (!p) return;
    const stack = (p.tags || []).slice(0, 4).map(escapeHtml).join(" · ");
    tooltip.innerHTML = `<strong class="text-bone">${escapeHtml(p.name)}</strong><br><span class="text-fog">${stack}</span>`;
    tooltip.classList.remove("hidden");
    positionTooltip(x, y);
  }

  function positionTooltip(x, y) {
    const rect = host.getBoundingClientRect();
    const pad = 14;
    let left = x + pad;
    let top = y + pad;
    if (left + 210 > rect.width) left = Math.max(0, x - 210 - pad);
    if (top + 60 > rect.height) top = Math.max(0, y - 60 - pad);
    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
  }

  function hideTooltip() {
    tooltip.classList.add("hidden");
  }

  function openModal(index) {
    const items = getProjectItems();
    const t = getContent();
    const p = items[index];
    if (!p || !t) return;

    modalPath.textContent = p.path || "";
    modalTitle.textContent = p.name;
    modalPeriod.textContent = p.period || "";
    modalDesc.textContent = p.desc || "";
    modalTags.innerHTML = (p.tags || []).map(tg => `<span class="tag">${escapeHtml(tg)}</span>`).join("");

    if (p.done) {
      // full class list, not classList.add: badge-done's display:inline-flex
      // must never coexist with the "hidden" utility on this element
      modalDone.className = "badge-done shrink-0";
      modalDone.innerHTML = `<svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>${escapeHtml(t.projects.doneLabel)}`;
    } else {
      modalDone.className = "hidden shrink-0";
      modalDone.innerHTML = "";
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2();
  let downX = 0, downY = 0, downTime = 0;

  function setHovered(mesh) {
    if (hovered === mesh) return;
    if (hovered) hovered.material.emissiveIntensity = hovered.userData.baseEmissive;
    hovered = mesh;
    if (hovered) hovered.material.emissiveIntensity = 0.9;
    timeScaleTarget = hovered ? 0.25 : 1;
    renderer.domElement.style.cursor = hovered ? "pointer" : "grab";
  }

  function hitTestAt(clientX, clientY) {
    const rect = host.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    pointerNDC.x = (x / rect.width) * 2 - 1;
    pointerNDC.y = -(y / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointerNDC, camera);
    const hits = raycaster.intersectObjects(meshes, false);
    return { hit: hits.length ? hits[0].object : null, x, y };
  }

  function onPointerMove(e) {
    const { hit, x, y } = hitTestAt(e.clientX, e.clientY);
    setHovered(hit);
    if (hit) showTooltip(hit.userData.index, x, y);
    else hideTooltip();
  }

  function onPointerDown(e) {
    downX = e.clientX;
    downY = e.clientY;
    downTime = performance.now();
  }

  function onPointerUp(e) {
    const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
    const dt = performance.now() - downTime;
    if (dist < 6 && dt < 500) {
      const { hit } = hitTestAt(e.clientX, e.clientY);
      if (hit) openModal(hit.userData.index);
    }
  }

  function onPointerLeaveHost() {
    setHovered(null);
    hideTooltip();
  }

  let resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobileQuery.matches ? 1.5 : 2));
    }, 150);
  }

  const clock = new THREE.Clock();
  function animate() {
    rafId = requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.1);
    timeScale += (timeScaleTarget - timeScale) * 0.05;
    const scaledDelta = prefersReducedMotion ? 0 : delta * timeScale;
    elapsed += scaledDelta;

    for (const mesh of meshes) {
      const { a, b, speed, phase } = mesh.userData;
      const th = elapsed * speed + phase;
      mesh.position.set(Math.cos(th) * a, 0, Math.sin(th) * b);
      mesh.rotation.y += scaledDelta * 3;
    }
    if (star) star.rotation.y += scaledDelta * 0.3;

    controls.update();
    renderer.render(scene, camera);
  }

  function teardown() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    window.removeEventListener("resize", onResize);
    if (renderer) {
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointerleave", onPointerLeaveHost);
      if (renderer.domElement && renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
      renderer.dispose();
    }
    meshes = [];
  }

  function initScene() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) throw new Error("solar-system-canvas-host has no layout size");

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    camera.position.set(0, 9, 14);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobileQuery.matches ? 1.5 : 2));
    renderer.setSize(w, h);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "none";
    host.prepend(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 6;
    controls.maxDistance = 26;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.target.set(0, 0, 0);
    controls.update();

    buildStar();
    buildPlanets(getProjectItems());

    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointerleave", onPointerLeaveHost);
    window.addEventListener("resize", onResize);

    animate();
  }

  toggleBtn.addEventListener("click", () => {
    sceneActive = !sceneActive;
    wrap.classList.toggle("hidden", !sceneActive);
    grid.classList.toggle("hidden", sceneActive);
    applyStaticLabels();
  });

  try {
    wrap.classList.remove("hidden"); // give the host real layout dimensions before sizing the renderer
    grid.classList.add("hidden");
    initScene();
    sceneActive = true;
    toggleBtn.classList.remove("hidden");
    applyStaticLabels();
  } catch (err) {
    console.warn("[solar-system] errore inizializzazione scena 3D, resto sulla griglia.", err);
    teardown();
    wrap.classList.add("hidden");
    grid.classList.remove("hidden");
  }
})();
