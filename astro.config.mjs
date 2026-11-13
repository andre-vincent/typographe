// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
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
    // 💡 OPTIMISATION MDX : On lui force à hériter des plugins Remark/Rehype globaux
    // et à appliquer les règles typographiques avant l'analyse JSX.
    mdx({
      extendMarkdownConfig: true,
    }),
  ],
  markdown: {
    // Désactive les guillemets/tirets anglais par défaut d'Astro au profit de votre plugin français
    smartypants: false,
    // Exécuté en premier pour traiter le texte brut avant les autres transformations
    remarkPlugins: [
      remarkFrenchTypography
    ],
    rehypePlugins: [
      rehypeSlug
    ],
    shikiConfig,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
