import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { getPublishedPosts } from '../lib/seo/posts';
import { SITE_NAME, SITE_DESCRIPTION, absoluteUrl } from '../lib/seo/site';

const parser = new MarkdownIt();

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return rss({
    title: `${SITE_NAME} — Blog`,
    description: SITE_DESCRIPTION,
    site: context.site!,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}`,
      categories: post.data.tags,
      // Full content (not excerpts) so readers and agents get the whole post
      content: sanitizeHtml(parser.render(post.body ?? ''), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        transformTags: {
          img: (tagName, attribs) => ({
            tagName,
            attribs: { ...attribs, src: absoluteUrl(attribs.src ?? '') },
          }),
          a: (tagName, attribs) => ({
            tagName,
            attribs: {
              ...attribs,
              href: attribs.href?.startsWith('/') ? absoluteUrl(attribs.href) : (attribs.href ?? ''),
            },
          }),
        },
      }),
    })),
    customData: '<language>pt-BR</language>',
  });
}
