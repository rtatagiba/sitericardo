// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { indexNow } from './src/lib/seo/indexnow.mjs';

const SITE_URL = 'https://ricardotatagiba.com.br';
// IndexNow keys are public by design (served at /{key}.txt)
const INDEXNOW_KEY = '69a25886e73b444126f0e56ccaae66c2';

/**
 * Last git commit date for a file, used as sitemap <lastmod>.
 * @param {string} filePath
 */
function gitLastmod(filePath) {
  try {
    const log = execSync(`git log -1 --format="%cI" -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim();
    return log ? new Date(log) : null;
  } catch {
    return null;
  }
}

/**
 * Maps a built pathname back to its source file for lastmod lookup.
 * @param {string} pathname
 */
function sourceFileFor(pathname) {
  const clean = pathname.replace(/^\/|\/$/g, '');
  if (clean.startsWith('blog/') && clean !== 'blog') {
    const md = `src/content/blog/${clean.slice('blog/'.length)}.md`;
    return existsSync(md) ? md : null;
  }
  const page = clean === '' ? 'index' : clean;
  for (const candidate of [`src/pages/${page}.astro`, `src/pages/${page}/index.astro`]) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Dev-only middleware mirroring the production Cloudflare Pages Function
 * (functions/api/fetch-url.ts) so the Content Gap tool's CORS proxy also works
 * under `astro dev`. Without it, /api/fetch-url 404s in dev and CORS-less
 * competitor sitemaps (e.g. maudy.com.br) can't be read locally — only in a
 * deployed build. Keeps parity so what you test locally matches production.
 */
function devFetchUrlProxy() {
  const ALLOWED_TARGET = /(\.xml(\?.*)?$)|(\/robots\.txt$)|(\/feed\/?(\?.*)?$)|([?&]feed=)/i;
  return {
    name: 'dev-fetch-url-proxy',
    apply: 'serve',
    /** @param {import('vite').ViteDevServer} server */
    configureServer(server) {
      server.middlewares.use('/api/fetch-url', async (req, res) => {
        /** @param {number} status @param {string} body @param {Record<string,string>} [extra] */
        const send = (status, body, extra = {}) => {
          res.statusCode = status;
          res.setHeader('Access-Control-Allow-Origin', '*');
          for (const [k, v] of Object.entries(extra)) res.setHeader(k, v);
          res.end(body);
        };
        try {
          const raw = req.originalUrl || req.url || '';
          const target = new URL(raw, 'http://localhost').searchParams.get('url');
          if (!target || !ALLOWED_TARGET.test(target)) return send(400, 'bad target');
          const upstream = await fetch(target, {
            redirect: 'follow',
            headers: { Accept: 'application/xml, text/xml, text/plain, */*' },
          });
          const text = await upstream.text();
          if (!upstream.ok) {
            return send(upstream.status, JSON.stringify({ error: `HTTP ${upstream.status}` }), {
              'Content-Type': 'application/json',
            });
          }
          return send(200, text, {
            'Content-Type': upstream.headers.get('content-type') ?? 'text/xml; charset=utf-8',
          });
        } catch (err) {
          return send(502, JSON.stringify({ error: err instanceof Error ? err.message : 'fetch failed' }), {
            'Content-Type': 'application/json',
          });
        }
      });
    },
  };
}

// Old WordPress permalinks lived at the root (/{slug}/); posts now live
// under /blog/. Emits a 301 for every post so legacy URLs keep working.
const legacyRedirects = Object.fromEntries(
  readdirSync('src/content/blog')
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .map((slug) => [
      `/${slug}`,
      { status: /** @type {301} */ (301), destination: `/blog/${slug}/` },
    ]),
);

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  redirects: legacyRedirects,
  vite: {
    plugins: [tailwindcss(), devFetchUrlProxy()],
  },
  integrations: [
    sitemap({
      entryLimit: 1000,
      filter: (page) => !new URL(page).pathname.startsWith('/404'),
      chunks: {
        // Blog posts get their own sitemap; everything else falls into "pages"
        posts: (item) => {
          if (/^\/blog\/[^/]+/.test(new URL(item.url).pathname)) return item;
        },
      },
      serialize: (item) => {
        const src = sourceFileFor(new URL(item.url).pathname);
        const lastmod = src ? gitLastmod(src) : null;
        if (lastmod) item.lastmod = lastmod.toISOString();
        return item;
      },
    }),
    indexNow({ key: INDEXNOW_KEY, siteUrl: SITE_URL }),
  ],
});
