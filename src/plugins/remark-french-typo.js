import { visitParents } from 'unist-util-visit-parents';
import { applyFrenchTypoRules } from '../utils/typo.js';

export function remarkFrenchTypography() {
  const ignoredMdxComponents = new Set(['CodeGroup', 'CodeGroupItem']);
  const blockTypes = new Set(['paragraph', 'heading', 'tableCell', 'blockquote', 'listItem']);
  const inlineSiblings = new Set(['inlineCode', 'strong', 'emphasis', 'link', 'delete', 'html', 'sup', 'span']);

  // Validation stricte d'un chiffre romain (1 à 3999)
  const ROMAN_REGEX = /^(?=[IVXLCDM]+$)M{0,3}(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3})$/;

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

    // 2. RACCOURCI MANUEL ^er^ -> <sup>er</sup>
    const supReplacements = [];

    visitParents(tree, 'text', (node, ancestors) => {
      if (!node.value.includes('^')) return;

      const isIgnored = ancestors.some(
        (a) =>
          a.type === 'code' ||
          a.type === 'inlineCode' ||
          a.type === 'sup' ||
          ((a.type === 'mdxJsxFlowElement' || a.type === 'mdxJsxTextElement') &&
            ignoredMdxComponents.has(a.name))
      );
      if (isIgnored) return;

      const regex = /\^([^\s^][^^]*?)\^/g;
      const parts = [];
      let lastIndex = 0;

      for (const match of node.value.matchAll(regex)) {
        const [fullMatch, supContent] = match;
        if (match.index > lastIndex) {
          parts.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });
        }
        parts.push({
          type: 'sup',
          data: { hName: 'sup' },
          children: [{ type: 'text', value: supContent }],
        });
        lastIndex = match.index + fullMatch.length;
      }

      if (parts.length > 0) {
        if (lastIndex < node.value.length) {
          parts.push({ type: 'text', value: node.value.slice(lastIndex) });
        }
        supReplacements.push({ parent: ancestors.at(-1), node, parts });
      }
    });

    for (const { parent, node, parts } of supReplacements) {
      const index = parent.children.indexOf(node);
      if (index !== -1) {
        parent.children.splice(index, 1, ...parts);
      }
    }

// 3. RÈGLES TYPOGRAPHIQUES DU CORPS DU TEXTE
    const quoteStateByBlock = new WeakMap();

    visitParents(tree, 'text', (node, ancestors) => {
      if (!ancestors || ancestors.length === 0) return;

      const isInsideIgnoredComponent = ancestors.some(
        (ancestor) =>
          (ancestor.type === 'mdxJsxFlowElement' || ancestor.type === 'mdxJsxTextElement') &&
          ignoredMdxComponents.has(ancestor.name)
      );
      if (isInsideIgnoredComponent) return;

      const directParent = ancestors.at(-1);
      if (
        directParent.type === 'link' &&
        (node.value === directParent.url || /^(https?:\/\/|www\.)/i.test(node.value.trim()))
      ) {
        return;
      }

      // 1. Déclarations en premier
      const currentBlock = [...ancestors].reverse().find((ancestor) => blockTypes.has(ancestor.type));
      const isInsideTd = ancestors.some((ancestor) => ancestor.type === 'tableCell');
      let textValue = node.value;

      // 2. Conversion des guillemets droits en chevrons français avant les règles d'espacement
      if (currentBlock && textValue.includes('"')) {
        let isOpen = quoteStateByBlock.get(currentBlock) || false;
        textValue = textValue.replace(/"/g, () => {
          isOpen = !isOpen;
          return isOpen ? '«' : '»';
        });
        quoteStateByBlock.set(currentBlock, isOpen);
      }

      // 3. Détection du début de bloc et application unique des règles typographiques
      const isStartOfBlock = Boolean(
        currentBlock &&
        Array.isArray(currentBlock.children) &&
        currentBlock.children[0] === node
      );

      textValue = applyFrenchTypoRules(textValue, isInsideTd, isStartOfBlock);

      if (directParent && Array.isArray(directParent.children)) {
        const nodeIndex = directParent.children.indexOf(node);
        const prevSibling = nodeIndex > 0 ? directParent.children.at(nodeIndex - 1) : null;

        if (prevSibling && inlineSiblings.has(prevSibling.type)) {
          textValue = textValue
            .replace(/^[\s\u00A0\u202F]*([?!;»])/, '\u202F$1')
            .replace(/^[\s\u00A0\u202F]*:(?!\/\/)/, '\u00A0:');
        }
      }

      node.value = textValue;
    });

    // 4. PETITES CAPITALES ET EXPOSANTS AUTOMATIQUES
    const scReplacements = [];

    visitParents(tree, 'text', (node, ancestors) => {
      if (!ancestors || ancestors.length === 0) return;

      const isIgnored = ancestors.some(
        (a) =>
          a.type === 'code' ||
          a.type === 'inlineCode' ||
          a.type === 'heading' ||
          a.type === 'span' ||
          a.type === 'sup' ||
          ((a.type === 'mdxJsxFlowElement' || a.type === 'mdxJsxTextElement') &&
            ignoredMdxComponents.has(a.name))
      );
      if (isIgnored) return;

      const directParent = ancestors.at(-1);
      if (
        directParent.type === 'link' &&
        (node.value === directParent.url || /^(https?:\/\/|www\.)/i.test(node.value.trim()))
      ) {
        return;
      }

      // Exclut explicitement l'article "Le" via (?!Le\b)
      // Prend en charge :
      // 1. Ordinaux romains : ([IVXLCDM]+)(er|re|res|e|es|ème|èmes)
      // 2. Ordinaux arabes : (\d+)(er|re|res|e|es|ème|èmes)
      // 3. Chiffres romains isolés suivis d'un nom d'unité éditoriale/historique
      // 4. Sigles/acronymes en capitales de 2 lettres ou plus
      // Exclut explicitement les articles, pronoms et prépositions courants (Le, Les, De, Des, Ce, Ces, Me, Mes, Ve)
    const tokenRegex =
      /(?<![A-Za-zÀ-ÿ0-9_-])(?!(?:Le|Les|De|Des|Ce|Ces|Me|Mes|Ve)\b)(?:([IVXLCDM]+)(er|re|res|e|es|ème|èmes)\b|(\d+)(er|re|res|e|es|ème|èmes)\b|([IVXLCDM])(?=[\s\u00A0](?:siècles?|millénaires?|arrondissements?|République|Empire|chapitres?|tomes?|volumes?|actes?|scènes?)\b)|([A-ZÀ-ÖØ-Þ]{2,}))(?![A-Za-zÀ-ÿ0-9_-])/g;

      const parts = [];
      let lastIndex = 0;

      for (const match of node.value.matchAll(tokenRegex)) {
        const [
          fullMatch,
          romanWithOrdinal,
          romanOrdinalSuffix,
          arabicWithOrdinal,
          arabicOrdinalSuffix,
          singleRomanContext,
          upperBlock,
        ] = match;

        // Ignore les URLs et courriels
        const surrounding = node.value.slice(Math.max(0, match.index - 10), match.index + fullMatch.length + 10);
        if (/https?:\/\/|www\.|@/.test(surrounding)) continue;

        // Vérifie que le préfixe d'un ordinal romain est bien un chiffre romain valide
        if (romanWithOrdinal && !ROMAN_REGEX.test(romanWithOrdinal)) {
          continue;
        }

        // Validation cohérente des ordinaux arabes :
        // "er", "re", "res" ne s'appliquent qu'à "1" (ex. 1er, 1re, 1res)
        if (
          arabicWithOrdinal &&
          /^(?:er|re|res)$/.test(arabicOrdinalSuffix) &&
          arabicWithOrdinal !== '1'
        ) {
          continue;
        }

        if (match.index > lastIndex) {
          parts.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });
        }

        if (romanWithOrdinal && romanOrdinalSuffix) {
          parts.push({
            type: 'span',
            data: {
              hName: 'span',
              hProperties: { className: ['petite-capitale'] },
            },
            children: [{ type: 'text', value: romanWithOrdinal }],
          });
          parts.push({
            type: 'sup',
            data: { hName: 'sup' },
            children: [{ type: 'text', value: romanOrdinalSuffix }],
          });
        } else if (arabicWithOrdinal && arabicOrdinalSuffix) {
          parts.push({
            type: 'text',
            value: arabicWithOrdinal,
          });
          parts.push({
            type: 'sup',
            data: { hName: 'sup' },
            children: [{ type: 'text', value: arabicOrdinalSuffix }],
          });
        } else {
          const targetWord = singleRomanContext || upperBlock;
          parts.push({
            type: 'span',
            data: {
              hName: 'span',
              hProperties: { className: ['petite-capitale'] },
            },
            children: [{ type: 'text', value: targetWord }],
          });
        }

        lastIndex = match.index + fullMatch.length;
      }

      if (parts.length > 0) {
        if (lastIndex < node.value.length) {
          parts.push({ type: 'text', value: node.value.slice(lastIndex) });
        }
        scReplacements.push({ parent: directParent, node, parts });
      }
    });

    for (const { parent, node, parts } of scReplacements) {
      const index = parent.children.indexOf(node);
      if (index !== -1) {
        parent.children.splice(index, 1, ...parts);
      }
    }
  };

    // 5. ATTRIBUTION DES CITATIONS (> — Auteur, *Œuvre* -> <footer>— Auteur, <cite>Œuvre</cite></footer>)
    visitParents(tree, 'blockquote', (blockquoteNode) => {
      if (!Array.isArray(blockquoteNode.children) || blockquoteNode.children.length === 0) return;

      const lastChild = blockquoteNode.children.at(-1);

      if (lastChild && lastChild.type === 'paragraph' && Array.isArray(lastChild.children) && lastChild.children.length > 0) {
        const firstInline = lastChild.children;

        if (firstInline.type === 'text' && /^—[\s\u00A0\u202F]/.test(firstInline.value)) {
          lastChild.data = {
            ...lastChild.data,
            hName: 'footer',
          };

          // Convertit tous les italiques (*Œuvre*) en <cite>, même imbriqués dans un lien [ *Œuvre* ](url)
          visitParents(lastChild, 'emphasis', (emNode) => {
            emNode.data = {
              ...emNode.data,
              hName: 'cite',
            };
          });
        }
      }
    });
}

