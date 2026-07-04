import { defineCollection, z } from 'astro:content';

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  draft: z.boolean().optional().default(false),
});

export const collections = {
  blog: defineCollection({
    type: 'content',
    schema: postSchema,
  }),
  private: defineCollection({
    type: 'content',
    schema: postSchema,
  }),
};
