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
UNICODES_LIST = ",".join([
    # --- ASCII de base, chiffres et alphabet (couvre l'anglais) ---
    "U+0020-007E",  # Ponctuation, chiffres et alphabet latin non accentué

    # --- Espaces et devises ---
    "U+00A0", "U+202F", "U+2000-200A",  # Espace insécable, fine insécable, espaces cadratins
    "U+00A2-00A5", "U+20AC",           # Symboles monétaires (¢, £, ¤, ¥, €)

    # --- Diacritiques et ligatures (FR, EN, ES, PT, DE, IT) ---
    "U+00C0-00FF",  # Bloc Latin-1 Supplement complet (À-ÿ, ß, Ñ, Ã, Õ, Ä, Ö, Ü, Ì, Ç, etc.)
    "U+0152-0153",  # Ligatures françaises Œ, œ
    "U+0178",       # Majuscule Ÿ
    "U+1E9E",       # Eszett majuscule allemand (ẞ)

    # --- Guillemets, ponctuation éditoriale et symboles ---
    "U+00A1", "U+00BF",                 # Ponctuation inversée espagnole (¡, ¿)
    "U+00AB", "U+00BB",                 # Guillemets chevrons doubles (« »)
    "U+2039-203A",                      # Guillemets chevrons simples (‹ ›)
    "U+2010-2026",                      # Tirets, apostrophes, guillemets (“ ” „ ‚), puce (•), ellipse (…)
    "U+00B7", "U+2116",                 # Point médian (·), symbole Numéro (№)
    "U+00AA-00BE",                      # Indicateurs ordinaux (ª, º), degré (°), fractions (¼-¾), ±, ², ³
    "U+00D7",                           # Signe de multiplication (×)
    "U+2032-2033",                      # Prime (′) et double prime (″)
    "U+00A7", "U+2020-2021"             # Paragraphe (§), obèles (†, ‡)
])

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
