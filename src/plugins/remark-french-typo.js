import { visitParents } from 'unist-util-visit-parents';
import { applyFrenchTypoRules } from '../utils/typo.js';

export function remarkFrenchTypography() {
  const ignoredMdxComponents = new Set(['CodeGroup', 'CodeGroupItem']);
  const blockTypes = new Set(['paragraph', 'heading', 'tableCell', 'blockquote', 'listItem']);
  const inlineSiblings = new Set(['inlineCode', 'strong', 'emphasis', 'link', 'delete', 'html', 'sup', 'span']);

  // Validation stricte d'un chiffre romain (1 à 3999) pour distinguer "XIXe" d'un mot comme "FIXe"
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
      let match;

      while ((match = regex.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });
        }
        parts.push({
          type: 'sup',
          data: { hName: 'sup' },
          children: [{ type: 'text', value: match }],
        });
        lastIndex = regex.lastIndex;
      }

      if (parts.length > 0) {
        if (lastIndex < node.value.length) {
          parts.push({ type: 'text', value: node.value.slice(lastIndex) });
        }
        supReplacements.push({ parent: ancestors[ancestors.length - 1], node, parts });
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

      const directParent = ancestors[ancestors.length - 1];
      if (
        directParent.type === 'link' &&
        (node.value === directParent.url || /^(https?:\/\/|www\.)/i.test(node.value.trim()))
      ) {
        return;
      }

      const isInsideTd = ancestors.some((ancestor) => ancestor.type === 'tableCell');
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

      textValue = applyFrenchTypoRules(textValue, isInsideTd);

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

    // 4. PETITES CAPITALES ET EXPOSANTS AUTOMATIQUES
    // Gère :
    // - Les chiffres romains avec ordinal collé : XIXe -> <span class="petite-capitale">XIX</span><sup>e</sup>
    // - Les chiffres romains seuls en contexte : I siècle, V République
    // - Les sigles (≥ 2 majuscules) : FTQ, CSN, UQAM -> <span class="petite-capitale">FTQ</span>
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

      const directParent = ancestors[ancestors.length - 1];
      if (
        directParent.type === 'link' &&
        (node.value === directParent.url || /^(https?:\/\/|www\.)/i.test(node.value.trim()))
      ) {
        return;
      }

      // Capture :
      // Groupe 1 & 2 : Chiffre romain + ordinal collé (ex: "XIX" et "e" dans "XIXe", ou "I" et "er" dans "Ier")
      // Groupe 3 : Chiffre romain d'une lettre suivi d'un nom contextuel (ex: "V" dans "V République")
      // Groupe 4 : Tout sigle ou chiffre romain de 2+ majuscules (ex: "FTQ", "XIV", "XXI")
      const tokenRegex =
        /(?<![A-Za-zÀ-ÿ0-9_-])(?:([IVXLCDM]+)(er|e|ème)\b|([IVXLCDM])(?=[\s\u00A0](?:siècles?|millénaires?|arrondissements?|République|Empire|chapitres?|tomes?|volumes?|actes?|scènes?)\b)|([A-ZÀ-ÖØ-Þ]{2,}))(?![A-Za-zÀ-ÿ0-9_-])/g;

      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = tokenRegex.exec(node.value)) !== null) {
        const fullMatch = match;
        const romanWithOrdinal = match;
        const ordinalSuffix = match;
        const singleRomanContext = match;
        const upperBlock = match;

        // Ignore les URLs et courriels
        const surrounding = node.value.slice(Math.max(0, match.index - 10), match.index + fullMatch.length + 10);
        if (/https?:\/\/|www\.|@/.test(surrounding)) continue;

        // Si c'est un mot majuscule suivi d'un ordinal (ex: XIXe), vérifie que c'est bien un chiffre romain valide
        if (romanWithOrdinal && !ROMAN_REGEX.test(romanWithOrdinal)) {
          continue;
        }

        if (match.index > lastIndex) {
          parts.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });
        }

        if (romanWithOrdinal && ordinalSuffix) {
          // Ex: "XIXe" -> <span class="petite-capitale">XIX</span><sup>e</sup>
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
            children: [{ type: 'text', value: ordinalSuffix }],
          });
        } else {
          // Ex: "FTQ", "XXI" (suivi de ^e^ déjà traité à l'étape 2), ou "V" (dans "V République")
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

        lastIndex = tokenRegex.lastIndex;
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
}
