// Gera as capas do blog a partir de capas.json.
//
//   node scripts/capas/gerar-capas.js            # gera as que faltam
//   node scripts/capas/gerar-capas.js --forcar   # regenera todas
//   node scripts/capas/gerar-capas.js <slug>     # só uma
//
// Saída: frontend/public/images/capas/<slug>.webp, 1200x675 (o mesmo tamanho
// que o BaseLayout declara em og:image).

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('../../frontend/node_modules/sharp');
const { capa } = require('./template.js');

const DIR = __dirname;
const RAIZ = path.resolve(DIR, '..', '..');
const DESTINO = path.join(RAIZ, 'frontend', 'public', 'images', 'capas');
const TRABALHO = path.join(DIR, '.trabalho');
const CHROME = process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const argv = process.argv.slice(2);
const forcar = argv.includes('--forcar');
const soSlug = argv.find((a) => !a.startsWith('--'));

async function render(c) {
  const destino = path.join(DESTINO, c.slug + '.webp');
  if (!forcar && fs.existsSync(destino)) {
    console.log('já existe, saltar:', c.slug);
    return;
  }

  const htmlPath = path.join(TRABALHO, c.slug + '.html');
  const pngPath = path.join(TRABALHO, c.slug + '.png');
  // o retrato é referenciado relativamente ao HTML, que vive em .trabalho/
  fs.writeFileSync(htmlPath, capa({ ...c, photo: `../retratos/${c.retrato}.webp` }));

  execFileSync(CHROME, [
    '--headless', '--disable-gpu', '--no-sandbox',
    `--user-data-dir=${path.join(TRABALHO, 'chrome-profile')}`,
    '--force-device-scale-factor=2',
    '--window-size=1200,675',
    '--virtual-time-budget=6000',
    `--screenshot=${pngPath}`,
    'file:///' + htmlPath.replace(/\\/g, '/'),
  ], { stdio: 'pipe' });

  await sharp(pngPath).resize(1200, 675).webp({ quality: 88 }).toFile(destino);
  const kb = (fs.statSync(destino).size / 1024).toFixed(0);
  console.log(`ok: ${c.slug}.webp (${kb} KB)`);
}

async function main() {
  if (!fs.existsSync(CHROME)) {
    console.error(`Chrome não encontrado em ${CHROME}. Define CHROME_BIN.`);
    process.exit(1);
  }
  fs.mkdirSync(DESTINO, { recursive: true });
  fs.mkdirSync(TRABALHO, { recursive: true });

  const capas = JSON.parse(fs.readFileSync(path.join(DIR, 'capas.json'), 'utf8'));
  const lista = soSlug ? capas.filter((c) => c.slug === soSlug) : capas;
  if (lista.length === 0) {
    console.error(soSlug ? `slug não encontrado em capas.json: ${soSlug}` : 'capas.json vazio');
    process.exit(1);
  }
  for (const c of lista) await render(c);
}

main().catch((e) => {
  console.error('ERRO:', e.message);
  process.exit(1);
});
