import os
import subprocess

try:
    from fontTools.ttLib import TTFont
    import brotli
except ImportError:
    print("Dépendances manquantes : Veuillez installer fonttools et brotli avec 'pip install fonttools brotli'")
    exit(1)

# 1. Chemins des dossiers
SOURCE_DIR = "src/fonts/src"
OUTPUT_DIR = "public/fonts"

# 2. Plage Unicode Éditoriale Française Complète (Haute Qualité Éditoriale)
UNICODES_LIST = (
    # --- Ponctuation, Symboles de base et Tilde (ASCII) ---
    "U+0020-003F,"  # Espace, !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, 0-9, :, ;, <, =, >, ?
    "U+0040-007E,"  # @, A-Z, [, \, ], ^, _, `, a-z, {, |, }, ~ (Tilde inclus)
    
    # --- Espaces Typographiques fines et insécables ---
    "U+00A0,"       # Espace insécable (Devant le signe deux-points et les grands nombres)
    "U+202F,"       # Espace fine insécable (Obligatoire en français avant ;, !, ?)
    "U+2000-200A,"  # Espaces de tailles diverses (Cadratin, demi-cadratin, tiers de cadratin...)
    
    # --- Diacritiques et Lettres Françaises (Minuscules & Majuscules) ---
    "U+00A2-00A5,"  # Symboles monétaires courants (¢, £, ¤, ¥)
    "U+00C0,"       # À
    "U+00C2,"       # Â
    "U+00C6,"       # Æ
    "U+00C7,"       # Ç
    "U+00C8-00CB,"  # È, É, Ê, Ë
    "U+00CE-00CF,"  # Î, Ï
    "U+00D4,"       # Ô
    "U+00D9,"       # Ù
    "U+00DB-00DC,"  # Û, Ü
    "U+0152-0153,"  # Œ, œ
    "U+00E0,"       # à
    "U+00E2,"       # â
    "U+00E6,"       # æ
    "U+00E7,"       # ç
    "U+00E8-00EB,"  # è, é, ê, ë
    "U+00EE-00EF,"  # î, ï
    "U+00F4,"       # ô
    "U+00F9,"       # ù
    "U+00FB-00FC,"  # û, ü
    "U+0178,"       # Ÿ
    "U+00FF,"       # ÿ
    
    # --- Signes de Ponctuation Éditoriale et Tirets ---
    "U+2010-2011,"  # Trait d'union et trait d'union insécable
    "U+2013-2014,"  # Tiret demi-cadratin (–) et Tiret cadratin (—)
    "U+2018-201B,"  # Apostrophes et guillemets simples (Courbe ’, inversée, culbutée)
    "U+201C-201D,"  # Guillemets anglais doubles (“ ”) pour les citations imbriquées
    "U+2026,"       # Points de suspension (…)
    "U+00AB,"       # Guillemet français ouvrant («) - Correction de la coquille U+AB00
    "U+00BB,"       # Guillemet français fermant (»)
    
    # --- Symboles, Monnaie, Signes d'édition et Indicateurs Ordinaux ---
    "U+20AC,"       # Symbole Euro (€)
    "U+2116,"       # Symbole Numéro (№)
    "U+00AA,"       # Indicateur ordinal féminin (ª) pour "1re" en lettrine
    "U+00B0,"       # Signe degré (°)
    "U+00B1,"       # Signe plus-ou-moins (±) pour les approximations (ex: ±50 pages)
    "U+00B2-00B3,"  # Exposants ² et ³
    "U+00BC-00BE,"  # Fractions courantes (¼, ½, ¾)
    "U+00D7"        # Vrai signe mathématique de multiplication (×) pour les dimensions (ex: 14 × 21 cm)
)

def is_variable_font(font_path):
    """Détecte si la police contient des variations d'axes OpenType via la table fvar."""
    try:
        with TTFont(font_path) as font:
            return "fvar" in font
    except Exception as e:
        print(f"⚠️ Impossible d'analyser la police {os.path.basename(font_path)}: {e}")
        return False

def subset_fonts():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    if not os.path.exists(SOURCE_DIR):
        print(f"Erreur : Le dossier source '{SOURCE_DIR}' n'existe pas.")
        return

    files = [f for f in os.listdir(SOURCE_DIR) if f.lower().endswith(('.ttf', '.otf'))]
    
    if not files:
        print(f"Aucune police trouvée dans {SOURCE_DIR}")
        return

    print(f"Vérification et optimisation de {len(files)} police(s)...")

    for file_name in files:
        input_path = os.path.join(SOURCE_DIR, file_name)
        
        # Extraction propre du nom
        base_name = os.path.splitext(file_name)[0]
        output_path = os.path.join(OUTPUT_DIR, f"{base_name}.woff2")

        # ⚡ VERSION POUR TEMPLATE : Évite de régénérer si le fichier .woff2 existe déjà
        if os.path.exists(output_path):
            print(f"⏭️ Ignoré : {file_name} possède déjà sa version optimisée ({output_path})")
            continue

        # Détection automatique de la nature de la police
        is_var = is_variable_font(input_path)
        font_type_label = "VARIABLE" if is_var else "STATIQUE"
        print(f"🔨 Traitement [{font_type_label}] : {file_name} -> {output_path}")

        cmd = [
            "pyftsubset",
            input_path,
            f"--unicodes={UNICODES_LIST}",
            "--layout-features=*",  # Conserve le crénage, ligatures, chiffres elzéviriens et axes variables
            "--notdef-outline",     # Conserve le glyphe par défaut en cas de caractère manquant
            "--no-hinting",         # Supprime le hinting pour un rendu plus net sur le web moderne
            "--name-IDs=0,1,2,4,6", # Conserve les métadonnées essentielles (indispensable pour les polices variables)
            "--flavor=woff2",       # Compression maximale en WOFF2
            f"--output-file={output_path}"
        ]

        try:
            subprocess.run(cmd, check=True)
            print(f"✓ Succès : {output_path}")
        except subprocess.CalledProcessError as e:
            print(f"✕ Erreur sur {file_name} : {e}")
            exit(1)

if __name__ == "__main__":
    subset_fonts()
