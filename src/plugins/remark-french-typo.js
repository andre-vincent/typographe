import { visitParents } from 'unist-util-visit-parents';
import { applyFrenchTypoRules } from '../utils/typo.js';

export function remarkFrenchTypography() {
  const ignoredMdxComponents = new Set(['CodeGroup', 'CodeGroupItem']);
  const blockTypes = new Set(['paragraph', 'heading', 'tableCell', 'blockquote']);

  return (tree, file) => {
    // 1. FRONTMATTER (title et excerpt)
    const frontmatter = file.data.astro?.frontmatter;
    if (frontmatter) {
      if (frontmatter.title) {
        frontmatter.title = applyFrenchTypoRules(frontmatter.title);
      }
      if (frontmatter.excerpt) {
        frontmatter.excerpt = applyFrenchTypoRules(frontmatter.excerpt);
      }
    }

    // Suivi de l'état des guillemets droits par bloc parent (gère le gras/italique imbriqué)
    const quoteStateByBlock = new WeakMap();

    // 2. CORPS DU TEXTE (avec inspection de toute la chaîne d'ancêtres)
    visitParents(tree, 'text', (node, ancestors) => {
      if (!ancestors || ancestors.length === 0) return;

      // Vérifie si l'un des ancêtres est un composant MDX ignoré
      const isInsideIgnoredComponent = ancestors.some(
        (ancestor) =>
          (ancestor.type === 'mdxJsxFlowElement' || ancestor.type === 'mdxJsxTextElement') &&
          ignoredMdxComponents.has(ancestor.name)
      );
      if (isInsideIgnoredComponent) return;

      // Vérifie si le texte est le libellé brut d'une URL (ex: <https://site.fr>)
      const directParent = ancestors[ancestors.length - 1];
      if (directParent.type === 'link' && node.value === directParent.url) {
        return;
      }

      // Vérifie si l'un des ancêtres est une cellule de tableau (même si le texte est en gras/italique)
      const isInsideTd = ancestors.some((ancestor) => ancestor.type === 'tableCell');

      // Récupère le bloc conteneur le plus proche pour suivre l'ouverture/fermeture des guillemets "
      const currentBlock = [...ancestors].reverse().find((ancestor) => blockTypes.has(ancestor.type));
      let textValue = node.value;

      if (currentBlock && textValue.includes('"')) {
        let isOpen = quoteStateByBlock.get(currentBlock) || false;
        textValue = textValue.replace(/"/g, () => {
          isOpen = !isOpen;
          return isOpen ? '«' : '»';
        });
        quoteStateByBlock.set(currentBlock, isOpen);
      }

      // Appel de la fonction centrale
      node.value = applyFrenchTypoRules(textValue, isInsideTd);
    });
  };
}
