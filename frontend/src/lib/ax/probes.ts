// Probes rodadas via page.evaluate no browser remoto. Declaradas como STRING,
// não como função — o bundler do Worker (esbuild/workerd) pode renomear
// funções durante o minify e quebrar a serialização que o Puppeteer faz pra
// mandar o código pro browser (erro clássico "__name is not defined").
// Puppeteer aceita string crua em page.evaluate(), então isso contorna o problema.

export const DIV_SOUP_PROBE = `(() => {
  const all = document.querySelectorAll('*');
  const generic = document.querySelectorAll(
    'div:not([role]):not([aria-label]):not([aria-labelledby]), span:not([role]):not([aria-label]):not([aria-labelledby])'
  );
  const total = all.length;
  return {
    totalElements: total,
    genericContainers: generic.length,
    ratio: total > 0 ? generic.length / total : 0,
  };
})()`;

export const PAGE_META_PROBE = `(() => {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const landmarkSelector =
    'header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]';
  return {
    title: document.title || '',
    lang: document.documentElement.getAttribute('lang'),
    headingOutline: headings.map((h) => ({
      level: Number(h.tagName.slice(1)),
      text: (h.textContent || '').trim().slice(0, 200),
    })),
    landmarkCount: document.querySelectorAll(landmarkSelector).length,
  };
})()`;
