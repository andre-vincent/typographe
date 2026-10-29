import os
import subprocess

# 1. Chemins des dossiers (compatibles avec la structure de votre dépôt Astro)
SOURCE_DIR = "src/fonts/src"
OUTPUT_DIR = "public/fonts"

# 2. Votre plage Unicode personnalisée (Éditoriale, FR/EN/ES/PT + Latin Extended-B, sans Maths)
UNICODES_LIST = (
    "U+0020-007F,"  # Basic Latin
    "U+00A0-00FF,"  # Latin-1 Supplement (Accents + Espace insécable U+00A0 pour votre plugin)
    "U+0100-017F,"  # Latin Extended-A
    "U+0180-024F,"  # AJOUTÉ : Latin Extended-B (Sécurité littéraire et historique)
    "U+2000-206F,"  # General Punctuation (Tirets, points de suspension, espace fin insécable U+202F)
    "U+2070-209F,"  # Conservé : Superscripts & Subscripts
    "U+20A0-20CF,"  # Conservé : Currency Symbols (Contient l'Euro €)
    "U+2100-214F,"  # Conservé : Letterlike Symbols
    "U+FB00-FB4F"   # Conservé : Alphabetic Presentation Forms (Ligatures physiques d'EB Garamond)
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

    print(f"Optimisation de {len(files)} police(s) pour la typographie éditoriale...")

    for file_name in files:
        input_path = os.path.join(SOURCE_DIR, file_name)
        
        # Extraction propre du nom du fichier sans l'extension
        base_name = os.path.splitext(file_name)[0]
        output_path = os.path.join(OUTPUT_DIR, f"{base_name}.woff2")

        print(f"Traitement de {file_name}...")

        # Commande pyftsubset optimisée pour l'environnement Cloudflare Pages
        cmd = [
            "pyftsubset",
            input_path,
            f"--unicodes={UNICODES_LIST}",
            "--layout-features=*",       # Conserve TOUTES les caractéristiques OpenType (ligatures, kerning)
            "--notdef-outline",          # Conserve le glyphe de secours générique
            "--no-hinting",              # Gain de poids majeur (suppression du hinting pour écrans modernes)
            "--name-IDs=0,1,2,4,6",      # Nettoyage des métadonnées validé par votre configuration Cloudflare
            "--flavor=woff2",            # Format de compression maximal WOFF2
            
            # Paramètres de sécurité pour polices variables (Fraunces & EB Garamond) sans dépendance HarfBuzz binaire
            "--keep-var-composites",     # Empêche la destruction géométrique des glyphes variables
            "--layout-scripts=*",        # Préserve la logique des scripts de mise en page
            f"--output-file={output_path}"
        ]

        try:
            subprocess.run(cmd, check=True)
            print(f"✓ Succès : {output_path} créé avec succès.")
        except subprocess.CalledProcessError as e:
            print(f"✕ Erreur lors du traitement de {file_name} : {e}")

if __name__ == "__main__":
    subset_fonts()
