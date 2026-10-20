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

---

## Automatiser l'optimisation des polices sur Astro et Cloudflare Pages
> Découvrez comment mettre en place un pipeline de build 100% automatisé avec Python (FontTools) et GitHub Actions pour diviser par 10 le poids de vos polices et obtenir un score de 100% sur Lighthouse.

Avoir un site qui charge à la vitesse de l'éclair est crucial pour l'expérience utilisateur et le SEO. Les polices de caractères (*fonts*) sont souvent les éléments les plus lourds lors du premier chargement. 

Dans ce tutoriel, nous allons voir comment mettre en place un système **100% automatisé** : vous déposez vos polices brutes (`.ttf` ou `.otf`) sur GitHub depuis votre iPad, et un script s'occupe de les compresser au format ultra-léger **WOFF2**, de configurer un cache agressif pour Cloudflare Pages, et de propulser votre score Lighthouse à **100 partout**.

---

### L'Architecture du Projet

Pour éviter de ralentir le build de Cloudflare Pages à chaque déploiement, nous allons déléguer la lourde tâche de compression à **GitHub Actions**.

* **Dossier Source (`INPUT`) :** `src/fonts/src/` (Contient vos fichiers originaux `.ttf` ou `.otf`)
* **Dossier de Sortie (`OUTPUT`) :** `public/fonts/` (Accueille les fichiers `.woff2` compressés par le script)

---

### Étape 1 : Le Script Python (`subset-fonts.py`)

Ce script utilise la puissance de la bibliothèque `fonttools` (`pyftsubset`). Contrairement à une compression basique, il conserve toutes les fonctionnalités typographiques OpenType importantes (ligatures, paires de crénage) tout en limitant les caractères aux langues européennes (Français, Anglais, Espagnol, Portugais).

Créez un fichier nommé **`subset-fonts.py`** à la racine de votre projet et collez-y ce code :

```python
import os
import subprocess

SOURCE_DIR = "src/fonts/src"
OUTPUT_DIR = "public/fonts"

# Liste complète des caractères (FR, EN, ES, PT) + Ponctuation standard et fine
UNICODES_LIST = (
    "U+0020-007F,U+00A0-00FF,U+0100-017F,U+2000-206F,U+2070-209F,"
    "U+20A0-20CF,U+2100-214F,U+2200-22FF,U+FB00-FB4F"
)

def subset_fonts():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    if not os.path.exists(SOURCE_DIR):
        print(f"Erreur : Le dossier source '{SOURCE_DIR}' n'existe pas.")
        return

    files = [f for f in os.listdir(SOURCE_DIR) if f.lower().endswith(('.ttf', '.otf'))]
    
    if not files:
        print(f"Aucune police (.ttf, .otf) trouvée dans {SOURCE_DIR}")
        return

    for file_name in files:
        input_path = os.path.join(SOURCE_DIR, file_name)
        base_name = os.path.splitext(file_name)[0]
        output_path = os.path.join(OUTPUT_DIR, f"{base_name}.woff2")

        print(f"Traitement de {file_name}...")

        cmd = [
            "pyftsubset",
            input_path,
            f"--unicodes={UNICODES_LIST}",
            "--layout-features=*",      # Conserve TOUTES les OpenType Features
            "--glyph-names",            # Conserve le nom des glyphes pour l'OpenType
            "--legacy-cmap",            # Assure la compatibilité des tables d'encodage
            "--flavor=woff2",           # Sortie au format WOFF2 ultra-compressé
            f"--output-file={output_path}"
        ]

        try:
            subprocess.run(cmd, check=True)
            print(f"✓ Succès : {output_path} créé.")
        except subprocess.CalledProcessError as e:
            print(f"✕ Erreur lors du traitement de {file_name} : {e}")

if __name__ == "__main__":
    subset_fonts()
```

---

### Étape 2 : Automatiser avec GitHub Actions

Nous allons créer un robot (*workflow*) sur GitHub. Dès que vous ajouterez une police dans le dossier source, GitHub va créer une machine virtuelle Linux temporaire, exécuter le script Python, et enregistrer le fichier `.woff2` final dans votre dépôt.

Créez l'arborescence de dossiers suivante à la racine : `.github/workflows/`. À l'intérieur, créez un fichier nommé **`optimize-fonts.yml`** :

```yaml
name: Optimisation automatique des polices

on:
  push:
    paths:
      - 'src/fonts/src/**' # Se déclenche si le dossier source change
  workflow_dispatch:      # Permet un lancement manuel depuis l'interface GitHub

permissions:
  contents: write # Donne le droit au robot d'enregistrer les fichiers sur votre dépôt

jobs:
  optimize:
    runs-on: ubuntu-latest

    steps:
      - name: Récupérer le code du projet
        uses: actions/checkout@v4

      - name: Installer Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.x'

      - name: Installer les dépendances
        run: |
          pip install fonttools brotli

      - name: Exécuter votre script Python
        run: |
          python subset-fonts.py

      - name: Enregistrer les modifications sur GitHub
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: polices optimisées automatiquement en WOFF2"
          file_pattern: 'public/fonts/*.woff2'
```

---

### Étape 3 : Ajuster le fichier `.gitignore`

Par défaut, de nombreux projets Astro ignorent les fichiers générés automatiquement. Si votre fichier `.gitignore` contient la ligne `public/fonts/*.woff2`, GitHub Actions refusera d'enregistrer vos polices optimisées.

1. Ouvrez votre fichier **`.gitignore`**.
2. Assurez-vous de **supprimer** toute règle bloquant le dossier `public/fonts/`.

---

### Étape 4 : Configurer le Cache HTTP sur Cloudflare Pages

Les polices optimisées ne changent presque jamais. Il faut ordonner aux serveurs de Cloudflare et aux navigateurs de vos visiteurs de stocker ces polices en mémoire "à vie".

Dans votre dossier **`public/`**, créez un fichier nommé **`_headers`** (sans aucune extension) :

```text
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
```

* **`max-age=31536000`** : Stocke la police pendant 1 an dans le navigateur.
* **`immutable`** : Empêche le navigateur de redemander au serveur si le fichier a changé, rendant le chargement instantané lors des visites suivantes.

---

### Étape 5 : Déclarer les polices en CSS

Dans votre fichier CSS global (par exemple `src/styles/global.css`), déclarez vos polices en utilisant une stratégie de versioning par *Query Parameter* (`?v=1`). Cela vous permettra de forcer la mise à jour du cache si un jour vous modifiez la police.

```css
@font-face {
  font-family: 'MaPolicePersonnalisee';
  src: url('/fonts/ma-font-reduite.woff2?v=1') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* Évite le texte invisible pendant le chargement */
}
```

La propriété **`font-display: swap;`** est cruciale : elle indique au navigateur d'afficher immédiatement le texte avec une police système en attendant que le fichier WOFF2 soit extrait du cache ou téléchargé.

---

### Conclusion

Grâce à ce pipeline moderne, votre projet Astro bénéficie d'une optimisation typographique digne des plus grands sites de tech, le tout gérable facilement depuis une simple interface web ou une tablette. Le résultat parle de lui-même : **un score parfait de 100% sur toutes les métriques Lighthouse !**


