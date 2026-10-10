---
title: "Page de test de la typographie française"
excerpt: "Validation des espaces insécables, nombres et exclusions"
category: "Typographie"
date: 2026-10-10
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
