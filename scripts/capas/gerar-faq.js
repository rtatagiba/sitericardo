// Gera as imagens sem texto usadas nos blocos de FAQ da home ("Sobre mim").
// Mesmo pipeline das capas do blog (Chrome headless + sharp), mas com o
// template sem-texto e destino próprio.
//
//   node scripts/capas/gerar-faq.js

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('../../frontend/node_modules/sharp');
const { semTexto } = require('./template-sem-texto.js');

const DIR = __dirname;
const RAIZ = path.resolve(DIR, '..', '..');
const DESTINO = path.join(RAIZ, 'frontend', 'public', 'images', 'faq');
const TRABALHO = path.join(DIR, '.trabalho');
const CHROME = process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const ITENS = [
  { key: 'o-que-um-consultor-faz', retrato: 'cafe-laptop', photoPos: '50% 38%', lado: 'left' },
];

async function render(item) {
  const destino = path.join(DESTINO, item.key + '.webp');
  const htmlPath = path.join(TRABALHO, 'faq-' + item.key + '.html');
  const pngPath = path.join(TRABALHO, 'faq-' + item.key + '.png');

  fs.writeFileSync(htmlPath, semTexto({
    photo: `../retratos/${item.retrato}.webp`,
    photoPos: item.photoPos,
    seed: item.key,
    lado: item.lado,
  }));

  execFileSync(CHROME, [
    '--headless', '--disable-gpu', '--no-sandbox',
    `--user-data-dir=${path.join(TRABALHO, 'chrome-profile')}`,
    '--force-device-scale-factor=2',
    '--window-size=960,720',
    '--virtual-time-budget=6000',
    `--screenshot=${pngPath}`,
    'file:///' + htmlPath.replace(/\\/g, '/'),
  ], { stdio: 'pipe' });

  await sharp(pngPath).resize(960, 720).webp({ quality: 88 }).toFile(destino);
  const kb = (fs.statSync(destino).size / 1024).toFixed(0);
  console.log(`ok: ${item.key}.webp (${kb} KB)`);
}

async function main() {
  if (!fs.existsSync(CHROME)) {
    console.error(`Chrome não encontrado em ${CHROME}. Define CHROME_BIN.`);
    process.exit(1);
  }
  fs.mkdirSync(DESTINO, { recursive: true });
  fs.mkdirSync(TRABALHO, { recursive: true });
  for (const item of ITENS) await render(item);
}

main().catch((e) => {
  console.error('ERRO:', e.message);
  process.exit(1);
});
