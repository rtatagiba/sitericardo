// Variante do template "Dossiê" só com o retrato — duotone ocre sobre
// grafite, corte diagonal e a lâmina, sem gráfico e sem nenhuma tipografia
// por cima. Usada no bloco de FAQ da home que leva foto ao lado do texto.

const ACCENT = '#c98a2c';
const INK = '#14171a';

/**
 * @param {object} d
 * @param {string} d.photo      caminho do retrato, relativo ao HTML gerado
 * @param {string} [d.photoPos] object-position do retrato, default "50% 30%"
 * @param {'left'|'right'} [d.lado] em que lado fica o painel de tinta, default "left"
 * @param {number} [d.w]        largura, default 960
 * @param {number} [d.h]        altura, default 720
 */
function semTexto(d) {
  const w = d.w || 960;
  const h = d.h || 720;
  const esquerda = (d.lado || 'left') === 'left';
  // painel de tinta ocupa ~32% da largura; a foto entra em corte diagonal a
  // partir dele, tal como nas capas do blog, só que sem nada por cima.
  const painel = Math.round(w * 0.32);
  const photoClip = esquerda
    ? `polygon(${painel + 60}px 0, 100% 0, 100% 100%, ${painel}px 100%)`
    : `polygon(0 0, ${w - painel}px 0, ${w - painel - 60}px 100%, 0 100%)`;
  const bladeLeft = esquerda ? painel + 24 : w - painel - 24;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:${w}px; height:${h}px; overflow:hidden; }
  body { background:${INK}; }
  .stage { position:relative; width:${w}px; height:${h}px; overflow:hidden; }

  .grid {
    position:absolute; inset:0; z-index:1;
    background-image:
      linear-gradient(${ACCENT}14 1px, transparent 1px),
      linear-gradient(90deg, ${ACCENT}14 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .photo { position:absolute; inset:0; z-index:2; clip-path: ${photoClip}; }
  .photo img {
    width:100%; height:100%; object-fit:cover; object-position:${d.photoPos || '50% 30%'};
    filter: grayscale(1) contrast(1.12) brightness(0.92);
  }
  .photo .tone { position:absolute; inset:0; background:${ACCENT}; mix-blend-mode:color; opacity:0.4; }
  .photo .deep {
    position:absolute; inset:0;
    background: linear-gradient(${esquerda ? '270deg' : '90deg'}, ${INK} 0%, transparent 30%);
  }

  .blade {
    position:absolute; top:-40px; bottom:-40px; left:${bladeLeft}px; width:22px; z-index:4;
    background:${ACCENT}; transform:rotate(12.6deg); transform-origin:top center;
  }
</style></head><body><div class="stage">
  <div class="grid"></div>
  <div class="photo"><img src="${d.photo}"><div class="tone"></div><div class="deep"></div></div>
  <div class="blade"></div>
</div></body></html>`;
}

module.exports = { semTexto };
