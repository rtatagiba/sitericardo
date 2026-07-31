/**
 * Blocos de destaque para markdown puro — sem MDX.
 *
 * O site publica `.md` (a coleção, o lastmod do sitemap e o editor do /admin
 * assumem essa extensão), portanto os componentes de corpo entram por sintaxe
 * de markdown, não por JSX. Duas formas:
 *
 *   > [!AVISO]
 *   > Texto do aviso.
 *
 *   :::pros-contras
 *   :::pros
 *   - Ponto a favor
 *   :::
 *   :::contras
 *   - Ponto contra
 *   :::
 *   :::
 *
 * Os `:::` vêm do `features.directive` do Sätteri, ligado em astro.config.mjs;
 * este plugin só lhes dá a tag e a classe.
 *
 * O rótulo do bloco ("Aviso", "Dica"…) é desenhado em CSS por `::before`, não
 * injetado como nó: poupa cirurgia na árvore e mantém fora do texto do artigo
 * uma palavra que é cromo visual, não conteúdo.
 */

const CALLOUTS = {
  NOTA: ['box', 'box-nota'],
  AVISO: ['box', 'box-aviso'],
  DICA: ['box', 'box-dica'],
  DESTAQUE: ['box', 'box-destaque'],
  CITACAO: null, // citação em destaque: continua blockquote, muda de fato
};

/** Marcador no início do blockquote, opcionalmente seguido do resto da linha. */
const MARKER = /^\[!([A-Z]+)\][ \t]*\n?/;

/** Contentores `:::` reconhecidos; qualquer outro nome fica como veio. */
const CONTAINERS = new Set(['pros-contras', 'pros', 'contras']);

export function satteriBoxes() {
  return {
    name: 'boxes',

    blockquote(node, ctx) {
      const [first] = node.children ?? [];
      if (first?.type !== 'paragraph') return;

      const [lead] = first.children ?? [];
      if (lead?.type !== 'text') return;

      const match = MARKER.exec(lead.value);
      if (!match || !(match[1] in CALLOUTS)) return;

      ctx.setProperty(lead, 'value', lead.value.slice(match[0].length).replace(/^\n+/, ''));

      const className = CALLOUTS[match[1]];
      ctx.setProperty(node, 'data', {
        hName: className ? 'aside' : 'blockquote',
        hProperties: { className: className ?? ['pull-quote'] },
      });
    },

    containerDirective(node, ctx) {
      if (!CONTAINERS.has(node.name)) return;
      ctx.setProperty(node, 'data', {
        hName: 'div',
        hProperties: { className: [node.name] },
      });
    },
  };
}
