// Lenis + ScrollTrigger: a câmara da Profundidade.
// Padrão oficial de sync: lenis.on('scroll', ScrollTrigger.update) + gsap.ticker.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initScroll() {
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Progresso global da página → o mundo Profundidade escuta
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      window.dispatchEvent(new CustomEvent('depth:progress', { detail: self.progress }));
    },
  });

  initWhatChanged();
  initServices();
  initGallery();
  initFinalCta();

  return lenis;
}

// Cena 4: frases editoriais gigantes, uma por viewport, parallax leve
function initWhatChanged() {
  document.querySelectorAll('.wc-phrase').forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 60 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none reverse' },
      }
    );
    gsap.to(el, {
      y: -40,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

// Cena 5: serviços como camadas de um site a ser iluminado.
// Secção pinned; cada batida de scroll acende uma camada.
function initServices() {
  const section = document.getElementById('services');
  if (!section) return;
  const layers = gsap.utils.toArray('.svc-layer');
  const cards = gsap.utils.toArray('.svc-card');
  const plane = section.querySelector('.svc-plane');
  if (!layers.length) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${layers.length * 90}%`,
      pin: true,
      scrub: 0.6,
    },
  });

  // A câmara orbita lentamente 30° ao longo das cinco batidas
  if (plane) tl.to(plane, { rotateY: 30, ease: 'none', duration: layers.length }, 0);

  layers.forEach((layer, i) => {
    tl.to(layer, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.5 }, i);
    if (cards[i]) {
      tl.fromTo(
        cards[i],
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.5 },
        i
      );
      if (cards[i + 1]) tl.to(cards[i], { autoAlpha: 0, y: -16, duration: 0.35 }, i + 0.65);
    }
  });
}

// Cena 7: galeria — quadros iluminados entram um a um
function initGallery() {
  gsap.utils.toArray('.gallery-frame').forEach((el, i) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 48 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        delay: (i % 3) * 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      }
    );
  });
}

// Cena 8: o ambiente escurece, a pergunta final linha a linha
function initFinalCta() {
  const section = document.getElementById('cta');
  if (!section) return;

  gsap.utils.toArray('.cta-line').forEach((el, i) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        delay: i * 0.25,
        ease: 'expo.out',
        scrollTrigger: { trigger: section, start: 'top 60%' },
      }
    );
  });

  const btn = section.querySelector('.cta-button');
  if (btn) {
    gsap.fromTo(
      btn,
      { autoAlpha: 0, scale: 0.9 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: section, start: 'top 30%' },
      }
    );
  }

  // Escurecimento + convergência de partículas: o canvas escuta
  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    end: 'bottom bottom',
    onUpdate: (self) => {
      window.dispatchEvent(new CustomEvent('depth:cta', { detail: self.progress }));
    },
  });
}
