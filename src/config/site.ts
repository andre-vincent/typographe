export const siteConfig = {
  /** Wordmark shown in the header and footer. Monograph uses text, never a logo image. */
  name: "Typographe",
  tagline: "Un endroit calme pour l'écriture longue et soignée en français",
  title: "Typographe - Un thème Astro minimaliste pour écrire en français",
  description:
    "Un thème Astro qui privilégie le texte d’abord pour les essais, les notes et l'écriture longue, avec une recherche de palette de commandes et un mode de lecture clair/sombre.", 
  siteUrl : "https://typographe.pages.dev",
  authorName: "André Vincent",
  email: "allo@exemple.com",
  language: "fr",
  dateLocale: "fr-CA",
  locale: "fr_CA",
  socialImage: "/og-image.png",
  /** Shown in the home sidebar "About" card. */
  about:
    "Typographe privilégie le texte d’abord. Notes sur la création de logiciels, publiées lorsqu'il y a quelque chose qui vaut la peine d'être dit.",
  /**
   * Both forms below ship enabled with an empty `action`, which makes them fully
   * interactive demos that submit nowhere: a small script confirms the submit
   * and clears the fields. Paste your provider's endpoint into `action` to send
   * real submissions, or set `enabled: false` to disable the controls outright.
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
    responseTime: "Les réponses sont généralement données dans les deux jours ouvrables.",
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
