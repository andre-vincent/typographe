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

Ce fichier permet de valider visuellement si le plugin applique correctement les règles de l'*Imprimerie nationale* et du *Ramat de la typographie* sur Cloudflare Pages.

## 1. Ponctuation double, guillemets et apostrophes
* Est-ce que le système fonctionne comme prévu ? (Attendu : espace fine insécable `\u202F` devant ?)
* C'est incroyable ! (Attendu : espace fine insécable `\u202F` devant !)
* Chapitre 1 : la règle s'applique après un chiffre. (Attendu : espace forte insécable `\u00A0` devant :)
* Il dit : "Le projet Astro est génial". (Attendu : «\u202FLe projet Astro est génial\u202F»)
* Il dit : "Le projet **Astro** est *vraiment* génial". (Attendu : guillemets français conservés malgré le gras/italique imbriqué)
* C'est l'arbre de l'**étudiant** d'aujourd'hui. (Attendu : apostrophes courbes ’ y compris avant `**étudiant**`)
* Une fin de phrase avec des points de suspension... (Attendu : … en un seul caractère)

## 2. Tirets d'incise, civilités, dates et siècles
* — Bonjour, dit-il en entrant. (Attendu : tiret cadratin suivi d'une espace forte insécable `\u00A0`)
* Cette règle — à mon **humble** avis — est indispensable. (Attendu : espaces insécables `\u00A0` à l'intérieur des tirets malgré le gras)
* Veuillez contacter M. Dupont, Mme Martin ou le Dr Lefèvre. (Attendu : espace forte insécable `\u00A0` après M., Mme, Dr)
* La prise de la Bastille eut lieu le 14 juillet 1789 et la fête du travail le 1er mai. (Attendu : `14\u00A0juillet` et `1er\u00A0mai`)
* Au XXe siècle, le chapitre 4 et le tome II font référence. (Attendu : `XXe\u00A0siècle`, `chapitre\u00A04`, `tome\u00A0II`)
* Lien brut à protéger : https://exemple.fr (Attendu : aucune espace insécable devant `?`)

## 3. Unités de mesure, devises et pourcentages
* Le taux de réussite est de 85% ou de 12 %. (Attendu : espace fine insécable `\u202F` devant %)
* Le livre coûte 45€ (ou 45 €), soit environ 50\$. (Attendu : espace forte insécable `\u00A0` devant € et \$)
* L'appartement fait 75m² et la pièce est chauffée à 21°C. (Attendu : espace fine insécable `\u202F` devant m² et °C)
* Le rendez-vous est fixé à 14h30 précises, ou à 18h. (Attendu : espaces fines insécables autour du h : `14\u202Fh\u202F30` et `18\u202Fh`)

| Catégorie | Écriture Markdown (Avant) | Rendu Attendu (Après) | Espace insécable |
| :--- | :--- | :--- | :--- |
| **Pourcentages** | `100%` ou `100 %` | 100 % | Fine (`\u202F`) |
| **Distances & Surfaces** | `12km`, `5m`, `45cm`, `8mm` | 12 km, 5 m, 45 cm, 8 mm | Fine (`\u202F`) |
| | `75m²` ou `2m³` | 75 m² ou 2 m³ | Fine (`\u202F`) |
| **Poids & Volume** | `2t`, `50kg`, `350g`, `500mg`, `1L` | 2 t, 50 kg, 350 g, 500 mg, 1 L | Fine (`\u202F`) |
| **Physique & Élec.** | `21°C`, `60Hz`, `90dB`, `230V`, `4kW` | 21 °C, 60 Hz, 90 dB, 230 V, 4 kW | Fine (`\u202F`) |
| **Stockage** | `4Go`, `700Mo`, `1To`, `512B`, `20octets` | 4 Go, 700 Mo, 1 To, 512 B, 20 octets | Fine (`\u202F`) |
| **Devises** | `45€`, `100$`, `10£`, `5000¥` | 45 €, 100 $, 10 £, 5000 ¥ | Forte (`\u00A0`) |
| **Horaires & Durées** | `14h30`, `20h`, `5min`, `30s` | 14 h 30, 20 h, 5 min, 30 s | Fine (`\u202F`) |

## 4. Grands nombres et décimales (Hors tableau vs Dans tableau)
* La population est de 9999 habitants en 2026. (Attendu : RESTE COMPACT à 4 chiffres hors tableau)
* Le budget s'élève à 12500 € pour 1450250 clics et π ≈ 3,14159. (Attendu : `12\u202F500`, `1\u202F450\u202F250`, mais `3,14159` intact)

| Produit | Quantité (Seuil > 9999) | Prix |
| :--- | :--- | :--- |
| Référence 135 | 950 | 10 € |
| Référence 259 | 1250 | 1200 € |
| Référence 371 | 15400 | 14500 € |

## 5. Zones d'exclusion strictes (Ne doivent PAS être modifiées)

```javascript
// Bloc de code : guillemets, apostrophes et modulo (%) doivent rester bruts
const message = "Hello World!";
let ratio = 100 % 3;
```

Un texte contenant du code en ligne `let total = 45;` ou une commande `npm run astro -- --help`.

<p class="no-typo">Ce paragraphe porte la classe no-typo : l'apostrophe droite ('), le point ! et le nombre 12500 doivent rester bruts.</p>

<p lang="en">Is this working properly? "Yes", it is! It costs 50\$ and 100% of features are on.</p>

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
