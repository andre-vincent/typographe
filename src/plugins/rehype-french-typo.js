// src/plugins/rehype-french-typo.js

export function rehypeFrenchTypography() {
  const ignoredNames = new Set([
    'code', 'pre', 'style', 'script', 'textarea', 'kbd', 'samp',
    'CodeBlock', 'TabbedCodeGroup' // Composants natifs de Monograph
  ]);

  const NARROW_NBSP = '\u202F'; // Espace fine insécable
  const NBSP = '\u00A0';        // Espace forte insécable

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
        if (name === 'td') isInsideTd = true;
        if (ignoredNames.has(name)) return true;

        const props = isElement ? (anc.properties || {}) : {};
        const mdxAttributes = isMdx ? (anc.attributes || []) : [];

        if (isElement && Array.isArray(props.className) && props.className.includes('no-typo')) return true;
        if (isMdx && mdxAttributes.some(attr => attr.name === 'class' && String(attr.value).split(' ').includes('no-typo'))) return true;

        let langValue = null;
        if (isElement && props.lang) langValue = String(props.lang);
        else if (isMdx) {
          const langAttr = mdxAttributes.find(attr => attr.name === 'lang');
          if (langAttr) langValue = String(langAttr.value);
        }

        if (langValue && !langValue.toLowerCase().startsWith('fr')) return true;

        return false;
      });

      if (isInsideIgnoredNode) return;

      let value = node.value;

      // ==========================================
      // NETTOYAGE ET CORRECTIONS CHIRURGICALES
      // ==========================================

      // A. Ponctualité Haute (?, !, ;) -> Remplacement global de toute espace existante (\s*)
      // Nettoie l'absence d'espace ("Quoi?") et écrase les espaces incorrectes ("Quoi  ?") par une espace fine insécable
      value = value.replace(/([^.\s\p{P}])\s*([?!;])/gu, `$1${NARROW_NBSP}$2`);

      // B. Le Deux-points (:) -> Remplacement global (\s*) par une espace forte insécable
      value = value.replace(/([^.\s\p{P}])\s*(:)/gu, `$1${NBSP}$2`);

      // C. Guillemets français (« ») -> Capture le texte et écrase impitoyablement les espaces internes incorrectes
      // Corrige : "test", «test», «  test  » ou «&nbsp;test» en plaçant systématiquement une espace fine insécable
      value = value.replace(/"\s*([^"]+?)\s*"/g, `«${NARROW_NBSP}$1${NARROW_NBSP}»`);
      value = value.replace(/«\s*([^»]+?)\s*»/g, `«${NARROW_NBSP}$1${NARROW_NBSP}»`);

      // D. Grands Nombres (Contextuel TD)
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

      // E. Unités, Pourcentages, Devises & Horaires
      value = value.replace(/(\d)\s*(%)/g, `$1${NARROW_NBSP}$2`);
      value = value.replace(/(\d)\s*\b(m|cm|mm|km|g|kg|mg|t|L|V|W|kW|Hz|dB)\b/g, `$1${NARROW_NBSP}$2`);
      value = value.replace(/(\d)\s*([€\$£¥])/g, `$1${NBSP}$2`);
      value = value.replace(/(\d)\s*(h)\s*(\d+)/gi, `$1${NBSP}$2${NBSP}$3`);
      value = value.replace(/(\d)\s*(h)\b/gi, `$1${NBSP}$2`);

      // F. Apostrophes & Éléments de structure
      value = value.replace(/(\p{L})'(\p{L})/gu, '\$1’\$2');
      value = value.replace(/\.{3}/g, '…');

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
