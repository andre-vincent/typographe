export function applyFrenchTypoRules(text, isInsideTd = false) {
  if (typeof text !== 'string') return text;
  
  const NARROW_NBSP = '\u202F'; // Espace fine insécable
  const NBSP = '\u00A0';        // Espace forte insécable
  let value = text;

  // A. Ponctuation Haute (?, !, ;)
  value = value.replace(/([A-Za-z0-9À-ÿ)\]])\s*([?!;])/g, `$1${NARROW_NBSP}$2`);

  // B. Le Deux-points (:)
  value = value.replace(/([A-Za-zÀ-ÿ)\]])\s*:(?!\/\/)/g, `$1${NBSP}:`);

  // C. Guillemets français (« »)
  value = value.replace(/"([^"]+?)"/g, `«$1»`);
  value = value.replace(/«\s*/g, `«${NARROW_NBSP}`);
  value = value.replace(/\s*»/g, `${NARROW_NBSP}»`);

  // D. Grands Nombres
  // Capture les suites de chiffres d'au moins 4 caractères
  value = value.replace(/\d{4,}/g, (match, offset, fullText) => {
    // ANALYSE DU CONTEXTE : Est-ce un nombre isolé ou au milieu d'une phrase textuelle ?
    // On vérifie les caractères immédiatement avant et après le nombre détecté
    const charBefore = offset > 0 ? fullText[offset - 1] : '';
    const charAfter = (offset + match.length) < fullText.length ? fullText[offset + match.length] : '';
    
    // Si le nombre est entouré de lettres ou de parenthèses (ex: "> 9999)" ou "an 2026"), 
    // on applique la règle standard hors-tableau (il reste brut s'il fait 4 chiffres)
    const isEmbeddedInText = /[A-Za-zÀ-ÿ()\[\]<>=]/.test(charBefore) || /[A-Za-zÀ-ÿ()\[\]<>=]/.test(charAfter);

    if (isInsideTd && !isEmbeddedInText) {
      // Dans un tableau (cellule de données pure) : séparation par lots de 3
      return match.replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NBSP);
    } else if (match.length > 4) {
      // Hors tableau (ou si inclus dans du texte d'en-tête) : uniquement si > 4 chiffres
      return match.replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NBSP);
    }
    
    return match;
  });
  
  // E. Unités, Pourcentages, Devises & Horaires
  value = value.replace(/(\d)\s*(%)/g, `$1${NARROW_NBSP}$2`);
  
  // Unités physiques ET informatiques (B, octets, ko, Mo, Go, To ajoutés)
  value = value.replace(/(\d)\s*(m|cm|mm|km|g|kg|mg|t|L|V|W|kW|Hz|dB|B|octets|ko|Mo|Go|To)\b/g, `$1${NARROW_NBSP}$2`);
  
  value = value.replace(/(\d)\s*([€\$£¥])/g, `$1${NBSP}$2`);
  value = value.replace(/(\d)\s*(h)\s*(\d+)/gi, `$1${NBSP}$2${NBSP}$3`);
  value = value.replace(/(\d)\s*(h)\b/gi, `$1${NBSP}$2`);

  // F. Apostrophes courbes & Éléments de structure
  value = value.replace(/([a-zA-ZÀ-ÿ])'([a-zA-ZÀ-ÿ])/g, '$1’$2');
  value = value.replace(/\.{3}/g, '…');

  return value;
}
