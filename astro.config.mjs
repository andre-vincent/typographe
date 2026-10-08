// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import rehypeSlug from "rehype-slug";
import { siteConfig } from "./src/config/site.ts";
import { codeThemes, codeDefaultColor } from "./src/config/code.ts";

import mdx from "@astrojs/mdx";

// Importation sécurisée du plugin
import { rehypeFrenchTypography } from "./src/plugins/rehype-french-typo.js";

const shikiConfig = /** @type {const} */ ({
  themes: codeThemes,
  defaultColor: codeDefaultColor,
});

export default defineConfig({
  site: siteConfig.siteUrl,
  integrations: [
    sitemap({
      filter: (page) => page !== new URL("/search/", siteConfig.siteUrl).toString(),
    }),
    mdx(),
  ],
  markdown: {
    processor: unified({
      rehypePlugins: [
        rehypeSlug,
        rehypeFrenchTypography // Placé à la fin pour nettoyer l'HTML généré
      ],
    }),
    shikiConfig,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
