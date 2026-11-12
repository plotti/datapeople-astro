// Medien-Fächer: scroll-driven 3D scene. Scroll position inside #faecher decides the year.
(function () {
  const root = document.getElementById('faecher');
  const stage = document.getElementById('faecher-stage');
  if (!root || !stage) return;
  const fallback = (msg) => { const f = stage.querySelector('.fx-fallback'); if (f) { f.hidden = false; f.textContent = msg; } };
  if (!window.THREE) { fallback('Die 3D-Ansicht konnte nicht geladen werden.'); return; }
  let probe; try { probe = document.createElement('canvas').getContext('webgl'); } catch (e) {}
  if (!probe) { fallback('Dein Browser zeigt kein WebGL. Die Zahlen stehen im Text daneben.'); return; }

  const YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const D = {"TV":[50.4,43.4,44.9,48.9,39.5,36.6,36.6,37.7,32.4,35.1],"YouTube":[46.7,55.5,50.4,52.4,49.2,43.3,45.6,44.7,48.6,46.2],"Instagram":[36.4,43.4,50.8,55.1,54.9,59.3,63.6,70.4,71.4,72.4],"Snapchat":[30.1,31.7,30.5,34.4,26.2,29.2,34.6,41.4,39.3,43.8],"Netflix":[null,18.9,24.1,30.3,21.1,22.4,23.4,21.7,19.7,23.8],"Spotify":[null,23.0,36.5,41.5,41.9,48.1,52.6,58.6,58.4,60.9],"TikTok":[null,null,2.4,7.9,16.1,18.3,25.9,28.6,26.3,31.2],"Gaming":[null,null,null,null,18.2,16.8,20.2,18.7,22.2,22.8],"ChatGPT":[null,null,null,null,null,null,null,5.6,24.4,23.6]};
  const SLOTS = ["Gaming","Netflix","Spotify","Instagram","TV","YouTube","Snapchat","TikTok","ChatGPT"];
  const COL = {TV:0xf1b454,Instagram:0x72d0a2,Spotify:0x4ea4a4,YouTube:0x9a7a5a,Snapchat:0xa3a79e,TikTok:0xc05c73,Netflix:0x488166,Gaming:0xd8e983,ChatGPT:0xe8e6df};
  const CAPS = [
    [0,   '2017: Der Fernseher ist noch vorne', 'Jeder zweite junge Mensch schaut täglich fern. Daneben YouTube, Instagram und Snapchat.'],
    [0.7, 'Spotify und Netflix kommen dazu', 'Ab 2018 fragt der Digimonitor nach Musik- und Video-Streaming.'],
    [1.6, 'Instagram überholt das Fernsehen', 'Seit 2019 nutzen mehr Junge täglich Instagram als den Fernseher.'],
    [2.6, 'Corona: Der Fernseher kommt kurz zurück', '2020 steigt die tägliche TV-Nutzung auf 49 Prozent, dann fällt sie weiter.'],
    [3.7, 'TikTok wächst aus dem Nichts', 'Von 2 Prozent im Jahr 2019 auf 31 Prozent im Jahr 2026.'],
    [6.7, '2024 kommt ChatGPT dazu', 'Ab 2024 auch eine neue Erhebungsmethode: Sprünge zum Vorjahr sind teils methodisch.'],
    [7.7, 'ChatGPT ist schon so gross wie Netflix', '2025 nutzen es 24 Prozent der Jungen täglich, so viele wie Netflix.'],
    [8.6, 'Aus einem Bildschirm wurde ein Fächer', 'Instagram 72, Spotify 61, YouTube 46 Prozent. Der Fernseher: 35 Prozent.']
  ];
  const H = 8 / 100, ARC = 7.2;
  const canvas = stage.querySelector('canvas');
  const labels = stage.querySelector('.fx-labels');
  const yearEl = stage.querySelector('.fx-year'), capH = stage.querySelector('.fx-cap h3'), capP = stage.querySelector('.fx-cap p'), cap = stage.querySelector('.fx-cap');
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0b100c); scene.fog = new THREE.Fog(0x0b100c, 22, 52);
  const cam = new THREE.PerspectiveCamera(36, 16 / 9, 0.1, 200);
  scene.add(new THREE.AmbientLight(0x9fb4a0, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 0.55); key.position.set(6, 14, 10); scene.add(key);
  const glow = new THREE.PointLight(0xf1b454, 1.4, 26); scene.add(glow);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(30, 64), new THREE.MeshStandardMaterial({color: 0x111811, roughness: 1})); floor.rotation.x = -Math.PI / 2; scene.add(floor);
  for (let r = 2; r <= 12; r += 2) { const m = new THREE.Mesh(new THREE.RingGeometry(r - 0.01, r + 0.01, 96), new THREE.MeshBasicMaterial({color: 0x1f2a20})); m.rotation.x = -Math.PI / 2; m.position.y = 0.002; scene.add(m); }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.08, 48), new THREE.MeshStandardMaterial({color: 0x2a3a2b, emissive: 0x16221a})); hub.position.y = 0.04; scene.add(hub);
  const slotPos = SLOTS.map((n, i) => { const a = (-62 + i * 124 / (SLOTS.length - 1)) * Math.PI / 180; return {x: Math.sin(a) * ARC, z: -Math.cos(a) * ARC * 0.55 + 1.2}; });
  const bars = {};
  SLOTS.forEach((n, i) => {
    const mat = new THREE.MeshStandardMaterial({color: COL[n], emissive: COL[n], emissiveIntensity: n === 'TV' ? 0.35 : 0.22, roughness: 0.45, transparent: true});
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1, 40), mat); m.position.set(slotPos[i].x, 0.5, slotPos[i].z); m.userData.n = n; scene.add(m);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.95, 40), new THREE.MeshBasicMaterial({color: COL[n], transparent: true, opacity: 0.18})); disc.rotation.x = -Math.PI / 2; disc.position.set(slotPos[i].x, 0.004, slotPos[i].z); scene.add(disc);
    const lg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(slotPos[i].x, 0.02, slotPos[i].z)]);
    const line = new THREE.Line(lg, new THREE.LineBasicMaterial({color: COL[n], transparent: true})); scene.add(line);
    const el = document.createElement('div'); el.className = 'fx-lbl'; const b = document.createElement('b'); const s = document.createElement('span'); s.textContent = n === 'TV' ? 'Fernsehen' : n; el.append(b, s); labels.appendChild(el);
    bars[n] = {m, mat, disc, line, lg, el, b, i};
  });
  const tv = new THREE.Group();
  tv.add(new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.25), new THREE.MeshStandardMaterial({color: 0x1c1c1a, roughness: 0.6})));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 0.84), new THREE.MeshBasicMaterial({color: 0xf1b454})); scr.position.z = 0.13; tv.add(scr); scene.add(tv);

  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const lerp = (a, b, f) => a + (b - a) * f;
  function valAt(n, y) { const s = D[n]; const i = Math.floor(y), f = y - i; const a = s[clamp(i, 0, 9)], b = s[clamp(i + 1, 0, 9)]; if (a == null && b == null) return null; if (a == null) return {v: b * f, grow: f}; if (b == null || i >= 9) return {v: a, grow: 1}; return {v: a + (b - a) * f, grow: 1}; }
  // camera keyframes over the year axis 0..9 (+ 0..1 epilogue): [pos, az, el, dist, target y]
  const K = [[0, -4, 13, 16, 2.6], [1.5, 0, 16, 19, 2.8], [4.5, -14, 20, 21, 3], [8.2, 12, 18, 21, 3], [9, 6, 26, 22, 2.8], [10, 0, 50, 24, 1.8]];
  let W = 1, Hh = 1, narrow = false;
  function camAt(p) {
    let i = 0; while (i < K.length - 2 && p > K[i + 1][0]) i++;
    const a = K[i], b = K[i + 1], f = ease(clamp((p - a[0]) / (b[0] - a[0])));
    const az = lerp(a[1], b[1], f) * Math.PI / 180, el = (lerp(a[2], b[2], f) + (narrow ? 14 : 0)) * Math.PI / 180;
    const d = lerp(a[3], b[3], f) * (narrow ? 2.15 : 1), ty = lerp(a[4], b[4], f), tz = -2.3;
    cam.position.set(d * Math.sin(az) * Math.cos(el), ty + d * Math.sin(el), tz + d * Math.cos(az) * Math.cos(el));
    cam.lookAt(0, ty, tz); cam.updateMatrixWorld();
  }
  function resize() {
    W = stage.clientWidth; Hh = stage.clientHeight; narrow = W < 720;
    renderer.setSize(W, Hh, false); cam.aspect = W / Hh; scene.fog.near = narrow ? 40 : 22; scene.fog.far = narrow ? 90 : 52;
    if (narrow) cam.setViewOffset(W, Hh, 0, Hh * 0.08, W, Hh); else cam.setViewOffset(W, Hh, -W * 0.16, -Hh * 0.05, W, Hh);
    cam.updateProjectionMatrix(); draw(lastP);
  }
  const V = new THREE.Vector3();
  let lastP = 0, lastCap = null;
  function draw(p) {
    lastP = p;
    const yf = clamp(p, 0, 9);
    yearEl.textContent = YEARS[Math.min(9, Math.floor(yf + 0.5))];
    let c = CAPS[0]; for (const k of CAPS) if (yf >= k[0] - 0.001) c = k;
    if (c !== lastCap) { capH.textContent = c[1]; capP.textContent = c[2]; lastCap = c; cap.classList.remove('fx-in'); void cap.offsetWidth; cap.classList.add('fx-in'); }
    camAt(p);
    SLOTS.forEach((n) => {
      const b = bars[n], pos = slotPos[b.i], r = valAt(n, yf);
      let v = 0, g = 0; if (r) { v = r.v; g = ease(clamp(r.grow)); }
      const h = Math.max(0.001, v * H); b.m.scale.y = h; b.m.position.y = h / 2; b.mat.opacity = g < 0.02 ? 0 : 1; b.m.visible = g >= 0.02;
      b.disc.material.opacity = 0.18 * g;
      const lp = b.lg.attributes.position; lp.setXYZ(1, pos.x * g, 0.02, pos.z * g); lp.needsUpdate = true; b.line.material.opacity = g * 0.7;
      const top = n === 'TV' ? h + 1.35 : h + 0.45;
      V.set(pos.x, top, pos.z).project(cam);
      b.el.style.transform = `translate(${(V.x * 0.5 + 0.5) * W}px, ${(-V.y * 0.5 + 0.5) * Hh}px) translate(-50%, -100%)`;
      b.el.style.opacity = g < 0.5 ? 0 : clamp((g - 0.5) * 2);
      b.b.textContent = Math.round(v) + ' %';
      b.hover = {v, g};
    });
    const tvh = bars.TV.m.scale.y; tv.position.set(slotPos[4].x, tvh + 0.62, slotPos[4].z); tv.lookAt(cam.position.x, tvh + 0.62, cam.position.z);
    glow.position.set(slotPos[4].x, tvh + 0.6, slotPos[4].z + 0.8); glow.intensity = 0.6 + 1.2 * (D.TV[Math.min(9, Math.round(yf))] / 50);
    renderer.render(scene, cam);
  }
  // scroll → progress through the tall section
  let queued = false;
  function onScroll() {
    if (queued) return; queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const r = root.getBoundingClientRect();
      const run = Math.max(1, r.height - window.innerHeight);
      const f = clamp(-r.top / run);
      draw(f * 10);
    });
  }
  window.addEventListener('scroll', onScroll, {passive: true});
  new ResizeObserver(resize).observe(stage);
  // hover: value of the column under the pointer
  const tip = stage.querySelector('.fx-tip'), ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
  canvas.addEventListener('pointermove', (ev) => {
    const r = canvas.getBoundingClientRect();
    mouse.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mouse, cam);
    const hit = ray.intersectObjects(SLOTS.map((n) => bars[n].m).filter((m) => m.visible))[0];
    if (!hit) { tip.style.opacity = 0; return; }
    const n = hit.object.userData.n, y = YEARS[Math.min(9, Math.round(clamp(lastP, 0, 9)))];
    tip.textContent = `${n === 'TV' ? 'Fernsehen' : n} ${y}: ${bars[n].hover.v.toFixed(1)} % täglich`;
    tip.style.left = Math.min(r.width - tip.offsetWidth - 8, ev.clientX - r.left + 14) + 'px'; tip.style.top = Math.max(8, ev.clientY - r.top - 36) + 'px'; tip.style.opacity = 1;
  });
  canvas.addEventListener('pointerleave', () => { tip.style.opacity = 0; });
  resize(); onScroll();
})();
