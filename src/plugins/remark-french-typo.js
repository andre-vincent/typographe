import { visit } from 'unist-util-visit';

export function remarkFrenchTypography() {
  const NARROW_NBSP = '\u202F'; // Espace fine insécable
  const NBSP = '\u00A0';        // Espace forte insécable

  const ignoredMdxComponents = new Set(['CodeGroup', 'CodeGroupItem']);

  function applyFrenchTypoRules(text, isInsideTd = false) {
    if (typeof text !== 'string') return text;
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
    value = value.replace(/(?<=\d)\d{3,}/g, (match, offset, fullText) => {
      const fullNum = fullText.match(new RegExp(`\\d{${match.length + 1},}`))?.[0] || match;
      const numLength = fullNum.length;

      if (isInsideTd) {
        return match.replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NBSP);
      } else if (numLength > 4) {
        return match.replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NBSP);
      }
      return match;
    });

    // E. Unités, Pourcentages, Devises & Horaires
    value = value.replace(/(\d)\s*(%)/g, `$1${NARROW_NBSP}$2`);
    value = value.replace(/(\d)\s*\b(m|cm|mm|km|g|kg|mg|t|L|V|W|kW|Hz|dB)\b/g, `$1${NARROW_NBSP}$2`);
    value = value.replace(/(\d)\s*([€\$£¥])/g, `$1${NBSP}$2`);
    value = value.replace(/(\d)\s*(h)\s*(\d+)/gi, `$1${NBSP}$2${NBSP}$3`);
    value = value.replace(/(\d)\s*(h)\b/gi, `$1${NBSP}$2`);

    // F. Apostrophes courbes & Éléments de structure
    value = value.replace(/([a-zA-ZÀ-ÿ])'([a-zA-ZÀ-ÿ])/g, '$1’$2');
    value = value.replace(/\.{3}/g, '…');

    return value;
  }

  return (tree, file) => {
    // 1. FRONTMATTER (title et excerpt)
    const frontmatter = file.data.astro?.frontmatter;
    if (frontmatter) {
      if (frontmatter.title) frontmatter.title = applyFrenchTypoRules(frontmatter.title);
      if (frontmatter.excerpt) frontmatter.excerpt = applyFrenchTypoRules(frontmatter.excerpt);
    }

    // 2. CORPS DU TEXTE
    // unist-util-visit fournit (node, index, parent)
    visit(tree, 'text', (node, index, parent) => {
      if (!parent) return;

      // Sécurité : On ignore le texte si le parent immédiat est un composant de code mdx
      if (
        (parent.type === 'mdxJsxFlowElement' || parent.type === 'mdxJsxTextElement') &&
        ignoredMdxComponents.has(parent.name)
      ) {
        return;
      }

      // Détection si nous sommes dans une cellule de tableau
      const isInsideTd = parent.type === 'tableCell';
      
      node.value = applyFrenchTypoRules(node.value, isInsideTd);
    });
  };
}
