import os
import subprocess

# 1. Chemins des dossiers (compatibles avec la structure Astro)
SOURCE_DIR = "src/fonts/src"
OUTPUT_DIR = "src/fonts"

# 2. Liste complète des caractères (FR, EN, ES, PT) + Ponctuation standard et fine
# Inclut : ÀÈÌÒÙÁÉÍÓÚÝÂÊÎÔÛÄËÏÖÜÇÑÃÕ¡¿ŒœÆæ...
UNICODES_LIST = (
    "U+0020-007F,U+00A0-00FF,U+0100-017F,U+2000-206F,U+2070-209F,"
    "U+20A0-20CF,U+2100-214F,U+2200-22FF"
)

def subset_fonts():
    # S'assurer que le dossier de sortie existe
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Création du dossier de sortie : {OUTPUT_DIR}")

    # Vérifier si le dossier source existe et contient des polices
    if not os.path.exists(SOURCE_DIR):
        print(f"Erreur : Le dossier source '{SOURCE_DIR}' n'existe pas.")
        return

    files = [f for f in os.listdir(SOURCE_DIR) if f.lower().endswith(('.ttf', '.otf'))]
    
    if not files:
        print(f"Aucune police (.ttf, .otf) trouvée dans {SOURCE_DIR}")
        return

    print(f"Trouvé {len(files)} police(s) à alléger...")

    for file_name in files:
        input_path = os.path.join(SOURCE_DIR, file_name)
        
        # Remplacer l'extension d'origine par .woff2 pour la sortie
        base_name = os.path.splitext(file_name)[0]
        output_path = os.path.join(OUTPUT_DIR, f"{base_name}.woff2")

        print(f"Traitement de {file_name}...")

        # Commande pyftsubset
        cmd = [
            "pyftsubset",
            input_path,
            f"--unicodes={UNICODES_LIST}",
            "--layout-features=*",      # Conserve TOUTES les OpenType Features
            "--flavor=woff2",           # Sortie au format WOFF2 ultra-compressé
            f"--output-file={output_path}"
        ]

        try:
            subprocess.run(cmd, check=True)
            print(f"✓ Succès : {output_path} créé avec succès.")
        except subprocess.CalledProcessError as e:
            print(f"✕ Erreur lors du traitement de {file_name} : {e}")

if __name__ == "__main__":
    subset_fonts()
