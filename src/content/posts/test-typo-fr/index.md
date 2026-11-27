---
title: "Page de « test » de la typographie française"
excerpt: "Validation des espaces insécables ? Nombres, dates, unités de mesure, abbéviations, etc. !"
category: "Typographie"
date: 2026-10-23
author:
  name: "André Vincent"
  role: "Webmestre de ce site. Typographe, enseignant et syndicaliste."
featured: true
---

Cette page valide l'application automatique des normes typographiques françaises sur notre site Astro.

## 1. L'apostrophe courbe et les points de suspension

### Pourquoi ?
L'apostrophe droite (`'`) est un héritage des machines à écrire. En typographie française fine, l'apostrophe courbe (`’`) et l'ellipse unique (`…`) assurent l'harmonie du texte.

**Exemple brut :**
```text
C'est l'arbre de l'étudiant qui grandit aujourd'hui...
```

**Exemple corrigé :**
<div class="typo-demo">

C'est l'arbre de l'étudiant qui grandit aujourd'hui...

</div>

---

## 2. La ponctuation double et le raccordement inline

### Pourquoi ?
Les signes `;`, `!` et `?` requièrent une espace fine insécable (`\u202F`). Le deux-points (`:`) exige une espace insécable normale (`\u00A0`), y compris après un élément formaté.

**Exemple brut :**
```text
Incroyable! Est-ce vrai? Regardez ceci: un point-virgule; et **Pourquoi** ?
```

**Exemple corrigé :**
<div class="typo-demo">

Incroyable! Est-ce vrai? Regardez ceci: un point-virgule; et **Pourquoi** ?

</div>

---

## 3. Les guillemets français

### Pourquoi ?
La typographie française emploie les chevrons (`« »`) accompagnés d'espaces fines insécables intérieures plutôt que les guillemets droits (`" "`), tout en préservant les guillemets courbes (`“ ”`) au second rang.

**Exemple brut :**
```text
Il a dit : "Le projet est validé, même avec “cette nuance” importante" au directeur.
```

**Exemple corrigé :**
<div class="typo-demo">

Il a dit : "Le projet est validé, même avec “cette nuance” importante" au directeur.

</div>

---

## 4. Devises, pourcentages et heures

### Pourquoi ?
Les symboles monétaires, les pourcentages et les notations horaires (règle stricte de l'Imprimerie nationale : `14 h 30` → `14 h30`) restent solidaires du nombre qui les précède.

**Exemple brut :**
```text
Le taux est de 5,5 % pour 1500 €, 250 $ ou 180 £, à 9 h et 14 h 30.
```

**Exemple corrigé :**
<div class="typo-demo">

Le taux est de 5,5 % pour 1500 €, 250 \$ ou 180 £, à 9 h et 14 h 30.

</div>

---

## 5. Unités de mesure (SI)

### Pourquoi ?
Les unités physiques forment un bloc indissociable avec la valeur numérique grâce à l'espace fine insécable (`\u202F`).

**Exemple brut :**
```text
Une distance de 15 km à 22 °C, une surface de 80 m², un fichier de 25 Mo ou 4 Go en 45 min.
```

**Exemple corrigé :**
<div class="typo-demo">

Une distance de 15 km à 22 °C, une surface de 80 m², un fichier de 25 Mo ou 4 Go en 45 min.

</div>

---

## 6. Tirets cadratins (dialogues et incises)

### Pourquoi ?
En typographie française, les dialogues s'ouvrent par un tiret cadratin (`—`) suivi d'une espace insécable, et les incises sont encadrées par des tirets cadratins liés au texte intérieur.

**Exemple brut :**
```text
- Bonjour, dit-il.
-- Comment allez-vous ?
L'informatique - discipline exigeante -- demande de la rigueur.
```

**Exemple corrigé :**
<div class="typo-demo">

- Bonjour, dit-il.
-- Comment allez-vous ?
L'informatique - discipline exigeante -- demande de la rigueur.

</div>

---

## 7. Grands nombres et tableaux

### Pourquoi ?
Les nombres se découpent par tranches de trois chiffres dès **5 chiffres** dans le texte courant (préservant les années à 4 chiffres comme `1872`), mais dès **4 chiffres** dans les cellules de tableau (`<td>`).

**Exemple brut :**
```text
En 1872, on comptait 2500 étudiants et 12500 livres.
```

**Exemple corrigé :**
<div class="typo-demo">

En 1872, on comptait 2500 étudiants et 12500 livres.

| Donnée brute | Rendu corrigé |
| :--- | :--- |
| `8500,21` | 8500,21 |
| `142000,75` | 142000,75 |

</div>

---

## 8. Dates, civilités et références éditoriales

### Pourquoi ?
Une espace insécable forte (`\u00A0`) empêche la séparation en fin de ligne des quantièmes de mois, des titres de civilité et des numéros de chapitres ou de pages.

**Exemple brut :**
```text
Le 1er octobre 1870, M. Lépine et Mme Francq ont consulté le chapitre 4, page 45 et n° 145.
```

**Exemple corrigé :**
<div class="typo-demo">

Le 1er octobre 1870, M. Lépine et Mme Francq ont consulté le chapitre 4, page 45 et n° 145.

</div>

---

## 9. Petites capitales et exposants (automatiques et manuels)

### Pourquoi ?
Les sigles (2 majuscules ou plus) et les chiffres romains se composent en petites capitales (`<span class="petite-capitale">`), tandis que les ordinaux se placent en exposant (`<sup>`). L'article « Le » est préservé.

**Exemple brut :**
```text
La FTQ, la CSN et l'ONU 1er au XIXe siècle, sous la Ve République du 1^er^ mai au 1er juin (Le Monde ouvrier).
```

**Exemple corrigé :**
<div class="typo-demo">

La FTQ, la CSN et l'ONU 1er au XIXe siècle, sous la Ve République du 1^er^ mai au 1er juin (Le Monde ouvrier).

</div>

---

## 10. Exclusions automatiques (URLs, courriels et code)

### Pourquoi ?
Les liens hypertextes, adresses courriel, code en ligne et blocs de code ne doivent jamais être altérés par les règles typographiques.

**Exemple vérifié :**
<div class="typo-demo">

Lien intact : https://pages.dev — Courriel : contact@typographe.pages.dev — Code : `"Bonjour : ?!"`

</div>

<style is:global>
  .petite-capitale {
    font-variant-caps: all-small-caps;
    letter-spacing: 0.04em;
  }

  sup {
    line-height: 0;
    font-size: 0.75em;
  }

  .typo-demo {
    padding: 1rem 1.25rem;
    margin: 0.75rem 0 1.5rem;
    border-left: 3px solid currentColor;
    background-color: color-mix(in srgb, currentColor 5%, transparent);
    border-radius: 0 0.375rem 0.375rem 0;
  }

  .typo-demo > :first-child {
    margin-top: 0;
  }

  .typo-demo > :last-child {
    margin-bottom: 0;
  }
</style>




<style>
/* Cible votre tableau dans le corps de l'article */
.prose table {
  width: 100%;
  border-collapse: collapse;
}

/* 1. Alignement et activation des chiffres tabulaires */
.prose th,
.prose td {
  text-align: right;
  /* Active les chiffres à largeur fixe (Tabular Lined Numbers) */
  font-variant-numeric: tabular-nums;
  -moz-font-feature-settings: "tnum";
  -webkit-font-feature-settings: "tnum";
  font-feature-settings: "tnum";
}

/* 2. Force la première colonne (texte) à gauche et désactive les chiffres tabulaires */
.prose th:first-child,
.prose td:first-child {
  text-align: left;
  font-variant-numeric: normal;
  font-feature-settings: normal;
}
</style>
