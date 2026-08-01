// Gera as variações de expressão do retrato via Replicate / google/nano-banana.
//
//   node scripts/capas/gerar-retratos.mjs
//
// A foto de partida é sempre a mesma (retratos/_base.webp): só muda a expressão
// e o gesto, para as capas não ficarem todas iguais sem que o rosto deixe de ser
// o mesmo. Saída em retratos/<nome>.webp, 880 px de largura.
//
// Precisa de REPLICATE_API_TOKEN em frontend/.env. Custa ~$0.04 por imagem.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Replicate from '../../Plugins/conteudo-geo/skills/gerar-artigos-geo/scripts/node_modules/replicate/index.js';
import sharp from '../../frontend/node_modules/sharp/lib/index.js';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(DIR, '..', '..');
const RETRATOS = path.join(DIR, 'retratos');
const BASE = path.join(RETRATOS, '_base.webp');

// Âncora de identidade repetida em todos os prompts — sem isto o modelo deriva
// para outra cara ao fim de duas gerações.
const IDENT =
  'Keep the exact same man: same bald head, same face shape, same eyebrows, ' +
  'same light stubble, same skin tone, same age. Keep the same clothing: black ' +
  'zip-up fleece hoodie over a white polo shirt. Keep the same outdoor location ' +
  'and background. Photorealistic photograph, not illustration. Do not change his identity.';

// As fotos de origem são selfies em sol duro, com os olhos semicerrados.
const LUZ =
  'Soften the harsh direct sunlight into even, flattering light on the face; ' +
  'open the shadows under the brows so the eyes read clearly and are not squinting.';

const VARIACOES = [
  {
    nome: 'sorriso',
    prompt:
      'Change his expression to a light, natural closed-mouth smile, relaxed and ' +
      'confident, looking straight at the camera. Head and shoulders framing, same as the original.',
  },
  {
    nome: 'sereno',
    prompt:
      'Change his expression to calm and self-assured with a very subtle closed-mouth ' +
      'smile, chin slightly raised, looking straight at the camera. His mouth must be ' +
      'fully closed. Head and shoulders framing, same as the original.',
  },
];

function urlDe(output) {
  const o = Array.isArray(output) ? output[0] : output;
  if (!o) return null;
  if (typeof o === 'string') return o;
  if (typeof o.url === 'function') return String(o.url());
  return o.url ? String(o.url) : String(o);
}

async function token() {
  const env = await fs.readFile(path.join(RAIZ, 'frontend', '.env'), 'utf8');
  const linha = env.split(/\r?\n/).find((l) => l.startsWith('REPLICATE_API_TOKEN='));
  if (!linha) throw new Error('REPLICATE_API_TOKEN não está em frontend/.env');
  return linha.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
}

async function main() {
  const base = await fs.readFile(BASE).catch(() => {
    throw new Error(`retrato de partida não encontrado: ${BASE}`);
  });
  const imagem = `data:image/webp;base64,${base.toString('base64')}`;
  const replicate = new Replicate({ auth: await token() });

  for (const v of VARIACOES) {
    const destino = path.join(RETRATOS, v.nome + '.webp');
    try {
      await fs.access(destino);
      console.log('já existe, saltar:', v.nome);
      continue;
    } catch {}

    console.log('gerar:', v.nome);
    // Abaixo de $5 de crédito a conta cai para 6 pedidos/minuto com burst 1,
    // por isso o 429 é o caso normal e não o excecional.
    let output;
    for (let tentativa = 1; ; tentativa++) {
      try {
        output = await replicate.run('google/nano-banana', {
          input: {
            prompt: `${IDENT} ${LUZ} ${v.prompt}`,
            image_input: [imagem],
            aspect_ratio: '4:5',
            output_format: 'png',
          },
        });
        break;
      } catch (e) {
        if (!/429|throttled/i.test(e.message) || tentativa > 6) throw e;
        const espera = 20000 * tentativa;
        console.log(`  429, esperar ${espera / 1000}s (tentativa ${tentativa})`);
        await new Promise((r) => setTimeout(r, espera));
      }
    }

    const res = await fetch(urlDe(output));
    if (!res.ok) throw new Error(`download falhou ${res.status} (${v.nome})`);
    await sharp(Buffer.from(await res.arrayBuffer()))
      .resize({ width: 880 })
      .webp({ quality: 90 })
      .toFile(destino);
    console.log('  ok ->', path.relative(RAIZ, destino));
  }
}

main().catch((e) => {
  console.error('ERRO:', e.message);
  process.exit(1);
});
