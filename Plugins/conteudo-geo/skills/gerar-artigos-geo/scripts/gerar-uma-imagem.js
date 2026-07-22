// gerar-uma-imagem.js
// Gera UMA imagem via Replicate, trata (recorta + comprime + converte pra webp) e grava no caminho indicado.
// Pensado para o Claude Code invocar por imagem, dentro do fluxo do artigo.
//
// Uso:
//   npm i replicate sharp
//   export REPLICATE_API_TOKEN=r8_xxxxx   (PowerShell: $env:REPLICATE_API_TOKEN="r8_xxxxx")
//   node gerar-uma-imagem.js --prompt "..." --out imagens/slug/img_1.webp --tier hero
//
// Com personagem consistente (só faz sentido no tier hero):
//   node gerar-uma-imagem.js --prompt "..." --out imagens/slug/img_1.webp --tier hero \
//     --personagem-refs "assets/personagem/ref_1.jpg,assets/personagem/ref_2.jpg" \
//     --personagem-desc "mulher, 30 anos, cabelo castanho cacheado, blazer azul"
//
// Flags:
//   --prompt            (obrigatório)  texto do prompt fotorrealista (a CENA/ação, não repetir rosto/roupa se já tem --personagem-refs)
//   --out               (obrigatório)  caminho de saída, ex: imagens/slug/o-clique-que-nao-aconteceu.webp
//                        (o arquivo final é SEMPRE webp, independente da extensão passada aqui; o NOME do arquivo
//                        precisa ser kebab-case: minúsculas, sem espaço, sem acento, só [a-z0-9-]. Falha se não for.)
//   --tier              hero|secundario   default: secundario
//   --aspect            ex: 3:2         default: 3:2 (proporção pedida ao modelo; o recorte final ainda usa --w/--h)
//   --w                 largura final em px, default: 700
//   --h                 altura final em px, default: 400
//   --personagem-refs   caminhos de 1+ fotos de referência do personagem, separados por vírgula. Só usado no tier hero.
//   --personagem-desc   descrição curta do personagem (roupa/cabelo/idade), ajuda a ancorar a identidade junto das refs.
//
// Toda imagem sai recortada (crop inteligente, priorizando o assunto/personagem) para --w x --h
// e comprimida em WebP qualidade 82, batendo com o padrão já usado no site.
//
// Modelos (licença comercial ok):
//   hero            -> black-forest-labs/flux-1.1-pro   (~$0.04/img)
//   hero+personagem -> google/nano-banana                (Gemini 2.5 Flash Image, multi-imagem de referência, bom em manter
//                       personagem consistente; confirmar preço/schema atual em
//                       https://replicate.com/google/nano-banana antes de rodar em volume)
//   secundario      -> black-forest-labs/flux-schnell    (~$0.003/img)
// NAO uses flux-dev (licença não comercial).

import Replicate from "replicate";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

async function paraDataUri(caminho) {
  const buf = await fs.readFile(caminho);
  const ext = path.extname(caminho).slice(1).toLowerCase();
  const mime = ext === "jpg" ? "jpeg" : ext;
  return `data:image/${mime};base64,${buf.toString("base64")}`;
}

function parseArgs(argv) {
  const a = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const k = argv[i].slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
      a[k] = v;
    }
  }
  return a;
}

const MODELOS = {
  hero: "black-forest-labs/flux-1.1-pro",
  secundario: "black-forest-labs/flux-schnell",
  "hero-personagem": "google/nano-banana",
};

function extrairUrl(output) {
  const o = Array.isArray(output) ? output[0] : output;
  if (!o) return null;
  if (typeof o === "string") return o;
  if (typeof o.url === "function") return o.url();
  if (o.url) return o.url;
  return String(o);
}

const NOME_KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*\.[a-z0-9]+$/;

async function main() {
  const args = parseArgs(process.argv);
  if (!args.prompt || !args.out) {
    console.error("Faltam flags obrigatórias: --prompt e --out");
    process.exit(2);
  }

  const nomeArquivo = path.basename(args.out);
  if (!NOME_KEBAB_CASE.test(nomeArquivo)) {
    console.error(
      `--out inválido: "${nomeArquivo}" precisa ser kebab-case (minúsculas, sem espaço/acento, ex: o-clique-que-nao-aconteceu.webp). Recebido: ${nomeArquivo}`
    );
    process.exit(2);
  }

  const tier = args.tier === "hero" ? "hero" : "secundario";
  const aspect = args.aspect || "3:2";

  const refsRaw = typeof args["personagem-refs"] === "string" ? args["personagem-refs"] : "";
  const refs = refsRaw.split(",").map((s) => s.trim()).filter(Boolean);
  const usaPersonagem = tier === "hero" && refs.length > 0;

  if (refs.length > 0 && tier !== "hero") {
    console.error("--personagem-refs só é suportado no tier hero (imagem de capa); ignorado.");
  }

  const modeloKey = usaPersonagem ? "hero-personagem" : tier;
  const modelo = MODELOS[modeloKey];

  // idempotente: não regenera se já existe
  try {
    await fs.access(args.out);
    console.log(`já existe, saltar: ${args.out}`);
    process.exit(0);
  } catch {}

  if (usaPersonagem) {
    for (const ref of refs) {
      await fs.access(ref).catch(() => {
        throw new Error(`imagem de referência do personagem não encontrada: ${ref}`);
      });
    }
  }

  const desc = typeof args["personagem-desc"] === "string" ? args["personagem-desc"] : "";
  const prompt = usaPersonagem && desc ? `Personagem: ${desc}. ${args.prompt}` : args.prompt;

  const replicate = new Replicate(); // usa REPLICATE_API_TOKEN
  const input = usaPersonagem
    ? {
        prompt,
        image_input: await Promise.all(refs.map(paraDataUri)),
        aspect_ratio: aspect,
        output_format: "png",
      }
    : {
        prompt,
        aspect_ratio: aspect,
        output_format: "png",
        output_quality: 90,
        safety_tolerance: 2,
      };

  console.log(`gerar [${modeloKey}] ${modelo} -> ${args.out}`);
  const output = await replicate.run(modelo, { input });
  const url = extrairUrl(output);
  if (!url) throw new Error("sem URL de saída do Replicate");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`download falhou ${res.status}`);
  const bufBruto = Buffer.from(await res.arrayBuffer());

  const w = Number(args.w) || 700;
  const h = Number(args.h) || 400;
  const buf = await sharp(bufBruto)
    .resize(w, h, { fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: 82 })
    .toBuffer();

  await fs.mkdir(path.dirname(args.out), { recursive: true });
  await fs.writeFile(args.out, buf);

  // confirma
  const stat = await fs.stat(args.out);
  if (stat.size < 1000) throw new Error("ficheiro gravado parece vazio");
  console.log(`OK ${args.out} (${(stat.size / 1024).toFixed(0)} KB, ${w}x${h}, modelo ${modelo})`);
}

main().catch((e) => {
  console.error("ERRO:", e.message);
  process.exit(1);
});