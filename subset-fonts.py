import os
import subprocess

# 1. Chemins des dossiers
SOURCE_DIR = "src/fonts/src"
OUTPUT_DIR = "public/fonts"

# 2. Plage Unicode Éditoriale validée (avec Latin Extended-B, sans Maths)
UNICODES_LIST = (
    "U+0020-007F,"
    "U+00A0-00FF,"
    "U+0100-017F,"
    "U+0180-024F,"
    "U+2000-206F,"
    "U+2070-209F,"
    "U+20A0-20CF,"
    "U+2100-214F,"
    "U+FB00-FB4F"
)

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

    print(f"Optimisation de {len(files)} police(s)...")

    for file_name in files:
        input_path = os.path.join(SOURCE_DIR, file_name)
        
        # Extraction propre du nom de fichier
        base_name = os.path.splitext(file_name)[0]
        output_path = os.path.join(OUTPUT_DIR, f"{base_name}.woff2")

        print(f"Traitement de {file_name} -> {output_path}")

        # Retour strict à vos arguments d'origine qui fonctionnent sur vos serveurs
        cmd = [
            "pyftsubset",
            input_path,
            f"--unicodes={UNICODES_LIST}",
            "--layout-features=*",       # Conserve l'OpenType
            "--glyph-names",             # Ajout de votre script d'origine
            "--notdef-outline",          # Conserve les structures
            "--no-hinting",              # Nettoyage du hinting
            "--name-IDs=0,1,2,4,6",      # Nettoyage métadonnées
            "--flavor=woff2",            # Format WOFF2
            f"--output-file={output_path}"
        ]

        try:
            subprocess.run(cmd, check=True)
            print(f"✓ Succès : {output_path}")
        except subprocess.CalledProcessError as e:
            print(f"✕ Erreur sur {file_name} : {e}")

if __name__ == "__main__":
    subset_fonts()
