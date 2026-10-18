/**
 * Les catégories du site. Chaque article appartient à une seule catégorie. Gardez la
 * liste courte — six ou sept est la limite pratique avant que la barre latérale ne devienne illisible.
 * Renommez ou remplacez les entrées ici, puis mettez à jour la valeur `category` dans le frontmatter
 * de chaque article pour qu'elle corresponde ; le build échouera en cas d'incohérence.
 *
 * L'ordre compte : c'est l'ordre utilisé sur l'index des catégories et dans la barre latérale d'accueil.
 */
export const categories = [
  "Politique",
  "Éducation",
  "Économie",
  "AI",
  "Design Web",
  "Typographie",
  "Mise en page"
] as const;

export type Category = (typeof categories)[number];

export const categorySlug = (category: string) =>
  category
    .toLowerCase()
    .replace(/&/g, "et")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

/** Une ligne par catégorie, affichée sur sa page d'archive et dans les listes. */
export const categoryDescriptions: Record<Category, string> = {
  "Politique": "Analyse des affaires publiques, des institutions, des gouvernances et des dynamiques citoyennes.",
  "Éducation": "Pédagogie, apprentissage, systèmes éducatifs et outils pour la transmission des savoirs.",
  "Économie": "Décryptage des marchés, des tendances financières, du commerce et des politiques monétaires.",
  "AI": "Évaluations, comportements des modèles et automatisation appliquée viable en production.",
  "Design Web": "Conception d'interfaces utilisateurs, expérience produit, ergonomie et architectures d'information.",
  "Typographie": "Lisibilité, accessibilité, règles de composition, hiérarchie, polices, etc.",
  "Mise en page": "Sémantique, intrinsèque, fluide et adaptive qui s'adapte à toute dimension d’écran.",
};
