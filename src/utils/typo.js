export function applyFrenchTypoRules(text, isInsideTd = false, isStartOfBlock = true) {
  if (typeof text !== 'string' || text.length === 0) return text;

  const NARROW_NBSP = '\u202F';
  const NBSP = '\u00A0';
  const CURLY_APOS = '\u2019';
  const EM_DASH = '\u2014';
  const EN_DASH = '\u2013';

  // 1. Protection des URL et adresses courriel
  const protectedTokens = [];
  let value = text.replace(/(https?:\/\/[^\s)»"']+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (match) => {
    const token = `__TYPO_${protectedTokens.length}__`;
    protectedTokens.push(match);
    return token;
  });

  // 2. Guillemets droits -> chevrons français (exécuté en premier pour le frontmatter)
  // Préserve les guillemets anglais courbes (“ ”) pour les citations de second rang
  value = value.replace(/"([^"]+)"/g, '«$1»');
  value = value.replace(/«[\s\u00A0\u202F]*/g, `«${NARROW_NBSP}`);
  value = value.replace(/[\s\u00A0\u202F]*»/g, `${NARROW_NBSP}»`);

  // 3. Ponctuations hautes (? ! ; avec espace fine insécable, : avec espace insécable forte)
  value = value.replace(/([A-Za-z0-9À-ÿ)\]»])\s*([?!;])/g, `$1${NARROW_NBSP}$2`);
  value = value.replace(/([A-Za-z0-9À-ÿ)\]»])\s*:(?!\/\/)/g, `$1${NBSP}:`);

  // 4. Nombres de 4 chiffres et plus (séparateur des milliers : espace fine insécable)
  // Dans le texte courant : à partir de 5 chiffres (préserve les années à 4 chiffres)
  // Dans les cellules de tableau (isInsideTd) : dès 4 chiffres
  value = value.replace(/\d{4,}/g, (match, offset, fullText) => {
    const charBefore = offset > 0 ? fullText[offset - 1] : '';
    const charAfter = (offset + match.length) < fullText.length ? fullText[offset + match.length] : '';

    if (charBefore === ',' || charBefore === '.') return match;

    const isEmbedded = /[A-Za-zÀ-ÿ\[\]<>=]/.test(charBefore) || /[A-Za-zÀ-ÿ\[\]<>=]/.test(charAfter);

    if (isInsideTd && !isEmbedded) {
      return match.replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NBSP);
    } else if (match.length > 4 && !isEmbedded) {
      return match.replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NBSP);
    }
    return match;
  });

  // 5. Pourcentages, unités de mesure et devises
  value = value.replace(/(\d)\s*(%)/g, `$1${NARROW_NBSP}$2`);

  value = value.replace(
    /(\d)\s*(m²|m³|°C|cm|mm|km|kg|mg|octets|ko|Mo|Go|To|kW|Hz|dB|min|m|g|t|L|V|W|B|s)(?![A-Za-zÀ-ÿ0-9'’])/g,
    `$1${NARROW_NBSP}$2`
  );

  value = value.replace(/(\d)\s*([€$£¥])/g, `$1${NBSP}$2`);

  // 6. Heures (règle stricte Imprimerie nationale : 14 h 30 -> 14\u202Fh30 et 14\u202Fh)
  value = value.replace(/(\d)\s*(h)\s*(\d+)/gi, `$1${NARROW_NBSP}$2$3`);
  value = value.replace(/(\d)\s*(h)(?![A-Za-zÀ-ÿ0-9'’])/gi, `$1${NARROW_NBSP}$2`);

  // 7. Apostrophe typographique et points de suspension
  value = value.replace(/([a-zA-ZÀ-ÿ«\u202F])'(?=[a-zA-ZÀ-ÿ0-9«“]|$)/g, `$1${CURLY_APOS}`);
  value = value.replace(/\s*\.{3,}/g, '…');

  // 8. Titres de civilité et abréviations usuelles (retire "Ve" pour éviter la collision avec "Ve République")
  value = value.replace(
    /\b(M\.|MM\.|Mme|Mmes|Mlle|Mlles|Dr|Drs|Pr|Prs|Me|Mes|Mgr|Mgrs|St|Ste|Sts|Stes|Vve)\s+(?=[A-ZÀ-ÖØ-Þ])/g,
    `$1${NBSP}`
  );

  // 9. Tirets : cadratin pour les dialogues, demi-cadratin pour les incises
  if (isStartOfBlock) {
    value = value.replace(/^(?:--|-|–|—)\s*/, `${EM_DASH}${NBSP}`);
  }
  value = value.replace(/(\S)\s+(?:--|-|–|—)(?=[.,;:!?…»)]|\s|$)/g, `$1${NBSP}${EN_DASH}`);
  value = value.replace(/(\s)(?:--|-|–|—)\s+(?=\S)/g, `$1${EN_DASH}${NBSP}`);

  // 10. Dates, siècles, millénaires et références éditoriales
  const moisFr = 'janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre';
  value = value.replace(
    new RegExp(`\\b([1-9]|[12][0-9]|3[01])(er)?\\s+(${moisFr})\\b`, 'gi'),
    `$1$2${NBSP}$3`
  );

  value = value.replace(
    /\b([IVXLCDM]+(?:er|e|ème)?)\s+(siècles?|millénaires?)\b/g,
    `$1${NBSP}$2`
  );

  value = value.replace(
    /\b(chapitre|tome|volume|partie|section|article|alinéa|page|p\.|figure|fig\.|tableau|annexe|numéro|n°)\s+([0-9IVXLCDM]+(?:er|e|ème)?)\b/gi,
    `$1${NBSP}$2`
  );

  // 11. Restauration des URL et adresses courriel protégées
  if (protectedTokens.length > 0) {
    value = value.replace(/__TYPO_(\d+)__/g, (_, index) => protectedTokens[Number(index)]);
  }

  return value;
}
