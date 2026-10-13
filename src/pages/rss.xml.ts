import { getCollection } from "astro:content";
import { siteConfig } from "@/config/site";
import { postHref, visiblePosts } from "@/lib/posts";

// Fonction isolée et robuste pour compiler le Markdown en HTML propre
// Spécialement conçue pour contourner le bogue de typographie des guillemets
function inlineMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";
  
  // Remplacement des sauts de ligne Windows pour uniformiser
  let html = markdown.replace(\(/\r\\)n/g, "\n");

  // 1. Protection des blocs de code
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>\$1</code></pre>");
  html = html.replace(/`([^`]+?)`/g, "<code>\$1</code>");

  // 2. Traitement chirurgical des titres (début de ligne)
  html = html.replace(/^### (.*?)\$/gm, "<h3>\$1</h3>");
  html = html.replace(/^## (.*?)\$/gm, "<h2>\$1</h2>");
  html = html.replace(/^# (.*?)\$/gm, "<h1>\$1</h1>");

  // 3. Traitement des styles inline (Gras, Italique, Notes)
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>\$1</em></strong>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>\$1</strong>");
  html = html.replace(/__(.*?)__/g, "<strong>\$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>\$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>\$1</em>");

  // 4. Traitement des notes de bas de page [^1]
  html = html.replace(/\[\^(.*?)\]/g, "<sup>\$1</sup>");

  // 5. Traitement sécurisé des liens [texte](url)
  // Utilise délibérément des guillemets doubles stricts qui résistent aux regex globales
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="\$2">\$1</a>');

  // 6. Traitement des listes à puces simples
  html = html.replace(/^\s*-\s+(.*?)\$/gm, "<li>\$1</li>");
  html = html.replace(/^\s*\*\s+(.*?)\$/gm, "<li>\$1</li>");

  // 7. Découpage et structuration saine en paragraphes <p>
  return html
    .split(/\n\s*\n/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      // Si le bloc est déjà une balise de structure, on le laisse tel quel
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<li") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<p")
      ) {
        return trimmed;
      }
      return `<p>${trimmed}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const posts = visiblePosts(await getCollection("posts")).slice(0, 20);

  const items = posts
    .map((post) => {
      const url = new URL(postHref(post), siteConfig.siteUrl).toString();

      // 1. Conversion du contenu complet (Markdown -> HTML)
      const fullHtmlContent = inlineMarkdownToHtml(post.body || "");
      
      // 2. Extraction de l'auteur (dynamique selon le frontmatter de votre thème ou la configuration globale)
      const authorEmail = siteConfig.author?.email || "contact@exemple.com";
      const authorName = post.data.author || siteConfig.author?.name || siteConfig.name;
      const formattedAuthor = `${authorEmail} (${authorName})`;

      return `<item>
  <title>${escapeXml(post.data.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <pubDate>${post.data.date.toUTCString()}</pubDate>
  <dc:creator>${escapeXml(authorName)}</dc:creator>
  <author>${escapeXml(formattedAuthor)}</author>
  <description>${escapeXml(post.data.excerpt || "")}</description>
  <content:encoded><![CDATA[${fullHtmlContent}]]></content:encoded>
</item>`;
    })
    .join("\n");

  // Déclaration des namespaces indispensables (content et dc) au sommet du XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org"
  xmlns:dc="http://purl.org"
  xmlns:atom="http://w3.org"
>
<channel>
  <title>${escapeXml(siteConfig.name)}</title>
  <link>${siteConfig.siteUrl}</link>
  <description>${escapeXml(siteConfig.description)}</description>
  <language>${escapeXml(siteConfig.language || "fr")}</language>
  <atom:link href="${new URL("rss.xml", siteConfig.siteUrl).toString()}" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff"
    },
  });
}
