import type { APIContext } from 'astro';
import { getPublishedPosts } from '../lib/seo/posts';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '../lib/seo/site';

// llms.txt spec: https://llmstxt.org/
export async function GET(_context: APIContext) {
  const posts = await getPublishedPosts();

  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    'Site em português (pt-BR) sobre SEO, marketing digital e crescimento no Google, escrito por Ricardo Tatagiba, consultor SEO freelancer.',
    '',
    '## Páginas',
    '',
    `- [Sobre](${SITE_URL}/sobre): Quem é Ricardo Tatagiba`,
    `- [Serviços](${SITE_URL}/servicos): Serviços de consultoria SEO`,
    `- [Portfólio](${SITE_URL}/portfolio): Projetos e resultados`,
    `- [Contato](${SITE_URL}/contato): Como entrar em contato`,
    `- [Ferramentas](${SITE_URL}/ferramentas): Ferramentas gratuitas de SEO`,
    '',
    '## Blog',
    '',
    ...posts.map(
      (post) =>
        `- [${post.data.title}](${SITE_URL}/blog/${post.id}.md): ${post.data.description}`,
    ),
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
