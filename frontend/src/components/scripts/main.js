// Orquestração dos dois mundos.
// Superfície + lanterna + rasgo antes; Profundidade + scroll depois.

import { isRevealed, isReducedMotion } from './state.js';
import { heroTypingLoop } from './typing.js';

export function boot() {
  if (isReducedMotion()) {
    // Versão calma: direto na Profundidade, sem lanterna, sem rasgo,
    // sem canvas, transições nativas. O conteúdo é o mesmo.
    document.getElementById('surface-layer')?.remove();
    document.getElementById('lantern-ring')?.remove();
    return;
  }

  // O canvas inicializa em idle para não competir com o LCP
  const initDepth = () =>
    import('../depth/world.js').then(({ createDepthWorld }) => createDepthWorld());
  if ('requestIdleCallback' in window) requestIdleCallback(initDepth, { timeout: 2500 });
  else setTimeout(initDepth, 800);

  const startDepthLife = () => {
    // A barra do hero responde token a token — o tempo gerativo
    const questionEl = document.getElementById('hero-question');
    const answerEl = document.getElementById('hero-answer');
    if (questionEl && answerEl) heroTypingLoop({ questionEl, answerEl });
  };

  const startScroll = () => import('./scroll.js').then(({ initScroll }) => initScroll());

  if (isRevealed()) {
    // Já rasgou nesta sessão: a Superfície nem monta
    document.getElementById('surface-layer')?.remove();
    document.getElementById('lantern-ring')?.remove();
    document.getElementById('rip-line')?.remove();
    startDepthLife();
    startScroll();
    return;
  }

  // Pré-rasgo: lanterna + rasgo armado; scroll bloqueado no hero
  startDepthLife();
  Promise.all([import('./lantern.js'), import('./rip.js')]).then(
    ([{ createLantern }, { armRip }]) => {
      const lantern = createLantern();
      armRip({ lantern, onRevealed: startScroll });
    }
  );
}
