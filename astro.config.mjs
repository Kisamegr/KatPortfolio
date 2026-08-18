import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? 'example';

export default defineConfig({
  site: `https://${owner}.github.io/KatPortfolio/`,
  base: isGitHubPagesBuild ? '/KatPortfolio' : '/',
  output: 'static',
  integrations: [sitemap()],
  image: { responsiveStyles: true }
});
