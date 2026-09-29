---
title: "Optimisation des polices complexes pour le français"
excerpt: "Pour une typographie soignée en français, nous devons utiliser des polices de caractères complexes. Mais ces polices sont souvent très lourdes et peuvent ralentir les performances d’affichage. Voici une méthode pour les optimiser.."
category: "Typographie"
date: 2026-09-29
author:
  name: "André Vincent"
  role: "Typographe - Enseignant en communication graphique."
cover:
  src: "./cover.jpg"
  alt: "Formes fluides abstraites bleues et violettes avec lueur néon"
  creditName: "Crédits photo à BoliviaInteligente via Unsplash"
  creditUrl: "https://unsplash.com/photos/abstract-blue-and-purple-fluid-shapes-with-neon-glow-46MZbf_9P5I"
featured: false
---

Par défaut, si vous téléchargez une police variable complète, elle contient des milliers de glyphes pour couvrir des centaines de langues (cyrillique, vietnamien, grec, etc.), ce qui alourdit considérablement le fichier `.woff2`. Vous pouvez **extraire uniquement les caractères nécessaires au français** tout en préservant à 100 % les **axes de variation** (`wght`, `opsz`, etc.) et les **fonctionnalités OpenType** natives (`smcp`, `sups`, `onum`) indispensables pour une typographie soignée en français.

---

## Le piège à éviter : le *Layout Closure*

Lorsque l’on réduit une police, la majorité des outils automatiques suppriment les glyphes cachés. Or, les fonctionnalités OpenType (comme le passage en petites capitales `smcp`) font appel à des **glyphes alternatifs dissimulés** (les versions réduites de vos lettres). Si vous dites à un logiciel de ne garder *que* les lettres standards de « A à Z », il va détruire les glyphes de petites capitales correspondants.

## La solution : `pyftsubset` (FontTools)

L’outil de référence absolu pour réussir cette opération s’appelle **FontTools** (un utilitaire en ligne de commande basé sur Python). C’est le seul capable de recalculer parfaitement les tables internes d’une police variable.

Voici la commande exacte à exécuter dans votre terminal pour traiter le fichier de police variable d’origine :

```bash
pyftsubset NomDeLaPolice.ttf \
  --unicodes="U+0020-007F,U+00A0-00FF,U+0152-0153,U+2010-2026,U+20AC" \
  --layout-features="*" \
  --flavor="woff2" \
  --output-file="police-francais.var.woff2"
```

### 🔍 Explication des arguments :

* **`--unicodes="..."` (Le ciblage français) :** ce filtre extrait uniquement les caractères indispensables :
  * `U+0020-007F` : le Latin de base (lettres non accentuées, ponctuation, chiffres).
  * `U+00A0-00FF` : le Latin-1 Supplement (incluant tous les accents majuscules et minuscules : **é, è, à, ç, ù, ô, ë**, etc.).
  * `U+0152-0153` : les ligatures typographiques indispensables au français (**Œ** et **œ**).
  * `U+2010-2026` : la ponctuation typographique fine (les guillemets français `« »`, les espaces insécables, les points de suspension `…`).
  * `U+20AC` : le symbole de l’Euro (**€**).
* **`--layout-features="*"` (Le commutateur OpenType) :** c’est l’argument le plus crucial. Il ordonne à l’outil de conserver l’**intégralité des tables et règles OpenType** (`smcp`, `onum`, `sups`, `kern`, `liga`). L’outil va automatiquement analyser la police et conserver en secret les glyphes cachés de petites capitales ou d’exposants correspondants aux caractères français demandés.
* **`--flavor="woff2"` :** compresse le résultat au format web le plus performant du marché (gain de ~30 % de poids par rapport au WOFF classique).

### 📉 Le résultat sur vos performances

En appliquant cette méthode sur une police variable riche comme *Fira Sans* ou *Newsreader* :
* Le fichier d’origine passe de **~400 Ko à seulement ~35 Ko**.
* Vous conservez une flexibilité totale en CSS (gestion du `clamp()` sur la graisse ou la taille optique).
* Toutes vos abréviations (« M<sup>me</sup> », « <span style="font-variant-caps: small-caps;">xxi</span><sup>e</sup> ») et petites capitales s’affichent instantanément de manière native et optimale.

