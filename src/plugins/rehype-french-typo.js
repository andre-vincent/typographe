// src/plugins/rehype-french-typo.js

export function rehypeFrenchTypography() {
  const ignoredNames = new Set([
    'code', 'pre', 'style', 'script', 'textarea', 'kbd', 'samp',
    'CodeBlock', 'TabbedCodeGroup' // Composants natifs de Monograph
  ]);

  // Définition des vrais caractères Unicode invisibles compatibles avec MDX
  const NARROW_NBSP = '\u202F'; // Équivalent de &#8239; (Espace fine insécable)
  const NBSP = '\u00A0';        // Équivalent de &nbsp; (Espace forte insécable)

  /**
   * Fonction de parcours récursive de l'arbre HTML/MDX sans dépendance externe
   * @param {any} node 
   * @param {any[]} ancestors 
   */
  function walk(node, ancestors = []) {
    if (node.type === 'text') {
      let isInsideTd = false;

      const isInsideIgnoredNode = ancestors.some((anc) => {
        const isElement = anc.type === 'element';
        const isMdx = anc.type === 'mdxJsxFlowElement' || anc.type === 'mdxJsxTextElement';

        if (!isElement && !isMdx) return false;

        const name = isElement ? anc.tagName : anc.name;
        
        if (name === 'td') {
          isInsideTd = true;
        }

        if (ignoredNames.has(name)) return true;

        const props = isElement ? (anc.properties || {}) : {};
        const mdxAttributes = isMdx ? (anc.attributes || []) : [];

        // Ignorer la classe 'no-typo'
        if (isElement && Array.isArray(props.className) && props.className.includes('no-typo')) {
          return true;
        }
        if (isMdx && mdxAttributes.some(attr => attr.name === 'class' && String(attr.value).split(' ').includes('no-typo'))) {
          return true;
        }

        // Ignorer si la langue spécifiée n'est pas le français
        let langValue = null;
        if (isElement && props.lang) {
          langValue = String(props.lang);
        } else if (isMdx) {
          const langAttr = mdxAttributes.find(attr => attr.name === 'lang');
          if (langAttr) langValue = String(langAttr.value);
        }

        if (langValue && !langValue.toLowerCase().startsWith('fr')) {
          return true;
        }

        return false;
      });

      if (isInsideIgnoredNode) return;

      let value = node.value;

      // A. GESTION CONTEXTUELLE DES GRANDS NOMBRES
      value = value.replace(/\b\d{4,}\b/g, (match) => {
        const numLength = match.length;
        if (isInsideTd) {
          return match.replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NBSP);
        } else {
          if (numLength > 4) {
            return match.replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NBSP);
          }
        }
        return match;
      });

      // B. RÈGLES DES UNITÉS, NOMBRES ET DEVISES
      // Espace fine insécable avant %
      value = value.replace(/(\d)\s*(%)/g, `$1${NARROW_NBSP}$2`);

      // Espace fine insécable avant les unités de mesure courantes
      value = value.replace(/(\d)\s*\b(m|cm|mm|km|g|kg|mg|t|L|V|W|kW|Hz|dB)\b/g, `$1${NARROW_NBSP}$2`);

      // Espace insécable forte avant les symboles monétaires
      value = value.replace(/(\d)\s*([€\$£¥])/g, `$1${NBSP}$2`);

      // Espace insécable forte autour du format horaire français
      value = value.replace(/(\d)\s*(h)\s*(\d+)/gi, `$1${NBSP}$2${NBSP}$3`);
      value = value.replace(/(\d)\s*(h)\b/gi, `$1${NBSP}$2`);

      // C. RÈGLES DE PONCTUATION ET CARACTÈRES STANDARDS
      // Apostrophe typographique entre deux lettres
      value = value.replace(/(\p{L})'(\p{L})/gu, '\$1’\$2');
      
      // Espace fine insécable avant ?, !, ;
      value = value.replace(/\s+([?!;])/g, `${NARROW_NBSP}$1`);
      value = value.replace(/([^.\s])([?!;])/g, `$1${NARROW_NBSP}$2`);
      
      // Espace insécable forte avant le deux-points :
      value = value.replace(/\s+(:)/g, `${NBSP}$1`);
      
      // Guillemets français « » et leurs espaces associés (fins)
      value = value.replace(/"([^"]+)"/g, `«${NARROW_NBSP}$1${NARROW_NBSP}»`);
      
      // Points de suspension
      value = value.replace(/\.{3}/g, '…');

      // SOLUTION DU BUG CLOUDFLARE : On conserve node.type = 'text' !
      node.type = 'text';
      node.value = value;
    }

    if (node.children && Array.isArray(node.children)) {
      const nextAncestors = [...ancestors, node];
      for (const child of node.children) {
        walk(child, nextAncestors);
      }
    }
  }

  return (tree) => {
    walk(tree);
  };
}
