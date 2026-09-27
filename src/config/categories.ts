/**
 * The site's categories. Every post belongs to exactly one of these, so keep the
 * list short — six is the practical ceiling before the sidebar stops reading as
 * a menu. Rename or replace entries here, then update the `category` value in
 * each post's frontmatter to match; the build fails on any mismatch.
 *
 * Order matters: it is the order used on the categories index and in the home
 * sidebar.
 */
export const categories = [
  "Engineering",
  "Reliability",
  "Cloud",
  "Security",
  "AI",
  "Design Systems",
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
  Engineering: "Contracts, tooling, and the day-to-day craft of shipping software.",
  Reliability: "Incidents, observability, and the habits that keep systems honest.",
  Cloud: "Infrastructure, cost, and deploy pipelines that stay out of the way.",
  Security: "Authentication, privacy, and threat work explained for product teams.",
  AI: "Evaluations, model behavior, and applied automation that holds up in production.",
  "Design Systems": "Tokens, components, and the systems work that keeps interfaces coherent.",
  "Typographie": "Lisibilité, accessibilité, règles de composition, hiérarchie, polices, etc.",
  "Mise en page": "Sémantique, intrinsèque, fluide et adaptive qui s'adapte à toute dimension d’écran.",
};
