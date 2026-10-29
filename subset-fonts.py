import os
import subprocess

# 1. Chemins des dossiers
SOURCE_DIR = "src/fonts/src"
OUTPUT_DIR = "public/fonts"

# 2. Plage Unicode Éditoriale validée (avec Latin Extended-B, sans Maths)
UNICODES_LIST = (
    "U+0020-007F,"  # Basic Latin
    "U+00A0-00FF,"  # Latin-1 Supplement (Accents + Espace insécable U+00A0)
    "U+0100-017F,"  # Latin Extended-A (Œ, œ)
    "U+0180-024F,"  # Latin Extended-B (Sécurité typographie ancienne)
    "U+2000-206F,"  # General Punctuation (Tirets, points de suspension, espace fin insécable U+202F)
    "U+2070-209F,"  # Superscripts & Subscripts
    "U+20A0-20CF,"  # Currency Symbols (Euro)
    "U+2100-214F,"  # Letterlike Symbols
    "U+FB00-FB4F"   # Alphabetic Presentation Forms (Ligatures EB Garamond)
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

    print(f"Optimisation de {len(files)} police(s)...")

    for file_name in files:
        input_path = os.path.join(SOURCE_DIR, file_name)
        
        # 💡 CORRECTION DU BUG : Utilisation stricte de [0] pour extraire le nom propre
        base_name = os.path.splitext(file_name)[0]
        output_path = os.path.join(OUTPUT_DIR, f"{base_name}.woff2")

        print(f"Traitement de {file_name} -> {output_path}")

        cmd = [
            "pyftsubset",
            input_path,
            f"--unicodes={UNICODES_LIST}",
            "--layout-features=*",       # Conserve les fonctionnalités OpenType
            "--notdef-outline",
            "--no-hinting",              # Gain de poids majeur
            "--name-IDs=0,1,2,4,6",      # Nettoyage optimal compatible Cloudflare
            "--flavor=woff2",            # Format WOFF2
            
            # Paramètres polices variables (Fraunces / EB Garamond)
            "--keep-var-composites",     
            "--layout-scripts=*",        
            f"--output-file={output_path}"
        ]

        try:
            subprocess.run(cmd, check=True)
            print(f"✓ Succès : {output_path}")
        except subprocess.CalledProcessError as e:
            print(f"✕ Erreur sur {file_name} : {e}")

if __name__ == "__main__":
    subset_fonts()
