import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { unified } from "@astrojs/markdown-remark";
import remarkBaseLinks from "./src/lib/remark-base-links.mjs";
import rootRedirect from "./src/lib/root-redirect.mjs";

const BASE = "/zormz---docs";

export default defineConfig({
  site: "https://yukio-kayaba.github.io",
  base: BASE,

  vite: {
    plugins: [rootRedirect(BASE)],
  },

  integrations: [
    starlight({
      title: "ZORMZ",
      expressiveCode: false,
      logo: {
        src: "./public/favicon.svg",
        alt: "ZORMZ",
      },
    }),
  ],

  markdown: {
    processor: unified({
      remarkPlugins: [[remarkBaseLinks, { base: BASE }]],
    }),
    shikiConfig: {
      themes: {
        light: "dark-plus",
        dark: "dark-plus",
      },
    },
  },
});
