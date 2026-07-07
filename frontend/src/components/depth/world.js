// O mundo Profundidade: fog, luz volumétrica âmbar e uma "matrix" de
// glyphs de código que nasce em explosão no primeiro scroll e se
// deforma sob a pressão do ponteiro. Sem assets — tudo gerado.

import * as THREE from 'three';

const DEPTH_BG = 0x0a0e14;
const AMBER = '#e8a855';
const CYAN = '#4fd8e8';

const GLYPHS = [
  '<', '>', '/', '{', '}', '(', ')', ';', '=', '+', '*', '#',
  '$', '%', '&', '@', '?', '|', '~', '0', '1', 'λ', 'ƒ', ':',
];

export function createDepthWorld() {
  const canvas = document.getElementById('depth-canvas');
  if (!canvas) return null;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(DEPTH_BG, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(DEPTH_BG, 0.055);

  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 60);
  camera.position.set(0, 0, 12);

  // ── O campo de glyphs (a matrix) ──
  const isMobile = innerWidth < 768;
  const amberField = makeGlyphField(isMobile ? 200 : 440, AMBER, 0.42, 0.55);
  const cyanField = makeGlyphField(isMobile ? 70 : 160, CYAN, 0.34, 0.4);
  const fields = [amberField, cyanField];
  fields.forEach((f) => scene.add(f.group));

  // ── God rays de cima-esquerda ──
  const rays = makeGodRays();
  rays.group.position.set(-7, 8, -6);
  rays.group.rotation.z = -0.55;
  scene.add(rays.group);

  // ── Estado dinâmico ──
  const state = {
    intensity: document.documentElement.classList.contains('revealed') ? 1 : 0.35,
    targetIntensity: document.documentElement.classList.contains('revealed') ? 1 : 0.35,
    scroll: 0,
    cta: 0,
    mx: 0,
    my: 0,
    // A matrix só nasce no primeiro scroll — explosão de um ponto central
    birth: 0,
    birthTarget: 0,
    pointer: new THREE.Vector3(9999, 9999, 0),
  };

  window.addEventListener('depth:ignite', () => {
    state.targetIntensity = 1;
  });
  window.addEventListener('depth:progress', (e) => {
    state.scroll = e.detail;
    if (e.detail > 0.0005) state.birthTarget = 1;
  });
  const wake = () => {
    // Só depois do rasgo (scroll destrancado) é que o scroll dá vida
    if (!document.documentElement.classList.contains('pre-rip')) state.birthTarget = 1;
  };
  window.addEventListener('wheel', wake, { passive: true });
  window.addEventListener('touchmove', wake, { passive: true });
  window.addEventListener('depth:cta', (e) => {
    state.cta = e.detail;
  });
  window.addEventListener(
    'mousemove',
    (e) => {
      state.mx = (e.clientX / innerWidth) * 2 - 1;
      state.my = (e.clientY / innerHeight) * 2 - 1;
    },
    { passive: true }
  );
  window.addEventListener('resize', () => {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  });

  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(tick);
  });

  const clock = new THREE.Clock();

  function tick() {
    if (!running) return;
    const t = clock.getElapsedTime();

    state.intensity += (state.targetIntensity - state.intensity) * 0.03;
    state.birth += (state.birthTarget - state.birth) * 0.028;
    const dim = 1 - state.cta * 0.85; // a Cena 8 escurece tudo

    // O ponteiro no plano z=0: a pressão que deforma a matrix
    const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const vw = vh * camera.aspect;
    state.pointer.set(
      state.mx * (vw / 2) + camera.position.x,
      -state.my * (vh / 2) + camera.position.y,
      0
    );

    // Nascimento com overshoot: explode do centro, passa do lugar, assenta
    const eased = 1 - Math.pow(1 - state.birth, 3);
    const spread = eased * (1 + 0.3 * Math.sin(eased * Math.PI));

    for (const f of fields) {
      animateField(f, t, spread, state);
      const flash = (1 - eased) * eased * 1.6; // brilho no estouro
      for (const sys of f.systems) {
        sys.points.material.opacity =
          (f.baseOpacity * state.intensity * dim + state.cta * 0.22 + flash * f.baseOpacity) *
          eased;
      }
    }

    rays.group.children.forEach((m, i) => {
      m.material.opacity = (0.16 - i * 0.04) * state.intensity * dim;
      m.rotation.z = Math.sin(t * 0.08 + i) * 0.04;
    });

    // Câmara: parallax do rato com peso + dolly suave no scroll
    camera.position.x += (state.mx * 0.7 - camera.position.x) * 0.03;
    camera.position.y += (-state.my * 0.45 - state.scroll * 2.2 - camera.position.y) * 0.03;
    camera.lookAt(0, -state.scroll * 2.2, 0);

    scene.fog.density = 0.055 + state.cta * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  return { renderer, scene };
}

/**
 * Campo de glyphs: um Points por glyph (mesma textura), comportamento
 * partilhado. Barato: ~24 draw calls no total.
 */
function makeGlyphField(count, color, size, baseOpacity) {
  const group = new THREE.Group();
  const systems = [];
  const perGlyph = Math.max(4, Math.floor(count / GLYPHS.length));

  for (const glyph of GLYPHS) {
    const n = perGlyph;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    const base = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      base[i * 3] = (Math.random() - 0.5) * 24;
      base[i * 3 + 1] = (Math.random() - 0.5) * 16;
      base[i * 3 + 2] = (Math.random() - 0.5) * 14;
      seed[i] = Math.random() * Math.PI * 2;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color,
      size,
      map: glyphTexture(glyph, color),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    group.add(points);
    systems.push({ points, base, seed });
  }
  return { group, systems, baseOpacity };
}

function animateField({ systems }, t, spread, state) {
  const p = state.pointer;
  for (const { points, base, seed } of systems) {
    const pos = points.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const s = seed[i];
      // Posição de repouso + deriva orgânica
      let x = base[i * 3] + Math.sin(t * 0.06 + s) * 0.6;
      let y = base[i * 3 + 1] + Math.cos(t * 0.05 + s * 1.3) * 0.5;
      let z = base[i * 3 + 2] + Math.cos(t * 0.04 + s) * 0.5;

      // Nascimento: tudo parte de um ponto central e expande
      x *= spread;
      y *= spread;
      z *= spread;

      // Cena 8: convergência no botão final
      const c = state.cta * state.cta;
      x += (0 - x) * c;
      y += (-1.5 - y) * c;
      z += (4 - z) * c;

      // Pressão do ponteiro: deforma a matrix à volta do cursor e
      // volta elasticamente quando ele sai (falloff gaussiano)
      const dx = x - p.x;
      const dy = y - p.y;
      const dz = z - p.z;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < 16) {
        const d = Math.sqrt(d2) || 0.001;
        const push = 2.4 * Math.exp(-d2 / 5);
        x += (dx / d) * push;
        y += (dy / d) * push;
        z += (dz / d) * push * 0.6;
      }

      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
  }
}

function makeGodRays() {
  const group = new THREE.Group();
  const tex = rayTexture();
  for (let i = 0; i < 3; i++) {
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(9 + i * 5, 26), mat);
    mesh.position.set(i * 2.4, -6, -i * 1.5);
    group.add(mesh);
  }
  return { group };
}

/** Um glyph desenhado em canvas — a matéria da matrix. */
function glyphTexture(glyph, color) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  ctx.font = '600 44px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Halo suave para o glow aditivo
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(glyph, 32, 34);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Feixe vertical com queda suave — a luz volumétrica âmbar. */
function rayTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 512;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, 'rgba(232,168,85,0.9)');
  g.addColorStop(0.5, 'rgba(232,168,85,0.28)');
  g.addColorStop(1, 'rgba(232,168,85,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 512);
  const fade = ctx.createLinearGradient(0, 0, 128, 0);
  fade.addColorStop(0, 'rgba(0,0,0,1)');
  fade.addColorStop(0.5, 'rgba(0,0,0,0)');
  fade.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, 128, 512);
  return new THREE.CanvasTexture(c);
}
