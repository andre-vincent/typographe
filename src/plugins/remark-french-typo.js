import { visit } from 'unist-util-visit';
import { applyFrenchTypoRules } from '../utils/typo.js'; // 👈 Import de la fonction centrale

export function remarkFrenchTypography() {
  const ignoredMdxComponents = new Set(['CodeGroup', 'CodeGroupItem']);

  return (tree, file) => {
    // 1. FRONTMATTER (title et excerpt)
    const frontmatter = file.data.astro?.frontmatter;
    if (frontmatter) {
      if (frontmatter.title) frontmatter.title = applyFrenchTypoRules(frontmatter.title);
      if (frontmatter.excerpt) frontmatter.excerpt = applyFrenchTypoRules(frontmatter.excerpt);
    }

    // 2. CORPS DU TEXTE
    visit(tree, 'text', (node, index, parent) => {
      if (!parent) return;

      if (
        (parent.type === 'mdxJsxFlowElement' || parent.type === 'mdxJsxTextElement') &&
        ignoredMdxComponents.has(parent.name)
      ) {
        return;
      }

      const isInsideTd = parent.type === 'tableCell';
      
      // Appel de la fonction centrale
      node.value = applyFrenchTypoRules(node.value, isInsideTd);
    });
  };
}
