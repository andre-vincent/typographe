// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import rehypeSlug from "rehype-slug";
import mdx from "@astrojs/mdx";

import { siteConfig } from "./src/config/site.ts";
import { codeThemes, codeDefaultColor } from "./src/config/code.ts";

// Importation de votre nouveau plugin Remark converti
import { remarkFrenchTypography } from "./src/plugins/remark-french-typo.js";

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
    // L'intégration MDX va automatiquement lire et appliquer remarkPlugins ci-dessous
    mdx(),
  ],
  markdown: {
    processor: unified({
      // Déclarez le plugin Remark ici pour respecter la dépréciation d'Astro
      remarkPlugins: [
        remarkFrenchTypography
      ],
      rehypePlugins: [
        rehypeSlug
      ],
    }),
    shikiConfig,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
