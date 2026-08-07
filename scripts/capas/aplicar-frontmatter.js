// Aponta o `image:` de cada artigo para a capa nova.
// Quem já tinha `image:` é reescrito no sítio; quem não tinha recebe a linha
// no fim do frontmatter, antes do `---` de fecho.
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..', '..');
const BLOG = path.join(RAIZ, 'frontend/src/content/blog');
const CAPAS = path.join(RAIZ, 'frontend/public/images/capas');

const capas = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/capas/capas.json'), 'utf8'));
let alterados = 0;
const antigas = [];

for (const c of capas) {
  const ficheiro = path.join(BLOG, c.slug + '.md');
  if (!fs.existsSync(ficheiro)) throw new Error('artigo não encontrado: ' + c.slug);
  if (!fs.existsSync(path.join(CAPAS, c.slug + '.webp'))) throw new Error('capa em falta: ' + c.slug);

  const novo = `image: "/images/capas/${c.slug}.webp"`;
  const s = fs.readFileSync(ficheiro, 'utf8');
  const linhas = s.split(/\r?\n/);

  // delimitadores do frontmatter: a primeira e a segunda linha que é só ---
  if (linhas[0].trim() !== '---') throw new Error('sem frontmatter: ' + c.slug);
  const fim = linhas.findIndex((l, i) => i > 0 && l.trim() === '---');
  if (fim < 0) throw new Error('frontmatter não fecha: ' + c.slug);

  const iImagem = linhas.findIndex((l, i) => i > 0 && i < fim && /^image:\s/.test(l));
  if (iImagem >= 0) {
    antigas.push(linhas[iImagem].replace(/^image:\s*/, '').replace(/^["']|["']$/g, ''));
    if (linhas[iImagem] === novo) continue;
    linhas[iImagem] = novo;
  } else {
    linhas.splice(fim, 0, novo);
  }

  fs.writeFileSync(ficheiro, linhas.join('\n'));
  alterados++;
}

console.log('artigos atualizados:', alterados, 'de', capas.length);
// As antigas ficam em public/images/ — podem estar a ser usadas no corpo dos
// artigos, por isso nunca são apagadas aqui.
const orfas = [...new Set(antigas)].filter((p) => !p.startsWith('/images/capas/'));
if (orfas.length) console.log('capas antigas que deixaram de ser referenciadas:', orfas.length);
