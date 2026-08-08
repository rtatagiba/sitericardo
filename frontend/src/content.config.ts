import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date().optional(),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    image: z.string().optional(),
    // Legenda e crédito da imagem de topo, sobrepostos ao rodapé dela.
    imageCaption: z.string().optional(),
    imageCredit: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    publishDate: z.coerce.date().optional(),
  })
  .transform((d) => {
    const safeDate = d.date ?? d.pubDate ?? d.publishDate ?? new Date(0);
    return {
      ...d,
      date: safeDate,
      pubDate: d.pubDate ?? safeDate,
      publishDate: d.publishDate ?? safeDate,
      updatedDate: d.updatedDate ?? safeDate,
    };
  });

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: blogSchema,
});

// Traduções do blog PT. Mesmo slug (nome de arquivo) do post original em
// src/content/blog — é o que liga um post à sua tradução para hreflang e
// para o LanguageSwitcher.
const blogEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog-en' }),
  schema: blogSchema,
});

const blogEs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog-es' }),
  schema: blogSchema,
});

export const collections = { blog, blogEn, blogEs };
