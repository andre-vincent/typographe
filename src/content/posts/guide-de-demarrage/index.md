---
title: "Guide de démarrage : Configurer et personnaliser votre template Astro
  Typographe"
excerpt: Vous venez de dupliquer ce template ? Voici les étapes simples pour
  modifier les fichiers clés, adapter le design et configurer le build
  automatisé depuis votre iPad ou votre ordinateur.
category: Design Web
date: 2026-11-03
updatedDate: 2026-11-14
author:
  name: André Vincent
  role: Typographe, enseignant, syndicaliste
featured: false
draft: false
---
Félicitations ! En cliquant sur le bouton **"Use this template"**, vous venez de créer votre propre instance de ce thème axé sur l'excellence typographique et la légèreté. 

Ce guide vous explique exactement quels fichiers ouvrir et modifier pour vous approprier le site, que vous travailliez sur un ordinateur ou directement depuis un **iPad** via l'interface web de GitHub.

---

## 1. L'identité du site : `src/data/site.json` (ou votre fichier de configuration)

Pour changer le nom du site, la description pour le SEO et vos liens de réseaux sociaux, vous n'avez pas besoin de toucher au code HTML. Tout est centralisé.

- **Fichier à modifier :** `src/data/siteConfig.ts` (ou `site.json` selon votre structure actuelle)
- **Ce qu'il faut changer :**
  - `title` : Le nom de votre blog ou site.
  - `description` : La phrase d'accroche pour les moteurs de recherche.
  - `author` : Votre nom ou votre pseudonyme.

---

## 2. Vos propres polices de caractères

C'est le cœur de ce template : l'optimisation automatique des polices (Subsetting) pour un chargement instantané.

- **Dossier source :** `src/fonts/src/`
- **Ce qu'il faut faire :**
  1. Supprimez les fichiers `.ttf` ou `.otf` existants dont vous n'avez pas besoin.
  2. Glissez-déposez vos propres fichiers de polices au format **TTF** ou **OTF** dans ce dossier.
  3. Si vous utilisez GitHub Actions, le script Python va automatiquement compresser ces polices au format ultra-léger `.woff2` et les placer dans `/public/fonts/`.

> 💡 **Rappel CSS :** N'oubliez pas de mettre à jour vos règles `@font-face` dans votre fichier de style global (`src/styles/global.css`) pour pointer vers les nouveaux noms de fichiers dans `/public/fonts/` (sans ajouter de `?v2` à la fin de l'URL !).

---

## 3. Personnaliser le style et les couleurs : `src/styles/`

Le template utilise des variables CSS modernes pour basculer facilement de thème ou modifier les espacements de manière globale.

- **Fichier à modifier :** `src/styles/global.css` (ou `variables.css`)
- **Ce qu'il faut changer :**
  - Les variables de couleurs `--color-bg` (fond) et `--color-text` (texte).
  - Les variables typographiques `--font-serif` et `--font-sans` pour y inscrire le nom de vos polices définies à l'étape précédente.

---

## 4. Gérer les auteurs et les catégories

Le template classe automatiquement vos écrits par auteur et par thématique.

- **Pour les auteurs :** Modifiez ou ajoutez des profils dans `src/content/authors/`. Chaque auteur a son propre fichier Markdown avec sa biographie et sa photo.
- **Pour les articles :** Créez simplement un nouveau fichier `.md` dans `src/content/blog/` en copiant le modèle de Frontmatter présent en haut de cet article.

---

## 5. Le déploiement en 1 clic (Cloudflare / Netlify / Vercel)

Le template a été conçu pour être **100 % portable**. Vous n'avez aucun paramètre complexe à configurer chez votre hébergeur.

Lors de la création de votre projet sur **Cloudflare Pages** :

1. Liez votre nouveau dépôt GitHub.
2. Sélectionnez le framework preset : **Astro**.
3. Laissez les commandes par défaut (`npm run build` et dossier de sortie `dist`).

Le fichier `package.json` exécutera automatiquement la vérification de vos polices avant de compiler le site de manière ultra-rapide.

---

Vous êtes maintenant prêt à publier. Bon build !