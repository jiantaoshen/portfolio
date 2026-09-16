import { z } from "zod";

export const projectSchema = z.object({
  lang: z.enum([
    "en",
    "sv",
    "zh",
  ]),

  title: z.string(),

  description: z.string(),

  status: z.string(),

  order: z
    .number()
    .int()
    .default(999),

  technologies: z
    .array(z.string())
    .default([]),

  links: z
    .object({
      github: z
        .httpUrl()
        .optional(),

      live: z
        .httpUrl()
        .optional(),
    })
    .optional(),

  draft: z
    .boolean()
    .default(false),
});

export type ProjectData =
  z.infer<typeof projectSchema>;