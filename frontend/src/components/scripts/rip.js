// O rasgo: primeiro clique na Superfície destrói a simulação de vez.
// Sequência (ver storyboard, Cena 3): inspiração → onda de choque →
// estilhaçar → Profundidade acende → linha mono → scroll liberto.

import gsap from 'gsap';
import { markRevealed } from './state.js';
import { typeTokens } from './typing.js';

export function armRip({ lantern, onRevealed }) {
  const surface = document.getElementById('surface-layer');
  if (!surface) return;

  let fired = false;

  const fire = (cx, cy) => {
    if (fired) return;
    fired = true;
    surface.classList.add('ripping');
    lantern.destroy();

    const root = document.documentElement;
    const maxR = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    root.style.setProperty('--mx', `${cx}px`);
    root.style.setProperty('--my', `${cy}px`);

    const tl = gsap.timeline({
      onComplete: () => {
        surface.remove();
        document.getElementById('lantern-ring')?.remove();
        markRevealed();
        root.classList.remove('pre-rip');
        root.classList.add('revealed');
        onRevealed?.();
        ripLine();
      },
    });

    // 0–150ms: tudo pára; a página "inspira"
    tl.to(surface, { scale: 1.012, duration: 0.15, ease: 'power1.out' });

    // 150–900ms: onda de choque — o raio da máscara engole o viewport
    const radius = { r: parseFloat(getComputedStyle(root).getPropertyValue('--mr')) || 180 };
    tl.to(
      radius,
      {
        r: maxR * 1.1,
        duration: 0.75,
        ease: 'expo.in',
        onUpdate: () => root.style.setProperty('--mr', `${radius.r}px`),
      },
      0.15
    );

    // 400–1200ms: a Superfície estilhaça — fragmentos rodam, perdem
    // opacidade e são sugados na direção da onda
    const fragments = surface.querySelectorAll('[data-fragment]');
    fragments.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - cx;
      const dy = rect.top + rect.height / 2 - cy;
      const dist = Math.hypot(dx, dy) || 1;
      tl.to(
        el,
        {
          x: (-dx / dist) * 140,
          y: (-dy / dist) * 140,
          rotation: gsap.utils.random(-28, 28),
          opacity: 0,
          duration: 0.8,
          ease: 'power2.in',
        },
        0.4 + (dist / maxR) * 0.25
      );
    });

    // 900–1800ms: a Profundidade acende (o canvas escuta este evento)
    tl.call(() => window.dispatchEvent(new CustomEvent('depth:ignite')), [], 0.9);
    tl.to({}, { duration: 0.9 }, 0.9);
  };

  async function ripLine() {
    // "Agora vês o que as máquinas veem." — token a token, 1.2s, dissolve
    const line = document.getElementById('rip-line');
    if (!line) return;
    const span = line.querySelector('span');
    gsap.set(line, { autoAlpha: 1 });
    await typeTokens(span, 'Agora vês o que as máquinas veem.', { tokenMs: 70 });
    await new Promise((r) => setTimeout(r, 1200));
    gsap.to(line, { autoAlpha: 0, duration: 0.8, onComplete: () => line.remove() });
  }

  surface.addEventListener('click', (e) => fire(e.clientX, e.clientY));
  surface.addEventListener(
    'touchend',
    (e) => {
      const t = e.changedTouches[0];
      // No touch, o primeiro tap num elemento interativo dispara o rasgo
      if (t) fire(t.clientX, t.clientY);
    },
    { passive: true }
  );
}
