import { getCollection, type CollectionEntry } from 'astro:content';

/** All non-draft blog posts, newest first. */
export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', (entry: CollectionEntry<'blog'>) => entry.data.draft !== true);
  return posts.sort(
    (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) =>
      b.data.date.getTime() - a.data.date.getTime(),
  );
}
