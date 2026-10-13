import { getCollection } from "astro:content";
import { siteConfig } from "@/config/site";
import { postHref, visiblePosts } from "@/lib/posts";

// Convertisseur Markdown vers HTML textuel autonome
function cleanMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";
  
  let html = String(markdown).split("\(\r\\)n").join("\n");

  // 1. Blocs de code et code en ligne
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>\$1</code></pre>");
  html = html.replace(/`([^`]+?)`/g, "<code>\$1</code>");

  // 2. Titres (H1, H2, H3)
  html = html.replace(/^### (.*?)\$/gm, "<h3>\$1</h3>");
  html = html.replace(/^## (.*?)\$/gm, "<h2>\$1</h2>");
  html = html.replace(/^# (.*?)\$/gm, "<h1>\$1</h1>");

  // 3. Formats Typographiques (Gras & Italique)
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>\$1</em></strong>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>\$1</strong>");
  html = html.replace(/__(.*?)__/g, "<strong>\$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>\$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>\$1</em>");

  // 4. Notes de bas de page [^1] et Liens [Texte](URL)
  html = html.replace(/\[\^(.*?)\]/g, "<sup>\$1</sup>");
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="\$2">\$1</a>');

  // 5. Listes à puces
  html = html.replace(/^\s*-\s+(.*?)\$/gm, "<li>\$1</li>");
  html = html.replace(/^\s*\*\s+(.*?)\$/gm, "<li>\$1</li>");

  // 6. Envelopper les blocs standards dans des paragraphes <p>
  return html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
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

// Sécurisation stricte contre les valeurs non textuelles ou absentes
const escapeXml = (value: any) =>
  String(value || "")
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

      // Rendu du texte complet de l'article
      const fullHtmlContent = cleanMarkdownToHtml(post.body || "");
      
      // Extraction et fallback de l'auteur pour parer les frontmatter vides
      const authorEmail = siteConfig.author?.email || "contact@exemple.com";
      const authorName = post.data.author || siteConfig.author?.name || siteConfig.name || "Auteur";
      const formattedAuthor = `${authorEmail} (${authorName})`;

      return `<item>
  <title>${escapeXml(post.data.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <pubDate>${post.data.date ? post.data.date.toUTCString() : new Date().toUTCString()}</pubDate>
  <dc:creator>${escapeXml(authorName)}</dc:creator>
  <author>${escapeXml(formattedAuthor)}</author>
  <description>${escapeXml(post.data.excerpt || "")}</description>
  <content:encoded><![CDATA[${fullHtmlContent}]]></content:encoded>
</item>`;
    })
    .join("\n");

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
