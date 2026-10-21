import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import remarkBaseLinks from './src/lib/remark-base-links.mjs';
import rootRedirect from './src/lib/root-redirect.mjs';

export default defineConfig({
  site: 'https://yukio-kayaba.github.io',
  base: '/zormz-docs',
  // Redirect the local origin to the GitHub Pages base in dev and preview.
  vite: { plugins: [rootRedirect('/zormz-docs')] },
  integrations: [
    starlight({
      title: 'ZORMZ',
      expressiveCode: false,
      logo: { src: './public/favicon.svg', alt: 'ZORMZ' },
    }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [[remarkBaseLinks, { base: '/zormz-docs' }]],
    }),
    shikiConfig: { themes: { light: 'dark-plus', dark: 'dark-plus' } },
  },
});
