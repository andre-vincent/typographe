// src/plugins/rehype-french-typo.js

export function rehypeFrenchTypography() {
  const ignoredNames = new Set([
    'code', 'pre', 'style', 'script', 'textarea', 'kbd', 'samp',
    'CodeBlock', 'TabbedCodeGroup' // Composants natifs de Monograph
  ]);

  /**
   * Fonction de parcours récursive de l'arbre HTML/MDX sans dépendance externe
   * @param {any} node 
   * @param {any[]} ancestors 
   */
  function walk(node, ancestors = []) {
    if (node.type === 'text') {
      // 1. Vérification des zones à exclure (balises, classes, langues)
      let isInsideTd = false;

      const isInsideIgnoredNode = ancestors.some((anc) => {
        const isElement = anc.type === 'element';
        const isMdx = anc.type === 'mdxJsxFlowElement' || anc.type === 'mdxJsxTextElement';

        if (!isElement && !isMdx) return false;

        const name = isElement ? anc.tagName : anc.name;
        
        // On mémorise si le texte courant se trouve dans une cellule de tableau
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

      // 2. Traitement ortho-typographique sur le texte propre
      let value = node.value;

      // A. GESTION CONTEXTUELLE DES GRANDS NOMBRES (Nouvelle section)
      // Capturer de manière sécurisée les suites de chiffres pures (exclut les dates ou codes)
      value = value.replace(/\b\d{4,}\b/g, (match) => {
        const numLength = match.length;
        
        if (isInsideTd) {
          // Dans un TD : séparation par tranches de 3 dès 4 chiffres (> 999)
          return match.replace(/\B(?=(\d{3})+(?!\d))/g, '&#8239;');
        } else {
          // Hors TD : séparation par tranches de 3 uniquement à partir de 5 chiffres (> 9999)
          if (numLength > 4) {
            return match.replace(/\B(?=(\d{3})+(?!\d))/g, '&#8239;');
          }
        }
        return match;
      });

      // B. RÈGLES DES UNITÉS, NOMBRES ET DEVISES
      // Espace fine insécable (&#8239;) avant le signe de pourcentage %
      value = value.replace(/(\d)\s*(%)/g, '$1&#8239;$2');

      // Espace fine insécable (&#8239;) avant les unités de mesure courantes (m, kg, etc.) 
      value = value.replace(/(\d)\s*\b(m|cm|mm|km|g|kg|mg|t|L|V|W|kW|Hz|dB)\b/g, '$1&#8239;$2');

      // Espace insécable forte (&nbsp;) avant les symboles monétaires (€, $, £, ¥)
      value = value.replace(/(\d)\s*([€$£¥])/g, '$1&nbsp;$2');

      // Espace insécable forte (&nbsp;) autour du format horaire français (ex: 14 h 30)
      value = value.replace(/(\d)\s*(h)\s*(\d+)/gi, '$1&nbsp;$2&nbsp;$3');
      value = value.replace(/(\d)\s*(h)\b/gi, '$1&nbsp;$2');

      // C. RÈGLES DE PONCTUATION ET CARACTÈRES STANDARDS
      // Apostrophe typographique entre deux lettres (Unicode)
      value = value.replace(/(\p{L})'(\p{L})/gu, '$1’$2');
      // Espace insécable fine (&#8239;) avant la ponctuation double ?, !, ;
      value = value.replace(/\s+([?!;])/g, '&#8239;$1');
      value = value.replace(/([^.\s])([?!;])/g, '$1&#8239;$2');
      // Espace insécable forte (&nbsp;) avant le deux-points :
      value = value.replace(/\s+(:)/g, '&nbsp;$1');
      // Guillemets français « » et leurs espaces associés
      value = value.replace(/"([^"]+)"/g, '«&nbsp;$1&nbsp;»');
      // Points de suspension
      value = value.replace(/\.{3}/g, '…');

      // Application des modifications dans l'arbre HTML
      node.type = 'raw';
      node.value = value;
    }

    // Parcours récursif des nœuds enfants
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
