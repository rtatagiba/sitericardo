// Template das capas do blog — "Dossiê".
// Uma capa = retrato real do Ricardo em duotone ocre + tipografia + uma
// camada gráfica desenhada a partir do título do artigo.
// Paleta e tipos vêm da Prancheta Noturna (frontend/src/styles/global.css).

const ACCENT = '#c98a2c';
const INK = '#14171a';
const TEXT = '#e8e4dc';
const MUTED = '#9a958a';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');`;

// Semente estável a partir do título: a mesma capa gera sempre o mesmo desenho.
const seedOf = (s) => (([...String(s)].reduce((a, c) => a + c.charCodeAt(0), 7) * 977) % 2147483647);

// Grafo de nós — o default, para artigos de análise/opinião.
function nodeGraph(seed, { w = 300, h = 130, count = 9 } = {}) {
  let s = seed;
  const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  const pts = Array.from({ length: count }, () => ({ x: rnd() * w, y: rnd() * h, r: 2 + rnd() * 4 }));
  const edges = [];
  pts.forEach((p, i) => {
    pts
      .map((q, j) => ({ j, d: Math.hypot(p.x - q.x, p.y - q.y) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .forEach((n) => { if (i < n.j) edges.push([p, pts[n.j]]); });
  });
  return `<svg class="graph" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${edges.map(([a, b]) => `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${ACCENT}" stroke-width="1" opacity="0.5"/>`).join('')}
    ${pts.map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r.toFixed(1)}" fill="${ACCENT}" opacity="0.75"/>`).join('')}
  </svg>`;
}

// Barras assentes num eixo — para artigos de dados/estudo. Barras finas e
// opacas: grossas e translúcidas leem-se como skeleton de carregamento.
function serpBars(seed, { w = 280, h = 120, n = 5 } = {}) {
  let s = seed;
  const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  const bh = 8, step = (h - bh) / (n - 1);
  return `<svg class="graph" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <line x1="0.5" y1="0" x2="0.5" y2="${h}" stroke="${ACCENT}" stroke-width="1" opacity="0.55"/>
    ${Array.from({ length: n }, (_, i) => {
      const bw = (0.22 + rnd() * 0.78) * (w - 8);
      return `<rect x="4" y="${(i * step).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh}" fill="${ACCENT}"/>`;
    }).join('')}
  </svg>`;
}

/**
 * @param {object} d
 * @param {string} d.title       título; aceita <br> para forçar quebras
 * @param {string} d.date        ex: "28 JUL 2026"
 * @param {string} d.category    eyebrow, ex: "Análise"
 * @param {string} d.photo       caminho do retrato, relativo ao HTML gerado
 * @param {string} [d.photoPos]  object-position do retrato, default "52% 30%"
 * @param {number} [d.titleSize] px, default 54
 * @param {'graph'|'bars'} [d.graphic] camada gráfica, default "graph"
 */
function capa(d) {
  const barras = d.graphic === 'bars';
  const grafico = barras ? serpBars(seedOf(d.title)) : nodeGraph(seedOf(d.title));
  // Com barras, o traço do título ficava logo por cima delas e lia-se como a
  // primeira barra do gráfico. As barras já fazem de âncora ocre.
  const traco = barras ? '' : '<div class="rule"></div>';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${FONTS}
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:1200px; height:675px; overflow:hidden; }
  body { background:${INK}; color:${TEXT}; font-family:'Inter',system-ui,sans-serif; -webkit-font-smoothing:antialiased; }
  .stage { position:relative; width:1200px; height:675px; overflow:hidden; }

  /* grade de prancheta: hairlines, nunca blur nem glass */
  .grid {
    position:absolute; inset:0; z-index:1;
    background-image:
      linear-gradient(${ACCENT}14 1px, transparent 1px),
      linear-gradient(90deg, ${ACCENT}14 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .photo {
    position:absolute; inset:0 0 0 auto; width:640px; z-index:2;
    clip-path: polygon(150px 0, 100% 0, 100% 100%, 0 100%);
  }
  .photo img {
    width:100%; height:100%; object-fit:cover; object-position:${d.photoPos || '52% 30%'};
    filter: grayscale(1) contrast(1.12) brightness(0.92);
  }
  /* duotone: o ocre entra por cima da foto a preto e branco */
  .photo .tone { position:absolute; inset:0; background:${ACCENT}; mix-blend-mode:color; opacity:0.4; }
  .photo .deep { position:absolute; inset:0; background:linear-gradient(100deg, ${INK} 0%, ${INK}cc 20%, transparent 58%); }

  /* a lâmina corre paralela ao corte da foto (ambos a 12,6°) e fica encostada
     a ela — mais à esquerda roubava largura ao título, que passava por cima */
  .blade {
    position:absolute; top:-40px; bottom:-40px; right:520px; width:26px; z-index:4;
    background:${ACCENT}; transform:rotate(12.6deg); transform-origin:top center;
  }
  /* o gráfico vive no vazio em baixo à esquerda — nunca por cima da cara, e
     baixo o suficiente para não encostar a um título de cinco linhas */
  .graph { position:absolute; left:64px; bottom:92px; z-index:3; opacity:0.4; }

  /* 470 px é o que cabe antes da lâmina na linha mais baixa do título */
  .copy { position:absolute; left:72px; top:96px; width:470px; z-index:5; }
  .eyebrow {
    font-family:'JetBrains Mono',monospace; font-size:17px; font-weight:500;
    letter-spacing:0.16em; text-transform:uppercase; color:${ACCENT}; margin-bottom:26px;
  }
  h1 {
    font-family:'Fraunces',serif; font-weight:700; font-size:${d.titleSize || 54}px;
    line-height:1.07; letter-spacing:-0.015em; color:${TEXT};
  }
  .rule { margin-top:30px; width:96px; height:5px; background:${ACCENT}; }

  .date {
    position:absolute; left:0; top:44px; z-index:6;
    background:${ACCENT}; color:${INK};
    font-family:'JetBrains Mono',monospace; font-weight:700; font-size:16px;
    letter-spacing:0.14em; padding:11px 26px 11px 72px;
  }
  .bar {
    position:absolute; left:0; right:0; bottom:0; height:74px; z-index:6;
    background:${INK}; border-top:1px solid rgba(239,234,224,0.16);
    display:flex; align-items:center; justify-content:space-between; padding:0 72px;
    font-family:'JetBrains Mono',monospace; font-size:16px; letter-spacing:0.12em; text-transform:uppercase;
  }
  .bar .name { color:${TEXT}; font-weight:700; }
  .bar .name span { color:${ACCENT}; }
  .bar .site { color:${MUTED}; }
</style></head><body><div class="stage">
  <div class="grid"></div>
  <div class="photo"><img src="${d.photo}"><div class="tone"></div><div class="deep"></div></div>
  <div class="blade"></div>
  ${grafico}
  <div class="date">${d.date}</div>
  <div class="copy">
    <div class="eyebrow">// ${d.category}</div>
    <h1>${d.title}</h1>
    ${traco}
  </div>
  <div class="bar"><div class="name">Ricardo Tatagiba <span>·</span> SEO</div><div class="site">ricardotatagiba.com.br</div></div>
</div></body></html>`;
}

module.exports = { capa };
