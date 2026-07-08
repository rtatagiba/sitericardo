// A lanterna: círculo de revelação que expõe a Profundidade sob a Superfície.
// Atualiza --mx/--my/--mr num rAF com lerp; a máscara CSS faz o resto.

import { isTouch } from './state.js';

const BASE_RADIUS_DESKTOP = 180;
const BASE_RADIUS_TOUCH = 140;
const LERP = 0.08;
const BREATH_AMPLITUDE = 0.06; // ±6%
const BREATH_CYCLE_MS = 3000;
const IDLE_GROW_AFTER_MS = 800;
const IDLE_GROW_FACTOR = 1.2;

export function createLantern() {
  const root = document.documentElement;
  const ring = document.getElementById('lantern-ring');
  const hint = document.getElementById('lantern-hint');

  const baseRadius = isTouch() ? BASE_RADIUS_TOUCH : BASE_RADIUS_DESKTOP;

  // Posição alvo (cursor / dedo) e posição atual (com peso)
  let tx = window.innerWidth / 2;
  let ty = window.innerHeight * 0.42;
  let x = tx;
  let y = ty;

  let ownedByVisitor = false; // false = deambula sozinha (Lissajous)
  let handoffT = 0; // spring de entrega ao cursor
  let lastMoveAt = performance.now();
  let radiusScale = 1;
  let running = true;
  let ripRadius = null; // quando o rasgo assume, controla o raio diretamente

  const start = performance.now();

  function lissajous(t) {
    // Percurso lento pelo hero enquanto ninguém mexe no rato
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      x: w * 0.5 + w * 0.28 * Math.sin(t * 0.00023),
      y: h * 0.42 + h * 0.2 * Math.sin(t * 0.00031 + Math.PI / 3),
    };
  }

  function onPointerMove(e) {
    const px = e.touches ? e.touches[0].clientX : e.clientX;
    const py = e.touches ? e.touches[0].clientY : e.clientY;
    tx = px;
    ty = py;
    lastMoveAt = performance.now();
    if (!ownedByVisitor) {
      // Entrega: o círculo voa até ao cursor com spring ~0.6s
      ownedByVisitor = true;
      handoffT = performance.now();
      hint?.classList.add('gone');
    }
  }

  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchstart', onPointerMove, { passive: true });

  function frame(now) {
    if (!running) return;

    if (!ownedByVisitor) {
      const p = lissajous(now - start);
      tx = p.x;
      ty = p.y;
    }

    // Spring de entrega: lerp mais agressivo nos primeiros 600ms
    let k = LERP;
    if (ownedByVisitor && now - handoffT < 600) {
      const s = (now - handoffT) / 600;
      k = 0.08 + 0.22 * (1 - s) * (1 - s);
    }
    x += (tx - x) * k;
    y += (ty - y) * k;

    // Respiração ±6% num ciclo de 3s
    const breath = 1 + BREATH_AMPLITUDE * Math.sin((now / BREATH_CYCLE_MS) * Math.PI * 2);

    // Cresce 20% quando o cursor pára >800ms (a realidade alarga-se)
    const idle = ownedByVisitor && now - lastMoveAt > IDLE_GROW_AFTER_MS;
    radiusScale += ((idle ? IDLE_GROW_FACTOR : 1) - radiusScale) * 0.04;

    const r = ripRadius ?? baseRadius * breath * radiusScale;

    root.style.setProperty('--mx', `${x.toFixed(1)}px`);
    root.style.setProperty('--my', `${y.toFixed(1)}px`);
    root.style.setProperty('--mr', `${r.toFixed(1)}px`);

    if (ring) {
      ring.style.transform = `translate(${x - r}px, ${y - r}px)`;
      ring.style.width = `${r * 2}px`;
      ring.style.height = `${r * 2}px`;
      ring.style.opacity = ripRadius === null ? '1' : '0';
    }

    requestAnimationFrame(frame);
  }

  // Fade-in do raio a partir de 0 no load (Cena 0 → 1)
  const fadeIn = { r: 0 };
  const fadeStart = performance.now();
  const fade = (now) => {
    const p = Math.min(1, (now - fadeStart) / 900);
    fadeIn.r = baseRadius * (1 - Math.pow(1 - p, 3));
    if (p < 1) {
      ripRadius = fadeIn.r;
      requestAnimationFrame(fade);
    } else {
      ripRadius = null;
    }
  };
  requestAnimationFrame(fade);
  requestAnimationFrame(frame);

  return {
    get position() {
      return { x, y };
    },
    /** O rasgo assume o controlo do raio. */
    setRipRadius(r) {
      ripRadius = r;
    },
    destroy() {
      running = false;
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchstart', onPointerMove);
    },
  };
}
