// src/plugins/rehype-french-typo.js

export function rehypeFrenchTypography() {
  const ignoredNames = new Set([
    'code', 'pre', 'style', 'script', 'textarea', 'kbd', 'samp',
    'CodeBlock', 'TabbedCodeGroup'
  ]);

  /**
   * Fonction de parcours récursive autonome (évite les erreurs de dépendance sur Cloudflare)
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

        if (isElement && Array.isArray(props.className) && props.className.includes('no-typo')) {
          return true;
        }
        if (isMdx && mdxAttributes.some(attr => attr.name === 'class' && String(attr.value).split(' ').includes('no-typo'))) {
          return true;
        }

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

      // A. GRANDS NOMBRES
      value = value.replace(/\b\d{4,}\b/g, (match) => {
        const numLength = match.length;
        if (isInsideTd) {
          return match.replace(/\B(?=(\d{3})+(?!\d))/g, '&#8239;');
        } else {
          if (numLength > 4) {
            return match.replace(/\B(?=(\d{3})+(?!\d))/g, '&#8239;');
          }
        }
        return match;
      });

      // B. UNITÉS, POURCENTAGES, DEVISES
      value = value.replace(/(\d)\s*(%)/g, '$1&#8239;$2');
      value = value.replace(/(\d)\s*\b(m|cm|mm|km|g|kg|mg|t|L|V|W|kW|Hz|dB)\b/g, '$1&#8239;$2');
      value = value.replace(/(\d)\s*([€$£¥])/g, '$1&nbsp;$2');
      value = value.replace(/(\d)\s*(h)\s*(\d+)/gi, '$1&nbsp;$2&nbsp;$3');
      value = value.replace(/(\d)\s*(h)\b/gi, '$1&nbsp;$2');

      // C. PONCTUATION & APOSTROPHES
      value = value.replace(/(\p{L})'(\p{L})/gu, '$1’$2');
      value = value.replace(/\s+([?!;])/g, '&#8239;$1');
      value = value.replace(/([^.\s])([?!;])/g, '$1&#8239;$2');
      value = value.replace(/\s+(:)/g, '&nbsp;$1');
      value = value.replace(/"([^"]+)"/g, '«&nbsp;$1&nbsp;»');
      value = value.replace(/\.{3}/g, '…');

      node.type = 'raw';
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
