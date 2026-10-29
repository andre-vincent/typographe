import os
import subprocess

SOURCE_DIR = "src/fonts/src"
OUTPUT_DIR = "public/fonts"

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
        
        # 💡 CORRECTION : Ajout de [0] pour obtenir "BonaNova-Regular" au lieu du tuple
        base_name = os.path.splitext(file_name)[0]
        output_path = os.path.join(OUTPUT_DIR, f"{base_name}.woff2")

        print(f"Traitement de {file_name} -> {output_path}")

        cmd = [
            "pyftsubset",
            input_path,
            f"--unicodes={UNICODES_LIST}",
            "--layout-features=*",
            "--notdef-outline",
            "--no-hinting",
            "--name-IDs=0,1,2,4,6",
            "--flavor=woff2",
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
