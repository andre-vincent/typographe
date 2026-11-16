---
title: Objectifs du projet Typographe
excerpt: Les critères d’un site web entièrement gratuit, écoresponsable, pérenne, sémantique, accessible, optimisé pour l’écriture en français et bénéficiant d’un correcteur ortho-typographique pour une écriture soignée selon les règles et les bonnes pratiques de la typographie francophone.
category: Design Web
date: 2026-11-16
updatedDate: 2026-11-16
author:
  name: André Vincent
  role: Édimestre de ce site. Typographe, enseignant et militant syndical et
    politique
featured: true
draft: false
---
---
title: "Objectifs du projet Typographe"
excerpt: "Manifeste technique et éditorial pour un site web libre, sobre, pérenne, accessible (WCAG AA) et rigoureusement conforme aux règles ortho-typographiques du français."
category: "Design Web"
date: 2026-11-16
updatedDate: 2026-11-16
author:
  name: "André Vincent"
  role: "Édimestre de ce site. Typographe, enseignant et militant syndical et politique"
featured: false
draft: true
---

Le projet **Typographe** est né d’un constat simple : le Web contemporain privilégie trop souvent la lourdeur technique et l’agitation visuelle au détriment du texte, du confort de lecture et de la maîtrise éditoriale. Construit avec le cadre applicatif **Astro**, hébergé gratuitement sur **GitHub** et déployé sur **Cloudflare Pages**, ce modèle offre « un endroit calme pour l’écriture longue et soignée en français ».

Il repose sur la convergence entre deux disciplines indissociables : la **micro-typographie francophone** et le **design web responsable**.

## 1. Une micro-typographie française sans compromis

Sur le Web francophone, la typographie est fréquemment négligée par les outils de publication standards. Typographe réhabilite le savoir-faire des ateliers d’imprimerie en automatisant et en systématisant les règles ortho-typographiques dès la rédaction :

* **La défense de l’espace fine insécable (`U+202F`) :** Contrairement à l’espace forte (`&nbsp;`) trop large ou à l’absence totale d’espace héritée des usages anglo-saxons, l’espace fine insécable garantit l’équilibre visuel avant les ponctuations hautes (`;`, `:`, `!`, `?`), les unités de mesure et les nombres. Elle constitue un impératif à la fois esthétique, sémantique et de lisibilité.
* **La rigueur des signes et des abréviations :** Le système veille à l’usage systématique des guillemets français (« ») accompagnés de leurs espaces intérieures, des apostrophes courbes (’), des tirets cadratins ou demi-cadratins pour les incises, ainsi que des exposants appropriés pour les abréviations courantes et la datation.
* **Une hiérarchie dédiée à l’écriture longue :** Le choix des polices, la justification ou l’alignement, la longueur optimale des lignes (la *justification* au sens typographique) et l’interlignage sont calibrés pour soutenir l’attention sur des essais de fond, sans fatigue oculaire.

## 2. Un design web sobre, sémantique et accessible

La forme visuelle ne sert pas à décorer, mais à structurer la pensée. L’architecture de Typographe applique les principes de l’écoconception et du web ouvert :

* **Le texte d’abord et l’absence de bruit :** L’interface élimine les pistolets publicitaires, les fenêtres surgissantes et les scripts superflus. La navigation reste épurée (clavier, raccourci de recherche rapide `Ctrl K`, flux RSS natif) pour laisser toute la place au propos.
* **Accessibilité et conformité WCAG AA :** Le respect des contrastes, la hiérarchie stricte des titres HTML (`<h1>` à `<h6>`), la navigation au clavier et la compatibilité avec les lecteurs d’écran garantissent un accès universel aux contenus. L’usage correct des caractères Unicode insécables évite notamment que les synthèses vocales ne fragmentent la lecture des nombres ou de la ponctuation.
* **Performance et sobriété numérique :** Grâce à la génération de sites statiques (SSG) d’Astro, les pages envoyées au navigateur ne contiennent que du HTML et du CSS minimalistes, réduisant drastiquement l’empreinte carbone et assurant un affichage instantané, même sur des connexions modestes.

## 3. Pérennité, autonomie et édition libre

Inspiré par l’histoire de l’imprimerie militante et du web indépendant, le projet refuse l’enfermement propriétaire (*vendor lock-in*) :

* **La pérennité du format Markdown :** Tous les articles sont rédigés en texte brut enrichi (Markdown) avec un en-tête structuré (*frontmatter* YAML). Vos écrits restent lisibles, transportables et archivés localement, indépendamment de toute base de données ou plateforme commerciale.
* **Un flux de travail ouvert et mobile :** Le code source ouvert sous licence libre (CC-SA) permet à chacun de dupliquer le modèle et de le personnaliser. Grâce à l’intégration continue entre GitHub et Cloudflare Pages, la publication peut s’effectuer aussi bien depuis un ordinateur de bureau que depuis une tablette (comme un iPad) par simple validation de fichier.

[^1]: À compléter. Voir la [description du projet](https://github.com/andre-vincent/typographe/) 
