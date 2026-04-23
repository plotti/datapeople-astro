import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      readTime: z.number().int().positive().optional(),
      category: z.string(),
      tags: z.array(z.string()).default([]),
      cover: image(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
