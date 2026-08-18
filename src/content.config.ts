import { defineCollection, z } from 'astro:content';

const imageWithAlt = (image: () => z.ZodTypeAny) => z.object({
  src: image(),
  alt: z.string().min(1, 'Provide meaningful alternative text for this image.'),
});

const settings = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    email: z.string().email(),
    defaultDescription: z.string().min(1),
    defaultSharingImage: imageWithAlt(image),
    socialLinks: z.array(z.object({ label: z.string().min(1), url: z.string().url() })),
  }),
});

const pages = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    home: z.object({
      intro: z.string().min(1),
      portrait: imageWithAlt(image),
      primaryCta: z.object({ label: z.string(), href: z.string() }),
      secondaryCta: z.object({ label: z.string(), href: z.string() }),
      featuredHeading: z.string().min(1),
    }).optional(),
    about: z.object({
      intro: z.string().min(1),
      portrait: imageWithAlt(image),
      expertise: z.array(z.string().min(1)).min(1),
    }).optional(),
    contact: z.object({ heading: z.string().min(1), intro: z.string().min(1) }).optional(),
    navigation: z.object({ items: z.array(z.object({ label: z.string(), href: z.string() })).min(1) }).optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    client: z.string().min(1),
    role: z.string().min(1),
    year: z.coerce.number().int().min(2000),
    services: z.array(z.string().min(1)).min(1),
    cover: imageWithAlt(image),
    gallery: z.array(imageWithAlt(image).extend({ caption: z.string().optional() })),
    externalUrl: z.string().url().optional(),
    featured: z.boolean(),
    order: z.coerce.number().int().min(0),
  }),
});

export const collections = { settings, pages, projects };
