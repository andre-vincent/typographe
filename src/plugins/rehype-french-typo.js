import { visit } from 'unist-util-visit';

export function rehypeFrenchTypography() {
  const ignoredNames = new Set([
    'code', 'pre', 'style', 'script', 'textarea', 'kbd', 'samp',
    'CodeBlock', 'TabbedCodeGroup'
  ]);

  return (tree) => {
    // Utilisation de visit avec accès aux ancêtres (parents)
    visit(tree, 'text', (node, ancestors) => {
      if (!ancestors || ancestors.length === 0) return;

      const isInsideIgnoredNode = ancestors.some((anc) => {
        const isElement = anc.type === 'element';
        const isMdx = anc.type === 'mdxJsxFlowElement' || anc.type === 'mdxJsxTextElement';

        if (!isElement && !isMdx) return false;

        const name = isElement ? anc.tagName : anc.name;
        if (ignoredNames.has(name)) return true;

        const props = isElement ? (anc.properties || {}) : {};
        const mdxAttributes = isMdx ? (anc.attributes || []) : {};

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

      // Règles ortho-typographiques
      value = value.replace(/(\p{L})'(\p{L})/gu, '$1’$2');
      value = value.replace(/\s+([?!;])/g, '&#8239;$1');
      value = value.replace(/([^.\s])([?!;])/g, '$1&#8239;$2');
      value = value.replace(/\s+(:)/g, '&nbsp;$1');
      value = value.replace(/"([^"]+)"/g, '«&nbsp;$1&nbsp;»');
      value = value.replace(/\.{3}/g, '…');

      node.type = 'raw';
      node.value = value;
    });
  };
}
