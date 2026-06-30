import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date().optional(),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    image: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    publishDate: z.coerce.date().optional(),
  }).transform((d) => {
    const safeDate = d.date ?? d.pubDate ?? d.publishDate ?? new Date(0);
    return {
      ...d,
      date: safeDate,
      pubDate: d.pubDate ?? safeDate,
      publishDate: d.publishDate ?? safeDate,
      updatedDate: d.updatedDate ?? safeDate,
    };
  }),
});

export const collections = { blog: blog };
