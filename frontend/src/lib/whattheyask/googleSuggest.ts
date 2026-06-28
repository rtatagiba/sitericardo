import type { QueryItem } from './types';

function suggest(query: string, lang: string): Promise<string[]> {
  return new Promise((resolve) => {
    const cbName = `__wta_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const cleanup = () => {
      delete (window as Record<string, unknown>)[cbName];
      script.remove();
    };

    const timeout = setTimeout(() => {
      cleanup();
      resolve([]);
    }, 3000);

    (window as Record<string, unknown>)[cbName] = (data: unknown[]) => {
      clearTimeout(timeout);
      cleanup();
      try {
        resolve((data[1] as string[]) ?? []);
      } catch {
        resolve([]);
      }
    };

    const script = document.createElement('script');
    script.src = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}&hl=${lang}&callback=${cbName}`;
    script.onerror = () => {
      clearTimeout(timeout);
      cleanup();
      resolve([]);
    };
    document.head.appendChild(script);
  });
}

export async function fetchAllSuggestions(
  queries: QueryItem[],
  lang: string,
  onProgress: (completed: number, total: number) => void,
): Promise<Record<string, string[]>> {
  const results: Record<string, Set<string>> = {};
  const batchSize = 5;
  let completed = 0;

  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async ({ category, query }) => {
        const suggestions = await suggest(query, lang);
        if (!results[category]) results[category] = new Set();
        suggestions.forEach((s) => results[category].add(s));
        completed++;
        onProgress(completed, queries.length);
      }),
    );
    if (i + batchSize < queries.length) {
      await new Promise((r) => setTimeout(r, 100 + Math.random() * 100));
    }
  }

  return Object.fromEntries(
    Object.entries(results).map(([cat, set]) => [cat, [...set]]),
  );
}
