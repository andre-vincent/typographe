export const siteConfig = {
  /** Le nom s’affiche dans l’entête  et le pied de page de toutes la pages. Logo inutile. */
  name: "Typographe",
  tagline: "Un endroit calme pour l'écriture longue et soignée en français",
  title: "Typographe - Un thème Astro minimaliste pour écrire en français",
  description:
    "Un thème Astro qui privilégie le texte d’abord pour les essais, les notes et l'écriture longue, dans une typographie soignée, avec un formulaire de recherche et un mode de lecture clair/sombre.", 
  siteUrl : "https://typographe.pages.dev",
  authorName: "André Vincent",
  email: "allo@exemple.com",
  language: "fr",
  dateLocale: "fr-CA",
  locale: "fr_CA",
  socialImage: "/og-image.png",
  /** Shown in the home sidebar "About" card. */
  about:
    "Ce site privilégie le texte d’abord et la typographie soignée pour des écrits en français. Particulièrement lorsqu'il y a quelque chose qui vaut la peine d'être dit sur des sujets précis.",
  /**
   * Les deux formulaires ci-dessous sont activés avec une `action` vide, ce qui en fait des démos entièrement interactives qui ne se soumettent nulle part : un petit script confirme la soumission et efface les champs. Collez le point de terminaison de votre fournisseur dans `action` pour envoyer de vraies soumissions, ou définissez `enabled: false` pour désactiver les contrôles purement et simplement.
   */
  newsletter: {
    enabled: true,
    action: "",
    method: "post",
    emailFieldName: "email",
    title: "Recevez les nouveaux articles par courriel",
    description: "Un courriel quand quelque chose de nouveau se passe. Pas de spam, désabonnez-vous à tout moment.",
  },
  contact: {
    enabled: true,
    action: "",
    method: "post",
    responseTime: "Les réponses sont généralement envoyées dans les deux jours ouvrables.",
  },
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "TikTok", href: "https://www.tiktok.com" },
    { label: "YouTube", href: "https://www.youtube.com" },
    { label: "RSS", href: "/rss.xml" },
  ],
};

/** Navigation d'en-tête. Ajoutez ou supprimez des entrées librement ; l'en-tête les rend dans l'ordre. */
export const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Articles", href: "/posts/" },
  { label: "Sujets", href: "/categories/" },
  { label: "À propos", href: "/about/" },
];

/** Navigation secondaire rendue dans le pied de page. */
export const footerNavigation = [
  { label: "Contact", href: "/contact/" },
  { label: "Confidentialité", href: "/privacy/" },
  { label: "RSS", href: "/rss.xml" },
];
