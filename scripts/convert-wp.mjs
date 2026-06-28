import { load } from 'cheerio';
import TurndownService from 'turndown';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITERICARDO = path.join(ROOT, 'sitericardo');
const OUTPUT = path.join(ROOT, 'frontend', 'src', 'content', 'blog');

// WP pages that become static Astro pages — skip from blog collection
const SKIP_SLUGS = new Set(['servicos', 'politica-de-privacidade', 'wp-content']);

const td = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
});

// Remove WordPress junk
td.addRule('remove-empty-spans', {
  filter: (node) =>
    node.nodeName === 'SPAN' &&
    !node.getAttribute('class') &&
    !node.getAttribute('style'),
  replacement: (content) => content,
});

td.addRule('strip-class-spans', {
  filter: (node) =>
    node.nodeName === 'SPAN' &&
    (node.getAttribute('class') || node.getAttribute('style')),
  replacement: (content) => content,
});

function extractMeta(html, slug) {
  const $ = load(html, { decodeEntities: false });

  // Title: OG title, strip site name suffix
  let title = $('meta[property="og:title"]').attr('content') || $('title').text() || slug;
  title = title
    .replace(/ - Ricardo SEO Freelancer$/, '')
    .replace(/ - Staloo Agência Digital$/, '')
    .trim();

  // Date: article:published_time or time[datetime]
  const dateRaw =
    $('meta[property="article:published_time"]').attr('content') ||
    $('time.entry-date').attr('datetime') ||
    '2025-01-01T00:00:00';
  const date = dateRaw.split('T')[0]; // YYYY-MM-DD

  // Description
  const description =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    '';

  // Image: og:image — convert to /images/ relative path
  const ogImage = $('meta[property="og:image"]').attr('content') || '';
  const image = ogImage
    ? ogImage.replace('https://ricardotatagiba.com.br/wp-content/uploads/', '/images/')
    : '';

  // Content: entry-content div
  let content = $('div.entry-content').html() || '';

  // Fallback: if no entry-content, try article body
  if (!content) {
    content = $('article').find('.post-content, .content, main').html() || '';
  }

  return { title, date, description, image, content };
}

function cleanContent(html) {
  const $ = load(html, { decodeEntities: false });

  // Remove WP-specific classes but keep the element/content
  $('[class^="article-editor-content__"]').each((_, el) => {
    const $el = $(el);
    $el.removeAttr('class');
  });

  // Remove inline styles
  $('[style]').removeAttr('style');

  // Remove empty paragraphs
  $('p').each((_, el) => {
    if ($(el).text().trim() === '' && $(el).find('img').length === 0) {
      $(el).remove();
    }
  });

  // Fix internal links: https://ricardotatagiba.com.br/slug/ → /slug/
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('https://ricardotatagiba.com.br/')) {
      $(el).attr('href', href.replace('https://ricardotatagiba.com.br', ''));
    }
  });

  // Fix image src: wp-content/uploads → /images/
  $('img[src]').each((_, el) => {
    const src = $(el).attr('src') || '';
    if (src.includes('ricardotatagiba.com.br/wp-content/uploads/')) {
      $(el).attr(
        'src',
        src.replace('https://ricardotatagiba.com.br/wp-content/uploads/', '/images/')
      );
    }
    // Remove srcset (not needed in markdown)
    $(el).removeAttr('srcset');
    $(el).removeAttr('sizes');
  });

  return $.html();
}

function toMarkdown(html) {
  const cleaned = cleanContent(html);
  return td.turndown(cleaned);
}

function buildFrontmatter(meta) {
  const { title, date, description, image } = meta;
  const escapedTitle = title.replace(/"/g, '\\"');
  const escapedDesc = description.replace(/"/g, '\\"');
  let fm = `---\ntitle: "${escapedTitle}"\ndate: ${date}\ndescription: "${escapedDesc}"\n`;
  if (image) fm += `image: "${image}"\n`;
  fm += `---\n`;
  return fm;
}

// Process all article folders
const folders = fs.readdirSync(SITERICARDO, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !SKIP_SLUGS.has(d.name));

let converted = 0;
let skipped = 0;

for (const folder of folders) {
  const slug = folder.name;
  const htmlPath = path.join(SITERICARDO, slug, 'index.html');

  if (!fs.existsSync(htmlPath)) {
    console.log(`SKIP (no index.html): ${slug}`);
    skipped++;
    continue;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const meta = extractMeta(html, slug);

  if (!meta.content) {
    console.log(`SKIP (no entry-content): ${slug}`);
    skipped++;
    continue;
  }

  const markdown = toMarkdown(meta.content);
  const frontmatter = buildFrontmatter(meta);
  const output = frontmatter + '\n' + markdown;

  const outPath = path.join(OUTPUT, `${slug}.md`);
  fs.writeFileSync(outPath, output, 'utf8');
  console.log(`OK: ${slug}`);
  converted++;
}

console.log(`\nDone: ${converted} converted, ${skipped} skipped.`);
