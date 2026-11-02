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

    print(f"Vérification et optimisation de {len(files)} police(s)...")

    for file_name in files:
        input_path = os.path.join(SOURCE_DIR, file_name)
        base_name = os.path.splitext(file_name)[0]
        output_path = os.path.join(OUTPUT_DIR, f"{base_name}.woff2")

        # ⚡ OPTIMISATION : Évite de régénérer si le fichier source n'a pas changé
        if os.path.exists(output_path):
            input_mtime = os.path.getmtime(input_path)
            output_mtime = os.path.getmtime(output_path)
            if output_mtime > input_mtime:
                print(f"⏭️ Ignoré : {file_name} est déjà optimisé (public/fonts/{base_name}.woff2)")
                continue

        print(f"🔨 Traitement de {file_name} -> {output_path}")

        # Remplacement de 'pyftsubset' par l'appel direct du module python pour une portabilité maximale
        cmd = [
            "python3", "-m", "fonttools.subset",
            input_path,
            f"--unicodes={UNICODES_LIST}",
            "--layout-features=*",       # Conserve l'OpenType
            "--glyph-names",             # Spécifique à votre configuration
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
