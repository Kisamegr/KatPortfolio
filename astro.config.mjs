import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import headingIds from './src/utils/remark-heading-ids.mjs';

export default defineConfig({
  site: 'https://katerina-kel.com/',
  base: '/',
  output: 'static',
  integrations: [sitemap()],
  markdown: { remarkPlugins: [headingIds] },
  image: { responsiveStyles: true }
});
