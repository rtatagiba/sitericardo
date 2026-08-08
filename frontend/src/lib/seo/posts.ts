import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { blogBasePath } from '../../i18n/routes';
import type { Locale } from '../../i18n/ui';

type BlogCollection = 'blog' | 'blogEn' | 'blogEs';

const collectionByLocale: Record<Locale, BlogCollection> = {
  pt: 'blog',
  en: 'blogEn',
  es: 'blogEs',
};

/** All non-draft blog posts in the given collection, newest first. */
export async function getPublishedPosts<C extends BlogCollection = 'blog'>(
  collection: C = 'blog' as C,
): Promise<CollectionEntry<C>[]> {
  const posts = await getCollection(collection, (entry: CollectionEntry<C>) => entry.data.draft !== true);
  return posts.sort(
    (a: CollectionEntry<C>, b: CollectionEntry<C>) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

/** Per-locale blog paths for a post slug, limited to locales that have a published translation. Drives hreflang and the language switcher on post pages. */
export async function getTranslationLinks(slug: string): Promise<Partial<Record<Locale, string>>> {
  const entries = await Promise.all(
    (Object.keys(collectionByLocale) as Locale[]).map(async (locale) => {
      const entry = await getEntry(collectionByLocale[locale], slug);
      return entry && entry.data.draft !== true ? ([locale, `${blogBasePath[locale]}/${slug}`] as const) : null;
    }),
  );
  return Object.fromEntries(entries.filter((e): e is readonly [Locale, string] => e !== null));
}
