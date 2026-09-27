---
title: "Les 15 règles d’une typographie soignée en Français"
excerpt: "En design comme en rédaction, la qualité d’un texte ne dépend pas seulement du choix des mots, mais aussi de sa présentation visuelle. Une typographie soignée renforce la lisibilité, crédibilise le message et témoigne d’un grand professionnalisme."
category: "Reliability"
date: 2026-07-01
author:
  name: "André Vincent"
  role: "Webmestre de ce site. Typographe, enseignant et syndicaliste."
cover:
  src: "./cover.jpg"
  alt: "À venir. Photo de fontes typographiques."
  creditName: "Crédit photo : Martin Martz via Unsplash"
  creditUrl: "https://unsplash.com/photos/a-blue-and-orange-background-with-wavy-shapes-W0NRebXbsjM"
featured: true
---

Voici les **15 critères indispensables** du code typographique et du design numérique à maîtriser pour un rendu irréprochable.

---

## Les règles orthotypographiques fondamentales

### 1. La gestion rigoureuse des espaces
Le français se distingue de l’anglais par l’utilisation d’espaces avant certains signes de ponctuation. On applique la règle de la ponctuation dite « double » :
* **Ponctuation haute** ( ; ! ?) : Elles nécessitent une **espace insécable fine** (U+202F) avant le signe et une espace normale après.
* **Le deux-points** ( :) : Il requiert une **espace insécable normale** avant le signe et une espace normale après.
* **Ponctuation simple** (, .) : Pas d’espace avant, une espace normale après.

### 2. Les guillemets français
Les guillemets anglais (" ") ou les apostrophes dactylographiques ('' '') sont à proscrire pour les citations textuelles en français.
* **Le bon choix** : Utilisez exclusivement les guillemets dits « en chevrons » (**«** et **»**).
* **L’espacement** : Ils demandent une espace insécable fine après le guillemet ouvrant et avant le guillemet fermant (ex. : « Comme ceci »).

### 3. L’accentuation des lettres majuscules
Une idée reçue tenace affirme que les majuscules ne prennent pas d’accent. C’est faux. L’Académie française rappelle que l’accent a une valeur phonétique et orthographique cruciale.
* **Exemple classique** : La différence entre « Un homme ÉLEVÉ » et « Un homme ELEVE ».
* **À appliquer** : Accentuez systématiquement les **À**, **É**, **È**, **Ç**, **Ù**, **Ô**, etc.

### 4. L’usage de l’apostrophe typographique
L’apostrophe droite ou dactylographique ( ' ), héritée des machines à écrire, doit être remplacée par l’apostrophe typographique ou courbe ( ’ ). 
* **Rendu** : L’apostrophe courbe s’intègre harmonieusement dans le fil du texte (ex. : *l’arbre* au lieu de *l'arbre*).

### 5. Les tirets cadratins pour les dialogues
Pour introduire les répliques dans un dialogue, n’utilisez pas le trait d’union (-), mais le **tiret cadratin** ( — ).
* **Structure** : Le tiret cadratin est suivi d’une espace inter-mot normale.

### 6. Les tirets demi-cadratins pour les incises et énumérations
Pour isoler une proposition incise — comme celle-ci — ou pour lister des éléments dans une énumération, employez le **tiret demi-cadratin** ( – ).
* **Incises** : Placez une espace avant et après le tiret demi-cadratin.

### 7. L’écriture correcte des nombres
Pour faciliter la lecture, les grands nombres s’écrivent par groupes de trois chiffres, séparés non pas par des points ou des virgules (comme en anglais), mais par des **espaces insécables**.
* **Correct** : 15 000 000 €
* **Incorrect** : 15,000,000 € ou 15.000.000 €

### 8. Les ligatures obligatoires
Certaines associations de lettres doivent fusionner graphiquement en français. Ne pas les lier est considéré comme une faute d’orthographe typographique.
* **Les combinaisons** : Le **œ** (dans *cœur*, *œuf*, *œuvre*) et le **æ** (dans *ex æquo*).

### 9. L’utilisation raisonnée de l’italique
L’italique répond à des règles strictes. On l’utilise principalement pour :
* Les **titres d’œuvres** (livres, films, peintures, journaux).
* Les **mots étrangers** non francisés (ex. : *a priori*, *design*).
* Mettre en valeur un mot précis (avec parcimonie).

### 10. Les abréviations conventionnelles
Les abréviations en français suivent des normes précises pour éviter les confusions :
* **Monsieur / Madame** : S’abrègent en **M.** (et non Mr.) et **Mme** (sans point à la fin car la dernière lettre du mot est présente).
* **Numéro** : S’abrège en **n°** (et non No.).
* **Et cætera** : S’écrit **etc.** (toujours suivi d’un point, jamais de points de suspension car cela constituerait un pléonasme).

### 11. La chasse aux orphelins et aux veuves
En mise en page, veillez à la cohérence visuelle des paragraphes :
* **L’orphelin** : La première ligne d’un paragraphe qui apparaît seule en bas d’une page.
* **La veuve** : La dernière ligne d’un paragraphe (ou un mot isolé) qui se retrouve seule en haut de la page suivante. 

### 12. Les points de suspension
Les points de suspension sont toujours au nombre de **trois** (...) et sont immédiatement collés au mot qui les précède, sans espace. Ils sont suivis d’une espace s’ils ne terminent pas la phrase.

---

## Les critères spécifiques à la lecture sur écran

La lecture sur moniteur ou smartphone fatigue l’œil beaucoup plus vite que le papier. Pour les textes longs, appelés **textes de labeur** (corps du texte), trois règles techniques d’ergonomie visuelle s’imposent.

### 13. La taille optimale des polices de labeur (corps)
Sur le web et les interfaces numériques, la lisibilité commence par un texte suffisamment grand pour éviter la fatigue oculaire.
* **Le standard moderne** : Le corps de texte minimal doit être de **16 pixels (px)**. Une taille de **18 px est vivement recommandée** pour les longs articles ou les blogs dominés par le texte.
* **En unités relatives** : On privilégie l’usage du **rem** en développement (1 rem à 1.25 rem selon la configuration de base), ce qui permet au texte de s’adapter automatiquement aux préférences d’accessibilité de l’utilisateur.

### 14. Le nombre optimal de caractères par ligne (longueur de justification)
Une ligne trop longue fatigue l’œil, qui peine à retrouver le début de la ligne suivante. Une ligne trop courte brise le rythme de lecture.
* **La zone de confort** : La longueur idéale d’une ligne se situe entre **50 et 75 caractères** (espaces comprises), avec une moyenne parfaite autour de **60 à 65 caractères**.
* **Application technique** : En intégration CSS, on limite la largeur des blocs de texte en utilisant la propriété `max-width: 60ch` ou `65ch`, alignée de préférence à gauche (le texte justifié crée d’inesthétiques « rivières » de blancs sur écran).

### 15. L’interlignage pour le texte de labeur
L’interlignage (la distance verticale entre deux lignes) doit être plus généreux sur écran que sur papier pour laisser le texte « respirer » et guider le regard.
* **La règle d’or** : L’interlignage idéal se situe entre **1,5 et 1,6 fois la taille du corps de texte** (soit un `line-height` de 1.5 ou 1.6 en CSS). Par exemple, pour un texte de 16 px, l’interligne doit être d’environ 24 px.
* **Exception de hiérarchie** : Si le texte de labeur demande un interlignage aéré (150 % à 160 %), les titres volumineux, quant à eux, nécessitent un interlignage beaucoup plus resserré (environ 110 % à 120 %) pour maintenir leur unité visuelle.

---

En combinant la rigueur du code typographique traditionnel et les impératifs d’ergonomie sur écran, vous garantissez à vos lecteurs un confort visuel optimal, une accessibilité irréprochable et une expérience de lecture fluide.
