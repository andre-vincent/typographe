export function applyFrenchTypoRules(text, isInsideTd = false) {
  if (typeof text !== 'string' || text.length === 0) return text;

  const NARROW_NBSP = '\u202F';
  const NBSP = '\u00A0';
  const CURLY_APOS = '\u2019';
  const EM_DASH = '\u2014';

  const protectedTokens = [];
  let value = text.replace(/(https?:\/\/[^\s)»"']+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (match) => {
    const token = `__TYPO_${protectedTokens.length}__`;
    protectedTokens.push(match);
    return token;
  });

  value = value.replace(/([A-Za-z0-9À-ÿ)\]»])\s*([?!;])/g, `$1${NARROW_NBSP}$2`);
  value = value.replace(/([A-Za-z0-9À-ÿ)\]»])\s*:(?!\/\/)/g, `$1${NBSP}:`);

  value = value.replace(/[“"]([^“”"]+)[”"]/g, '«$1»');
  value = value.replace(/«[\s\u00A0\u202F]*/g, `«${NARROW_NBSP}`);
  value = value.replace(/[\s\u00A0\u202F]*»/g, `${NARROW_NBSP}»`);

  value = value.replace(/\d{4,}/g, (match, offset, fullText) => {
    const charBefore = offset > 0 ? fullText[offset - 1] : '';
    const charAfter = (offset + match.length) < fullText.length ? fullText[offset + match.length] : '';

    if (charBefore === ',' || charBefore === '.') return match;

    const isEmbedded = /[A-Za-zÀ-ÿ()\[\]<>=]/.test(charBefore) || /[A-Za-zÀ-ÿ()\[\]<>=]/.test(charAfter);

    if (isInsideTd && !isEmbedded) {
      return match.replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NBSP);
    } else if (match.length > 4) {
      return match.replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NBSP);
    }
    return match;
  });

  value = value.replace(/(\d)\s*(%)/g, `$1${NARROW_NBSP}$2`);

  value = value.replace(
    /(\d)\s*(m²|m³|°C|cm|mm|km|kg|mg|octets|ko|Mo|Go|To|kW|Hz|dB|min|m|g|t|L|V|W|B|s)(?![A-Za-zÀ-ÿ0-9])/g,
    `$1${NARROW_NBSP}$2`
  );

  value = value.replace(/(\d)\s*([€$£¥])/g, `$1${NBSP}$2`);

  value = value.replace(/(\d)\s*(h)\s*(\d+)/gi, `$1${NARROW_NBSP}$2${NARROW_NBSP}$3`);
  value = value.replace(/(\d)\s*(h)(?![A-Za-zÀ-ÿ0-9])/gi, `$1${NARROW_NBSP}$2`);

  value = value.replace(/([a-zA-ZÀ-ÿ])'(?=[a-zA-ZÀ-ÿ0-9«“]|$)/g, `$1${CURLY_APOS}`);
  value = value.replace(/\.{3}/g, '…');

  value = value.replace(
    /\b(M\.|MM\.|Mme|Mmes|Mlle|Mlles|Dr|Drs|Pr|Prs|Me|Mes|Mgr|Mgrs|St|Ste|Sts|Stes|Ve|Vve)\s+(?=[A-ZÀ-ÖØ-Þ])/g,
    `$1${NBSP}`
  );

  value = value.replace(/(^|\s)(?:--|-|–|—)\s+/g, (match, prefix) => `${prefix}${EM_DASH} `);
  value = value.replace(new RegExp(`^${EM_DASH}\\s+`), `${EM_DASH}${NBSP}`);
  value = value.replace(
    new RegExp(`\\s${EM_DASH}\\s+([^${EM_DASH}]+?)\\s+${EM_DASH}(?=[\\s.,;:!?»]|$)`, 'g'),
    ` ${EM_DASH}${NBSP}$1${NBSP}${EM_DASH}`
  );
  value = value.replace(
    new RegExp(`\\s${EM_DASH}\\s+([^${EM_DASH}]+?)(?=[.!?…»]|$)`, 'g'),
    ` ${EM_DASH}${NBSP}$1`
  );

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

  if (protectedTokens.length > 0) {
    value = value.replace(/__TYPO_(\d+)__/g, (_, index) => protectedTokens[Number(index)]);
  }

  return value;
}
