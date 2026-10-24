---
title: "Page de  «test » de la typographie française"
excerpt: "Validation des espaces insécables? nombres et exclusions !"
category: "Typographie"
date: 2026-10-23
author:
  name: "André Vincent"
  role: "Webmestre de ce site. Typographe, enseignant et syndicaliste."
featured: true
---

Ce fichier permet de valider visuellement si le plugin applique correctement les règles de l'*Imprimerie nationale* et du *Ramat de la typographie* sur Cloudflare Pages.

## 1. Ponctuation double et apostrophes
* Est-ce que le système fonctionne comme prévu ? (Attendu : espace insécable fine devant ?)
* C'est incroyable ! (Attendu : espace insécable fine devant !)
* Veuillez noter ceci : la règle s'applique. (Attendu : espace insécable forte devant :)
* Il dit : "Le projet Astro est génial". (Attendu : « Le projet Astro est génial » avec espaces)
* C'est l'arbre de l'étudiant d'aujourd'hui, au cœur du bœuf. (Attendu : apostrophes courbes ’ entre deux lettres)
* Une fin de phrase avec des points de suspension... (Attendu : … en un seul caractère)

## 2. Unités de mesure, devises et pourcentages
* Le taux de réussite est de 85% ou de 12 %. (Attendu : espace fine insécable devant le %)
* Le livre coûte 45€ (ou 45 €), ce qui fait environ 50\$. (Attendu : espace insécable forte devant € et \$)
* La voiture a roulé 150km à une vitesse contenant 12kg de bagages. (Attendu : espace fine insécable devant km et kg)
* Le rendez-vous est fixé à 14h30 précises, ou à 18h. (Attendu : espaces insécables fortes autour du h : 14&nbsp;h&nbsp;30)

Voici un récapitulatif exhaustif du comportement de notre script de nettoyage typographique sur les unités de mesure, de devise, de temps et de stockage numérique.

| Catégorie | Écriture en Markdown (Avant) | Rendu Typographique Attendu (Après) | Type d'espace insécable |
| :--- | :--- | :--- | :--- |
| **Pourcentages** | `100%` ou `100 %` | 100 % | Fine (`\u202F`) |
| **Distances** | `12km` ou `12 km` | 12 km | Fine (`\u202F`) |
| | `5m` ou `5 m` | 5 m | Fine (`\u202F`) |
| | `45cm` ou `45 cm` | 45 cm | Fine (`\u202F`) |
| | `8mm` ou `8 mm` | 8 mm | Fine (`\u202F`) |
| **Poids & Masses** | `2t` ou `2 t` | 2 t | Fine (`\u202F`) |
| | `50kg` ou `50 kg` | 50 kg | Fine (`\u202F`) |
| | `350g` ou `350 g` | 350 g | Fine (`\u202F`) |
| | `500mg` ou `500 mg` | 500 mg | Fine (`\u202F`) |
| **Volume & Physique**| `1L` ou `1 L` | 1 L | Fine (`\u202F`) |
| | `60Hz` ou `60 Hz` | 60 Hz | Fine (`\u202F`) |
| | `90dB` ou `90 dB` | 90 dB | Fine (`\u202F`) |
| **Électricité** | `230V` ou `230 V` | 230 V | Fine (`\u202F`) |
| | `90W` ou `90 W` | 90 W | Fine (`\u202F`) |
| | `4kW` ou `4 kW` | 4 kW | Fine (`\u202F`) |
| **Stockage Numérique**| `4Go` ou `4 Go` | 4 Go | Fine (`\u202F`) |
| | `700Mo` ou `700 Mo` | 700 Mo | Fine (`\u202F`) |
| | `1To` ou `1 To` | 1 To | Fine (`\u202F`) |
| | `512B` ou `512 B` | 512 B | Fine (`\u202F`) |
| | `20octets` ou `20 octets`| 20 octets | Fine (`\u202F`) |
| **Devises** | `45€` ou `45 €` | 45 € | Forte (`\u00A0`) |
| | `100$` ou `100 $` | 100 $ | Forte (`\u00A0`) |
| | `10£` ou `10 £` | 10 £ | Forte (`\u00A0`) |
| | `5000¥` ou `5000 ¥` | 5000 ¥ | Forte (`\u00A0`) |
| **Horaires** | `14h30` ou `14 h 30` | 14 h 30 | Forte (`\u00A0`) |
| | `20h` ou `20 h` | 20 h | Forte (`\u00A0`) |

> **Note technique :** Qu'elles soient écrites collées au nombre ou séparées par une espace classique, ces unités informatiques et physiques sont désormais automatiquement uniformisées selon les règles de l'art de l'ortho-typographie française.


## 3. Grands nombres (Hors tableau vs Dans tableau)
* La population de la ville est de 9999 habitants. (Attendu : RESTE COMPACT - pas d'espace)
* Le budget total s'élève à 12500 € pour un objectif de 1450250 de clics. (Attendu : séparation par 3 -> 12&#8239;500 et 1&#8239;450&#8239;250)

### Test dans un tableau HTML :

| Produit | Quantité (Seuil > 999) | Prix |
| :--- | :--- | :--- |
| Référence A | 950 | 10 € |
| Référence B | 1250 | 1200 € |
| Référence C | 15400 | 14500 € |

*(Attendu dans le tableau ci-dessus : le nombre `1250` doit devenir `1&#8239;250` car il est dans un `<td>`, alors que `9999` plus haut reste inchangé).*

## 4. Zones d'exclusion strictes (Ne doivent PAS être modifiées)

### Bloc de code (PRE / CODE)
```javascript
// Les guillemets droits, apostrophes et espaces doivent rester intacts ici !
const message = "Hello World!";
let condition = (value === 'test');
let ratio = 100 % 3; // Le modulo ne doit pas recevoir d'espace fine
```

### Balise en ligne
Un texte contenant du code en ligne `let total = 45;` ou une commande `npm run astro -- --help` ou un échantillon de touche <kbd>Ctrl</kbd> + <kbd>C</kbd>.

### Balise avec classe d'exclusion
<p class="no-typo">Ce paragraphe porte la classe no-typo : il ne doit pas être modifié ! L'apostrophe droite ('), le point d'exclamation ! et le nombre 12500 doivent rester bruts.</p>

### Changement de langue
<p lang="en">Is this working properly? "Yes", it is! It costs 50\$ and 100% of features are on. (Attendu : aucune règle française ne s'applique ici).</p>

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
