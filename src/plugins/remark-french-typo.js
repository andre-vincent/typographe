import { visitParents } from 'unist-util-visit-parents';
import { applyFrenchTypoRules } from '../utils/typo.js';

export function remarkFrenchTypography() {
  const ignoredMdxComponents = new Set(['CodeGroup', 'CodeGroupItem']);
  const blockTypes = new Set(['paragraph', 'heading', 'tableCell', 'blockquote', 'listItem']);
  const inlineSiblings = new Set(['inlineCode', 'strong', 'emphasis', 'link', 'delete', 'html']);

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

    // Suivi de l'état d'ouverture/fermeture des guillemets droits par bloc conteneur
    const quoteStateByBlock = new WeakMap();

    // 2. CORPS DU TEXTE (inspection de toute la chaîne d'ancêtres)
    visitParents(tree, 'text', (node, ancestors) => {
      if (!ancestors || ancestors.length === 0) return;

      // Ignore les composants MDX dédiés au code
      const isInsideIgnoredComponent = ancestors.some(
        (ancestor) =>
          (ancestor.type === 'mdxJsxFlowElement' || ancestor.type === 'mdxJsxTextElement') &&
          ignoredMdxComponents.has(ancestor.name)
      );
      if (isInsideIgnoredComponent) return;

      // Ignore le texte brut d'une URL (ex: <https://site.fr> ou [www.site.fr](...))
      const directParent = ancestors[ancestors.length - 1];
      if (
        directParent.type === 'link' &&
        (node.value === directParent.url || /^(https?:\/\/|www\.)/i.test(node.value.trim()))
      ) {
        return;
      }

      // Détecte si le texte se trouve dans une cellule de tableau (même imbriqué dans du gras/italique)
      const isInsideTd = ancestors.some((ancestor) => ancestor.type === 'tableCell');

      // Récupère le bloc conteneur le plus proche pour suivre l'état des guillemets droits
      const currentBlock = [...ancestors].reverse().find((ancestor) => blockTypes.has(ancestor.type));
      let textValue = node.value;

      // Conversion uniquement des guillemets droits (") en chevrons français (« »)
      // Préserve les guillemets anglais (“ ”) et les balises <q> pour le 2e niveau
      if (currentBlock && textValue.includes('"')) {
        let isOpen = quoteStateByBlock.get(currentBlock) || false;
        textValue = textValue.replace(/"/g, () => {
          isOpen = !isOpen;
          return isOpen ? '«' : '»';
        });
        quoteStateByBlock.set(currentBlock, isOpen);
      }

      // Application des règles typographiques centrales (typo.js)
      textValue = applyFrenchTypoRules(textValue, isInsideTd);

      // Raccordement des ponctuations hautes et guillemets fermants juste après un élément inline
      // (ex: **Pourquoi** ?, `U+202F` :, <sup>e</sup> ?, <q>citation</q> »)
      if (directParent && Array.isArray(directParent.children)) {
        const nodeIndex = directParent.children.indexOf(node);
        const prevSibling = nodeIndex > 0 ? directParent.children[nodeIndex - 1] : null;

        if (prevSibling && inlineSiblings.has(prevSibling.type)) {
          textValue = textValue
            .replace(/^[\s\u00A0\u202F]*([?!;»])/, '\u202F$1')
            .replace(/^[\s\u00A0\u202F]*:(?!\/\/)/, '\u00A0:');
        }
      }

      node.value = textValue;
    });
  };
}
