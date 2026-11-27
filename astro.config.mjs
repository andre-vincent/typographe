// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import rehypeSlug from "rehype-slug";

import { siteConfig } from "./src/config/site.ts";
import { codeThemes, codeDefaultColor } from "./src/config/code.ts";

// Importation de votre plugin Remark
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
    // Hérite automatiquement de la configuration du processeur Markdown ci-dessous
    mdx({
      extendMarkdownConfig: true,
    }),
  ],
  markdown: {
    processor: unified({
      // Désactive les guillemets/tirets anglais par défaut d'Astro au profit de votre plugin français
      smartypants: false,
      // Exécuté en premier pour traiter le texte brut avant les autres transformations
      remarkPlugins: [remarkFrenchTypography],
      rehypePlugins: [rehypeSlug],
    }),
    shikiConfig,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
