// Monta scripts/capas/capas.json a partir do frontmatter dos 34 artigos.
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..', '..');
const BLOG = path.join(RAIZ, 'frontend/src/content/blog');

// Conjunto fechado de temas — o eyebrow diz de que trata o artigo, não que
// formato tem. Um slug que não esteja aqui rebenta o script de propósito.
const TEMA = {
  'a-mudanca-para-o-seo-semantico-o-que-os-vetores-significam-para-sua-estrategia': 'IA & GEO',
  'a-oficializacao-do-grounding-o-futuro-do-trafego-organico-segundo-o-google': 'IA & GEO',
  'analise-de-concorrentes-em-seo-como-identificar-e-superar-seus-competidores-nos-resultados-de-busca': 'Estratégia',
  'autoridade-topic-clusters-de-conteudo-seo-geo': 'Conteúdo',
  'como-aparecer-no-chatgpt-guia-aeo-geo': 'IA & GEO',
  'como-bloquear-treinamento-de-ia-sem-sumir-do-google-a-mudanca-que-a-cloudflare-fez-em-julho-de-2026': 'IA & GEO',
  'como-calcular-seu-orcamento-de-seo-um-guia-completo-para-empresas-brasileiras': 'Estratégia',
  'como-criar-conteudo-seo-friendly-que-converte': 'Conteúdo',
  'como-criar-um-sitemap-melhorar-indexacao-site': 'SEO Técnico',
  'como-escolher-as-melhores-palavras-chave-para-seu-negocio-local': 'SEO Local',
  'como-escrever-titulos-e-meta-descricoes-que-aumentam-o-ctr': 'Conteúdo',
  'como-fazer-seo-para-hoteis-na-nova-era-da-ia': 'Estratégia',
  'como-fazer-seo-para-pequenas-empresas-um-guia-completo': 'Estratégia',
  'como-fazer-seo-para-sites-de-turismo-atraia-mais-visitantes': 'Estratégia',
  'como-garantir-orcamento-para-seo-estrategias-para-justificar-investimentos-em-marketing-organico': 'Estratégia',
  'como-medir-o-share-of-search-o-gps-da-sua-relevancia-no-mercado-digital': 'Estratégia',
  'como-melhorar-o-ranking-do-seu-site-no-google-dicas-praticas': 'Estratégia',
  'como-monitorar-desempenho-seo-seu-site-ferramentas-gratuitas': 'Ferramentas',
  'como-recuperar-de-mencoes-negativas-a-marca': 'Estratégia',
  'como-trabalhar-com-imagens-para-seo-e-melhorar-o-carregamento-do-site': 'SEO Técnico',
  'criacao-de-faqs-programadas-com-dados-estruturados-json-ld-um-guia-completo-para-seo-na-era-da-ia': 'SEO Técnico',
  'evento-de-marketing-digital-em-lisboa-digitalks': 'Notícia',
  'ferramentas-gratuitas-seo-para-ia-aeo-geo': 'Ferramentas',
  'graphify-como-economizar-tokens-ao-usar-ia': 'Ferramentas',
  'lacuna-de-conteudo-comparar-sitemap-concorrente': 'Ferramentas',
  'meta-revoluciona-a-comunicacao-com-ia-que-converte-pensamentos-em-texto': 'Notícia',
  'o-experimento-que-provou-a-maior-parte-do-crawler-no-seu-log-e-fake': 'IA & GEO',
  'o-impacto-dos-core-web-vitals-no-seo-um-guia-completo': 'SEO Técnico',
  'o-poder-do-schema-org-para-empresas-de-servicos-um-guia-completo-para-o-seo-local': 'SEO Técnico',
  'por-que-seo-local-e-fundamental-para-pequenos-negocios': 'SEO Local',
  'quatro-alavancas-receita-busca-google': 'IA & GEO',
  'seo-vs-ppc-debate-acabou': 'Estratégia',
  'sucesso-em-seo-local-como-acompanhar-rankings-conversoes-e-chamadas': 'SEO Local',
  'title-tag-ideal-tem-de-50-a-60-caracteres-diz-estudo-com-81-mil-titulos': 'Conteúdo',
};

// Artigos assentes em números medidos levam barras em vez do grafo.
const BARRAS = new Set([
  'analise-de-concorrentes-em-seo-como-identificar-e-superar-seus-competidores-nos-resultados-de-busca',
  'como-calcular-seu-orcamento-de-seo-um-guia-completo-para-empresas-brasileiras',
  'como-medir-o-share-of-search-o-gps-da-sua-relevancia-no-mercado-digital',
  'como-monitorar-desempenho-seo-seu-site-ferramentas-gratuitas',
  'lacuna-de-conteudo-comparar-sitemap-concorrente',
  'o-experimento-que-provou-a-maior-parte-do-crawler-no-seu-log-e-fake',
  'title-tag-ideal-tem-de-50-a-60-caracteres-diz-estudo-com-81-mil-titulos',
]);

// Cada retrato tem o rosto a uma altura ligeiramente diferente no recorte.
const RETRATOS = [
  ['cafe-laptop', '50% 40%'],
  ['gesto', '46% 38%'],
  ['de-pe', '50% 34%'],
  ['blazer', '52% 38%'],
  ['apontar', '48% 40%'],
  ['pensativo', '50% 36%'],
];

const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

function dataCurta(iso) {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// A caixa do título tem 470 px; a Fraunces bold ocupa ~0.505×tamanho por
// caractere. Escalar assim mantém toda a gente entre 3 e 4,5 linhas.
function tamanhoTitulo(n) {
  if (n <= 45) return 58;
  if (n <= 60) return 52;
  if (n <= 75) return 48;
  if (n <= 90) return 42;
  return 38;
}

// Quebrar depois dos dois pontos só quando a primeira parte é curta — senão
// sobra uma linha órfã de duas palavras.
function comQuebra(t) {
  const i = t.indexOf(': ');
  if (i > 0 && i <= 32) return t.slice(0, i + 1) + '<br>' + t.slice(i + 2);
  return t;
}

const posts = [];
for (const f of fs.readdirSync(BLOG).filter((x) => x.endsWith('.md'))) {
  const s = fs.readFileSync(path.join(BLOG, f), 'utf8');
  const fm = s.split(/^---\s*$/m)[1] || '';
  const campo = (k) => {
    const m = fm.match(new RegExp('^' + k + ':\\s*(.*)$', 'm'));
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
  };
  const slug = f.replace(/\.md$/, '');
  const titulo = campo('title');
  const data = campo('date') || campo('pubDate');
  if (!TEMA[slug]) throw new Error('slug sem tema atribuído: ' + slug);
  posts.push({ slug, titulo, data });
}

// Ordenar como o blog lista (mais recente primeiro) para que capas vizinhas
// nunca partilhem o mesmo retrato.
posts.sort((a, b) => new Date(b.data) - new Date(a.data));

const capas = posts.map((p, i) => {
  const [retrato, photoPos] = RETRATOS[i % RETRATOS.length];
  const entrada = {
    slug: p.slug,
    title: comQuebra(p.titulo),
    date: dataCurta(p.data),
    category: TEMA[p.slug],
    retrato,
    photoPos,
    titleSize: tamanhoTitulo(p.titulo.length),
  };
  if (BARRAS.has(p.slug)) entrada.graphic = 'bars';
  return entrada;
});

fs.writeFileSync(
  path.join(RAIZ, 'scripts/capas/capas.json'),
  JSON.stringify(capas, null, 2) + '\n',
);
console.log('capas.json:', capas.length, 'entradas');
const contagem = {};
capas.forEach((c) => (contagem[c.category] = (contagem[c.category] || 0) + 1));
console.log('temas:', contagem);
