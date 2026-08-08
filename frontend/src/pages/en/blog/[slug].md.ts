import type { APIContext } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getPublishedPosts } from '../../../lib/seo/posts';

// Markdown alternates for agent consumption — /en/blog/{slug}.md returns the
// raw post (frontmatter + body). Advertised via <link rel="alternate"
// type="text/markdown"> on each post.
export async function getStaticPaths() {
  const posts = await getPublishedPosts('blogEn');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export async function GET({ props }: APIContext) {
  const post = props.post as CollectionEntry<'blogEn'>;
  const frontmatter = [
    '---',
    `title: "${post.data.title.replace(/"/g, '\\"')}"`,
    `description: "${post.data.description.replace(/"/g, '\\"')}"`,
    `date: ${post.data.date.toISOString()}`,
    ...(post.data.tags?.length ? [`tags: [${post.data.tags.join(', ')}]`] : []),
    '---',
    '',
  ].join('\n');

  const body = `${frontmatter}${post.body ?? ''}`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
