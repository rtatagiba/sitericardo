import type { TopicCluster } from './types';

/** Minimum Jaccard similarity between token sets to consider two slugs the same topic */
const SIMILARITY_THRESHOLD = 0.5;

const STOPWORDS = new Set([
  // pt
  'de', 'da', 'do', 'das', 'dos', 'e', 'o', 'a', 'os', 'as', 'um', 'uma',
  'para', 'por', 'com', 'em', 'no', 'na', 'nos', 'nas', 'que', 'como',
  'seu', 'sua', 'seus', 'suas', 'mais', 'ao', 'aos', 'ou', 'guia',
  // en
  'the', 'and', 'for', 'of', 'to', 'in', 'on', 'is', 'an', 'what', 'how',
  'why', 'your', 'you', 'with', 'best', 'top', 'guide',
  // es
  'el', 'la', 'los', 'las', 'y', 'del', 'con', 'una', 'uno', 'que', 'como',
]);

const NON_CONTENT_PATTERNS = [
  /\/(tag|tags|category|categoria|categorias|author|autor|page|pagina)\//i,
  /\/page\/\d+/i,
  /\/(wp-content|wp-json|feed|cart|carrinho|checkout|login|admin)\b/i,
  /\.(jpe?g|png|gif|webp|svg|pdf|zip|mp4|mp3|css|js)(\?.*)?$/i,
];

/** True for URLs that look like content pages (excludes taxonomies, assets, etc.) */
export function isContentUrl(url: string): boolean {
  let pathname: string;
  try {
    pathname = new URL(url).pathname;
  } catch {
    return false;
  }
  if (pathname === '/' || pathname === '') return false;
  return !NON_CONTENT_PATTERNS.some((re) => re.test(url));
}

/** Extracts normalized topic tokens from a URL's slug */
export function tokenizeUrl(url: string): string[] {
  let pathname: string;
  try {
    pathname = new URL(url).pathname;
  } catch {
    return [];
  }
  pathname = pathname.replace(/\.(html?|php|aspx?)$/i, '').replace(/\/+$/, '');
  const segments = pathname.split('/').filter(Boolean);

  // Use the last segment containing real words (skips trailing IDs/dates)
  let slug = '';
  for (let i = segments.length - 1; i >= 0; i--) {
    if (/[a-z]{3,}/i.test(segments[i])) {
      slug = segments[i];
      break;
    }
  }
  if (!slug) return [];

  const tokens = decodeURIComponent(slug)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t) && !/^\d+$/.test(t));

  return [...new Set(tokens)];
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection++;
  return intersection / (a.size + b.size - intersection);
}

/**
 * Groups URLs from every site into topic clusters by slug similarity.
 * Uses an inverted token index so we only compare candidates that share
 * at least one token (keeps up to 10 sites × 3000 URLs tractable).
 */
export function clusterTopics(sitesUrls: string[][]): TopicCluster[] {
  const clusters: TopicCluster[] = [];
  const tokenIndex = new Map<string, number[]>();
  const siteCount = sitesUrls.length;

  for (let siteIdx = 0; siteIdx < siteCount; siteIdx++) {
    for (const url of sitesUrls[siteIdx]) {
      if (!isContentUrl(url)) continue;
      const tokenList = tokenizeUrl(url);
      if (tokenList.length === 0) continue;
      const tokens = new Set(tokenList);

      // Collect candidate clusters that share at least one token
      const candidateIds = new Set<number>();
      for (const token of tokens) {
        for (const id of tokenIndex.get(token) ?? []) candidateIds.add(id);
      }

      let bestId = -1;
      let bestScore = 0;
      for (const id of candidateIds) {
        const score = jaccard(tokens, clusters[id].tokens);
        if (score > bestScore) {
          bestScore = score;
          bestId = id;
        }
      }

      // Single-token slugs are too ambiguous for fuzzy matching — require exact
      const threshold = tokens.size === 1 ? 0.99 : SIMILARITY_THRESHOLD;

      if (bestId >= 0 && bestScore >= threshold) {
        clusters[bestId].urlsBySite[siteIdx].push(url);
      } else {
        const id = clusters.length;
        clusters.push({
          id,
          label: tokenList.join(' '),
          tokens,
          urlsBySite: Array.from({ length: siteCount }, () => [] as string[]),
          competitorCount: 0,
          userHas: false,
        });
        clusters[id].urlsBySite[siteIdx].push(url);
        for (const token of tokens) {
          const list = tokenIndex.get(token);
          if (list) list.push(id);
          else tokenIndex.set(token, [id]);
        }
      }
    }
  }

  for (const cluster of clusters) {
    cluster.userHas = cluster.urlsBySite[0].length > 0;
    cluster.competitorCount = cluster.urlsBySite.filter(
      (urls, i) => i > 0 && urls.length > 0,
    ).length;
  }

  // Opportunities first: most competitors covering it, then label
  return clusters.sort((a, b) => {
    if (a.userHas !== b.userHas) return a.userHas ? 1 : -1;
    if (b.competitorCount !== a.competitorCount) return b.competitorCount - a.competitorCount;
    return a.label.localeCompare(b.label);
  });
}
