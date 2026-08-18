import { defineCollection, z } from 'astro:content';

const imageWithAlt = z.object({
  src: z.string().min(1),
  alt: z.string().min(1, 'Provide meaningful alternative text for this image.'),
});

const settings = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    email: z.string().email(),
    defaultDescription: z.string().min(1),
    phone: z.object({
      display: z.string().min(1),
      dial: z.string().regex(/^\+\d+$/, 'Use an international E.164-style telephone number.'),
    }),
    defaultSharingImage: imageWithAlt,
    socialLinks: z.array(z.object({ label: z.string().min(1), url: z.string().url() })),
  }),
});

const pages = defineCollection({
  type: 'data',
  schema: z.object({
    home: z.object({
      intro: z.string().min(1),
      portrait: imageWithAlt,
      hoverPortrait: imageWithAlt.optional(),
      primaryCta: z.object({ label: z.string(), href: z.string() }),
      secondaryCta: z.object({ label: z.string(), href: z.string() }),
      featuredHeading: z.string().min(1),
    }).optional(),
    about: z.object({
      intro: z.string().min(1),
      portrait: imageWithAlt,
      expertise: z.array(z.string().min(1)).min(1),
    }).optional(),
    contact: z.object({ heading: z.string().min(1), intro: z.string().min(1) }).optional(),
    navigation: z.object({ items: z.array(z.object({ label: z.string(), href: z.string() })).min(1) }).optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    client: z.string().min(1),
    role: z.string().min(1),
    year: z.coerce.number().int().min(2000),
    services: z.array(z.string().min(1)).min(1),
    cover: imageWithAlt,
    gallery: z.array(imageWithAlt.extend({ caption: z.string().optional() })).min(1),
    externalUrl: z.string().url().optional(),
    featured: z.boolean(),
    order: z.coerce.number().int().min(0),
  }),
});

export const collections = { settings, pages, projects };
