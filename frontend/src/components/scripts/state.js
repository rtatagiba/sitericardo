// Estado do rasgo. Uma vez revelado, nunca se volta à Superfície na sessão.

const KEY = 'rt-revealed';

/** ?surface na URL força a Superfície — para testes e demonstrações. */
export function isForcedSurface() {
  return new URLSearchParams(location.search).has('surface');
}

export function isRevealed() {
  if (isForcedSurface()) return false;
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function markRevealed() {
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* sessão sem storage: o rasgo vale só para esta página */
  }
}

export function isReducedMotion() {
  if (isForcedSurface()) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isTouch() {
  return window.matchMedia('(pointer: coarse)').matches;
}
