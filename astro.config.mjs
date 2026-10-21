import { defineConfig } from 'astro/config';
export default defineConfig({
  markdown: {
    shikiConfig: { themes: { light: 'dark-plus', dark: 'dark-plus' } },
  },
});
