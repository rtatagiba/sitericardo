/**
 * Blog Admin Worker — ponte segura entre o painel /admin do site e a API do GitHub.
 *
 * Endpoints (todos exigem `Authorization: Bearer <API_SECRET_KEY>`):
 *   GET    /posts          → lista os arquivos .md de CONTENT_PATH
 *   GET    /posts/:slug    → conteúdo (markdown bruto) + sha do arquivo
 *   PUT    /posts/:slug    → cria ou atualiza o arquivo { content: string }
 *   DELETE /posts/:slug    → exclui o arquivo
 *
 * Variáveis (wrangler.toml): GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, CONTENT_PATH, ALLOWED_ORIGIN
 * Secrets (wrangler secret put): GITHUB_TOKEN, API_SECRET_KEY
 */

const GITHUB_API = 'https://api.github.com';

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(env, status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(env) },
  });
}

// btoa/atob são latin1-only; estes helpers cobrem UTF-8 (acentos do português)
function encodeContent(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function decodeContent(base64) {
  const binary = atob(base64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function github(env, method, path, body) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'blog-admin-worker',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = res.status === 204 ? null : await res.json();
  return { ok: res.ok, status: res.status, data };
}

function contentPath(env, slug) {
  return `/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${env.CONTENT_PATH}/${slug}.md`;
}

async function getSha(env, slug) {
  const { ok, data } = await github(env, 'GET', `${contentPath(env, slug)}?ref=${env.GITHUB_BRANCH}`);
  return ok ? data.sha : null;
}

// Normaliza o nome do arquivo: sem acentos, minúsculo, só [a-z0-9-] no "miolo"
function safeFilename(name) {
  const dot = name.lastIndexOf('.');
  const ext = (dot > 0 ? name.slice(dot + 1) : 'webp').toLowerCase().replace(/[^a-z0-9]/g, '');
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'imagem';
  return { base, ext };
}

async function imageExists(env, filename) {
  const { ok } = await github(
    env,
    'GET',
    `/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${env.IMAGE_PATH}/${filename}?ref=${env.GITHUB_BRANCH}`,
  );
  return ok;
}

// POST /images  { filename, content }  content = Base64 puro (sem "data:...;base64,")
async function uploadImage(env, request) {
  const body = await request.json().catch(() => null);
  if (!body?.filename || !body?.content) {
    return json(env, 400, { error: 'Campos "filename" e "content" (Base64) são obrigatórios.' });
  }

  const { base, ext } = safeFilename(body.filename);
  const allowed = ['webp', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'avif'];
  if (!allowed.includes(ext)) {
    return json(env, 400, { error: `Extensão .${ext} não permitida. Use: ${allowed.join(', ')}.` });
  }

  // Evita sobrescrever: se já existe, acrescenta sufixo numérico
  let filename = `${base}.${ext}`;
  for (let n = 2; (await imageExists(env, filename)) && n < 100; n++) {
    filename = `${base}-${n}.${ext}`;
  }

  const { ok, status, data } = await github(
    env,
    'PUT',
    `/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${env.IMAGE_PATH}/${filename}`,
    {
      message: `img: adiciona ${filename}`,
      content: body.content.replace(/^data:[^;]+;base64,/, ''),
      branch: env.GITHUB_BRANCH,
    },
  );
  if (!ok) return json(env, status, { error: data?.message || 'Erro ao enviar imagem.' });

  // Caminho público servido pelo Astro (public/images/foo.webp → /images/foo.webp)
  return json(env, 201, { filename, path: `/images/${filename}`, commit: data.commit?.sha });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    const auth = request.headers.get('Authorization') || '';
    if (auth !== `Bearer ${env.API_SECRET_KEY}`) {
      return json(env, 401, { error: 'Chave de API inválida ou ausente.' });
    }

    const url = new URL(request.url);

    // POST /images — upload de imagem (Base64) para IMAGE_PATH
    if (url.pathname.replace(/\/$/, '') === '/images') {
      if (request.method !== 'POST') return json(env, 405, { error: 'Use POST em /images.' });
      return uploadImage(env, request);
    }

    const match = url.pathname.match(/^\/posts(?:\/([a-z0-9-]+))?\/?$/);
    if (!match) return json(env, 404, { error: 'Rota não encontrada. Use /posts, /posts/:slug ou /images.' });
    const slug = match[1];

    try {
      // GET /posts — lista os artigos
      if (request.method === 'GET' && !slug) {
        const { ok, status, data } = await github(
          env,
          'GET',
          `/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${env.CONTENT_PATH}?ref=${env.GITHUB_BRANCH}`,
        );
        if (!ok) return json(env, status, { error: data?.message || 'Erro ao listar artigos.' });
        const posts = data
          .filter((f) => f.type === 'file' && f.name.endsWith('.md'))
          .map((f) => ({ slug: f.name.replace(/\.md$/, ''), sha: f.sha, size: f.size }));
        return json(env, 200, { posts });
      }

      // GET /posts/:slug — conteúdo bruto do artigo
      if (request.method === 'GET' && slug) {
        const { ok, status, data } = await github(env, 'GET', `${contentPath(env, slug)}?ref=${env.GITHUB_BRANCH}`);
        if (!ok) return json(env, status, { error: data?.message || 'Artigo não encontrado.' });
        return json(env, 200, { slug, sha: data.sha, content: decodeContent(data.content) });
      }

      // PUT /posts/:slug — cria ou atualiza
      if (request.method === 'PUT' && slug) {
        const body = await request.json().catch(() => null);
        if (!body?.content) return json(env, 400, { error: 'Campo "content" é obrigatório.' });
        const sha = await getSha(env, slug);
        const { ok, status, data } = await github(env, 'PUT', contentPath(env, slug), {
          message: sha ? `post: atualiza ${slug}` : `post: publica ${slug}`,
          content: encodeContent(body.content),
          branch: env.GITHUB_BRANCH,
          ...(sha ? { sha } : {}),
        });
        if (!ok) return json(env, status, { error: data?.message || 'Erro ao salvar artigo.' });
        return json(env, sha ? 200 : 201, { slug, created: !sha, commit: data.commit?.sha });
      }

      // DELETE /posts/:slug — exclui
      if (request.method === 'DELETE' && slug) {
        const sha = await getSha(env, slug);
        if (!sha) return json(env, 404, { error: 'Artigo não encontrado.' });
        const { ok, status, data } = await github(env, 'DELETE', contentPath(env, slug), {
          message: `post: exclui ${slug}`,
          sha,
          branch: env.GITHUB_BRANCH,
        });
        if (!ok) return json(env, status, { error: data?.message || 'Erro ao excluir artigo.' });
        return json(env, 200, { slug, deleted: true });
      }

      return json(env, 405, { error: 'Método não permitido.' });
    } catch (err) {
      return json(env, 500, { error: err instanceof Error ? err.message : 'Erro interno.' });
    }
  },
};
