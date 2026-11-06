---
title: "Guide des abréviations et de la datation en typographie journalistique"
description: "Maîtriser les abréviations, exposants et règles de datation pour la rédaction de contenu en français sous le framework Astro."
pubDate: 2026-11-06
author: "Rédaction"
tags: ["typographie", "journalisme", "astro", "markdown"]
draft: false
---

En écriture journalistique et typographie française, les formes réduites des mots suivent des règles strictes. Ce guide récapitule les abréviations courantes, la gestion de la datation et leur implémentation technique dans le générateur de site statique (SSG) Astro.

## 1. Les abréviations civiles et professionnelles

### Titres civils et civilités
L'utilisation des exposants (lettres supérieures) est la norme rigoureuse en presse écrite :
* **M.** : Monsieur (pluriel : **MM.**) — *Attention : « Mr » est un anglicisme à bannir.*
* **M<sup>me</sup>** : Madame (pluriel : **M<sup>me</sup>s**)
* **M<sup>lle</sup>** : Mademoiselle (pluriel : **M<sup>lle</sup>s**)
* **Mgr** : Monseigneur

### Titres professionnels et honorifiques
* **M<sup>e</sup>** : Maître (avocats, notaires, huissiers ; pluriel : **M<sup>e</sup>s**)
* **Dr** : Docteur (le pluriel est **Drs**) — *Pas d'exposant.*
* **Pr** : Professeur (le pluriel est **Prs**) — *Pas d'exposant.*
* **PDG** : Président-directeur général

### La règle typographique du point final
* **Pas de point final** si l'abréviation se termine par la dernière lettre du mot complet (ex: `M<sup>me</sup>` pour Mada**me**, `Dr` pour Docte**ur**).
* **Point final obligatoire** si l'abréviation est coupée avant la fin (ex: `M.` pour **M**onsieur).

---

## 2. Règles de datation et de chronologie

### Siècles et millénaires
Les siècles s'écrivent obligatoirement en **chiffres romains majuscules** suivis d'un exposant :
* **XXI<sup>e</sup> siècle** (et non `21ème` ou `XXIème`).
* **I<sup>er</sup> siècle** (et non `Ier`).

### L'écriture des dates
* **Le 1<sup>er</sup> novembre** : Le premier jour du mois prend toujours l'exposant **<sup>er</sup>**.
* **Le 2 novembre** : Tous les autres jours s'écrivent simplement en chiffres arabes (sans `e` ni `ème`).
* **Les décennies** : On écrit **les années 1990** ou **les années 90** (sans « s » final).

### Les heures et durées
* **14&nbsp;h&nbsp;30** : L'abréviation de l'heure est un **h** minuscule, impérativement entouré d'espaces.
* **14&nbsp;h** : Si l'heure est pile, on n'ajoute pas de zéros.

---

## 3. Implémentation technique pour Astro (Markdown / MDX)

### Gestion des exposants
Pour garantir une compatibilité totale sans dépendances dans vos fichiers `.md` ou `.mdx`, utilisez les balises HTML `<sup>` :
```markdown
Le XXI<sup>e</sup> siècle a commencé le 1<sup>er</sup> janvier 2001.
```

### Éviter les retours à la ligne brisés
En typographie, il est incorrect de séparer un nombre de son unité (ex: avoir `14` en fin de ligne et `h` au début de la suivante). Utilisez l'entité d'espace insécable `&nbsp;` :

```markdown
La réunion commence à 14&nbsp;h&nbsp;30 précises.
```

### Tableau de correspondance Express pour Astro

| Résultat visuel | Code Markdown à insérer |
| :--- | :--- |
| **XXI<sup>e</sup>** | `XXI<sup>e</sup>` |
| **1<sup>er</sup>** | `1<sup>er</sup>` |
| **M<sup>me</sup>** | `M<sup>me</sup>` |
| **M<sup>e</sup>** | `M<sup>e</sup>` |
| **14&nbsp;h&nbsp;30** | `14&nbsp;h&nbsp;30` |
| **n<sup>o</sup>** | `n<sup>o</sup>` |