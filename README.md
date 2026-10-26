# TYPOGRAPHE

## Un thème Astro minimaliste pour Blog axé sur la typographie soignée en français

[![Monograph theme preview](/preview.webp)](https://monograph.xocoweb.workers.dev/)

[![Astro 7](https://img.shields.io/badge/Astro-7-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Configured-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-84cc16?style=for-the-badge)](./LICENSE)

**Aperçu en direct :** [https://typographe.pages.dev](https://typographe.pages.dev)/

TYPOGRAPHE est la version francisée de Monograph qui est un thème Astro pour les essais, les notes et l'écriture longue. Ce thème (modèle ou gabarit) privilégie d'abord le texte et par conséquent une typographie française soignée. 

Le thème est monochrome avec un seul accent de couleur bleu pour les liens. 

Les métadonnées (auteur, dates, sujets, temps de lecture) s’affichent discrètement aux endroits appropriés. 

Les sujets, la navigation et les valeurs par défaut du référencement proviennent d’un petit ensemble de fichiers de configuration, le contenu est valide en Markdown ou MDX avec des pages récapitulatives ou archives avec des collections de contenu Astro, et le rendu des pages est statique et rapide : code sémantique et accessible (AA), contenu découvrable (SEO) et répondant à toutes les bonnes pratiques.

## Caractéristiques

- Text-first front page: a large latest post, a whitespace-separated feed with no thumbnails, and a sticky sidebar holding the about blurb, a subscribe form, featured posts, and categories with post counts
- Article pages with a single 720px reading column, a byline that reads "By author in category", a share row above the feature image, copy-link, previous/next navigation, and related posts
- Categories as the only taxonomy: one short configured list, a `/categories/` index with descriptions and counts, and a generated archive per category
- Author, archive, search, about, contact, privacy, and 404 pages, plus RSS, sitemap, and `robots.txt`
- Built-in client-side search with a keyboard-friendly command palette and a dedicated results page — no search service and no database, and nothing listed until the first keystroke
- System-aware light and dark modes behind a header toggle switch, applied before first paint with the reader's choice remembered
- Read time calculated from the post body at build time, so nothing to maintain by hand
- Markdown and MDX content powered by Astro content collections, with dual light/dark syntax-highlighted code blocks (plus a copy button), styled lists, and blockquotes
- Reusable MDX content components — `Callout` (note/tip/warning/danger) and tabbed `CodeGroup` code samples — available in any post with no imports
- Frontmatter validation for titles, excerpts, categories, dates, authors, covers, featured, and drafts
- Sticky header that hides while scrolling down and slides back in on the way up
- Restrained hover motion on one easing curve: titles pick up the accent, inline links wipe an underline in, arrows lean toward their destination, and icon buttons lift
- Optional feature images, capped in height and shown on the post only, never in a feed
- Central site, navigation, category, social, and SEO defaults
- Canonical URLs, sitemap generation, RSS, Open Graph, Twitter/X cards, and JSON-LD
- Accessible skip link, landmarks, labels, a `role="switch"` theme toggle, keyboard-friendly controls, visible focus states, and reduced-motion support
- Provider-neutral newsletter and contact forms that run as working demos until an endpoint is configured
- Tailwind CSS 4 tokens in cascade layers, with no external font requests by default

## Caractéristiques (première traduction par IA… pas très réussi - à revoir…)
- Première page d'accueil du texte : un grand dernier message, un flux séparé par des espaces blancs sans vignettes, et une barre latérale collante contenant le texte à propos, un formulaire d'abonnement, des messages en vedette et des catégories avec le nombre de messages

- Pages d'articles avec une seule colonne de lecture de 720px, une ligne indiquant "Par auteur dans la catégorie", une ligne de partage au-dessus de l'image de la fonctionnalité, un lien de copie, une navigation précédente/suivante et des messages connexes

- Les catégories comme seule taxonomie : une courte liste configurée, un index `/catégories/` avec descriptions et comptages, et une archive générée par catégorie

- Auteur, archive, recherche, à propos, contact, confidentialité et 404 pages, plus RSS, plan du site et `robots.txt`

- Recherche côté client intégrée avec une palette de commandes adaptée au clavier et une page de résultats dédiée - pas de service de recherche et pas de base de données, et rien n'est répertorié jusqu'à la première frappe

- Modes lumineux et sombres conscients du système derrière un interrupteur à bascule d'en-tête, appliqués avant la première peinture avec le choix du lecteur mémorisé

- Temps de lecture calculé à partir du corps du poteau au moment de la construction, donc rien à maintenir à la main

- Contenu Markdown et MDX alimenté par les collections de contenu Astro, avec deux blocs de code en surbrillage syntaxe clair/sombre (plus un bouton de copie), des listes de style et des guillemets de bloc

- Composants de contenu MDX réutilisables - `Callout` (note/astuce/avertissement/danger) et exemples de code `CodeGroup` à onglets - disponibles dans n'importe quel message sans importations

- Validation de la matière première pour les titres, les extraits, les catégories, les dates, les auteurs, les couvertures, les vedettes et les brouillons

- En-tête collant qui se cache lors du défilement vers le bas et glisse vers le haut

- Mouvement de survol retenu sur une courbe d'assouplissement : les titres captent l'accent, les liens en ligne essuient un soulignement, les flèches se penchent vers leur destination et les boutons d'icône se soulèvent

- Images de fonctionnalités facultatives, plafonnées en hauteur et affichées sur le message uniquement, jamais dans un flux

- Site central, navigation, catégorie, réseaux sociaux et paramètres par défaut du référencement

- URL canoniques, génération de sitemap, RSS, Open Graph, cartes Twitter/X et JSON-LD

- Lien de saut accessible, points de repère, étiquettes, bascule de thème `role="switch"`, commandes compatibles avec le clavier, états de mise au point visibles et prise en charge des mouvements réduits

- Bulletin d'information et formulaires de contact neutres vis-à-vis du fournisseur qui s'exécutent comme des démonstrations de travail jusqu'à ce qu'un point de terminaison soit configuré

- Jetons Tailwind CSS 4 en couches en cascade, sans demande de police externe par défaut

## Tech Stack

- Astro 7
- Tailwind CSS 4 via le plugin Vite
- TypeScript
- Astro content collections
- `@astrojs/sitemap`, `@astrojs/mdx`, `rehype-slug`
- Sharp for image processing

## Requirements

- Node.js `22.12.0` or newer
- npm

## Getting Started

```bash
npm install
npm run dev
```

Build for production and preview the output:

```bash
npm run build
npm run preview
```

Before deploying, set `siteUrl` in [src/config/site.ts](./src/config/site.ts) — canonical URLs, RSS,
sitemap, social images, and JSON-LD all derive from it.

## Content

Posts live in [src/content/posts](./src/content/posts). Each post is a folder containing an
`index.md` or `index.mdx` and, optionally, a `cover.jpg`:

```yaml
---
title: "Design Tokens That Survive Product Growth"
excerpt: "Tokens work when they describe decisions."
category: "Design Systems" # must match src/config/categories.ts
date: 2026-07-05
updatedDate: 2026-07-11 # optional
author:
  name: "Leah Morgan"
  role: "Design systems and craft"
cover: # optional; shown on the post, never in the feed
  src: "./cover.jpg"
  alt: "Soft gradient mesh"
  creditName: "Credits to Codioful via Unsplash"
  creditUrl: "https://unsplash.com/photos/..."
featured: false # true lists it in the home sidebar
draft: false
---
```

Read time is calculated from the body at build time. The schema in
[src/content.config.ts](./src/content.config.ts) is enforced, so a typo fails the build rather than
shipping a broken page, and `category` must match an entry in
[src/config/categories.ts](./src/config/categories.ts).

Authors come from frontmatter too: posts sharing a `name` are grouped into an author archive
automatically.

## Routes

| Route                                                           | Page                           |
| --------------------------------------------------------------- | ------------------------------ |
| `/`                                                             | Article récents et barre latérale |
| `/posts/[page]`                                                 | Archive paginée                |
| `/post/<slug>/`                                                 | Article                        |
| `/categories/`                                                  | Index des sujets avec compteur |
| `/category/<slug>/`                                             | Articles par sujet             |
| `/author/`, `/author/<name>/`                                   | Index des auteurs et archive   |
| `/search/`                                                      | Page de recherche (`?q=...`)   |
| `/about/`, `/contact/`, `/privacy/`                             | Pages statiques                |
| `/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/search-index.json` | Flux RSS et SEO                |

## Personnalisation

Voir [PERSONNALISATION.md](./PERSONNALISATION.md) Pour les paramètres du site, la navigation, les catégories, les auteurs, le bulletin d'information et les formulaires de contact, la recherche, le mode de lecture, le mouvement, les jetons de thème, les polices et les icônes.
## Support

Le modèle (thème) TYPOGRAPHE est gratuit et fourni en l’état. Les rapports de bogues et les questions sont les bienvenus en tant que problèmes ([issues](https://github.com/andre-vincent/typographe/issues)) GitHub. Le service après don, la conception personnalisée et le travail sur des fonctionnalités ne sont pas inclus.

## License

MIT - gratuit pour les projets personnels et commerciaux. Voir [LICENSE](. /LICENSE), qui répertorie également les licences des polices, des icônes et des images de démonstration groupées.

## Modifications apportées à Monograph ou à faire
- [x] Franciser l’interface et les menu de navigation.
- [x] Franciser les pages statiques.
- [ ] Franciser le README. (à compléter)
- [ ] Franciser les items du Frontend. (title, excerpt, etc.)
- [ ] Franciser les routes des URLs publics. (/about, /post, etc.) 
- [x] Adapter les favicons (.svg et .ico) de M à Ty.
- [x] Intégrer le script de correction typographique. (/src/plugins/
- [x] Optimiser les polices pour le français.
- [x] Configurer pour l’édition via Pages CMS. (éditeur Markdown visuel)
- [ ] Ajouter la gestion des media dans la configuration Pages CMS. 
- [ ] Meilleure gestion des auteurs/autrices : optionnel et multi-auteurs/autrices
- [ ] Créer un composant ou items optionnels du Frontmatter pour les notes de lecture. (auteur, éditeur, nombre de pages, année de publication, ISBN, image couverture, etc.)


## Logo
![Logo du site](logo.svg)


