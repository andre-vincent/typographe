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
  "Design Web",
  "Typographie",
  "Coups de gueule",
  "Notes de lecture"
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
  "Design Web": "Éco-conception d'interfaces utilisateurs, ergonomie de navigation et architectures d'information. Conception intrinsèque, accessible, sémantique, fluide et adaptive",
  "Typographie": "Lisibilité, accessibilité, règles de composition, hiérarchie, rhytme, polices de caractères, etc.",
  "Coups de gueule": "Parfois aussi des Coups de cœur. Souvent des auteurs ou des autrices dont j’admire les propos et que je me permet d’inviter sans leur permission.",
    "Notes de lecture": "Commentaires et critiques de livres et articles qui méritent qu’on s’y intéresse. Souvent par des auteurs ou des autrices dont j’admire les propos ou le style et que je me permet d’inviter ici sans leur permission."
};
