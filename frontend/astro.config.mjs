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
    plugins: [tailwindcss()],
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
