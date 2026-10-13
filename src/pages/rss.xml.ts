import { getCollection } from "astro:content";
import { siteConfig } from "@/config/site";
import { postHref, visiblePosts } from "@/lib/posts";

// Fonction ultra-légère pour convertir le Markdown de base en HTML propre
// sans dépendre d'Astro ni d'un package npm externe
function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";
  let html = markdown;

  // Échapper les caractères XML de base dans le texte
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Rendu des Titres (## ou ###)
  html = html.replace(/^### (.*\$)/gim, '<h3>\$1</h3>');
  html = html.replace(/^## (.*\$)/gim, '<h2>\$1</h2>');
  html = html.replace(/^# (.*\$)/gim, '<h1>\$1</h1>');

  // Rendu du Gras (**texte**) et de l'Italique (*texte*)
  html = html.replace(/\*\*(.*)\*\*/gim, '<strong>\$1</strong>');
  html = html.replace(/\*(.*)\*/gim, '<em>\$1</em>');

  // Rendu des Liens [texte](url)
  html = html.replace(/\[(.*?)\](.*?)/gim, '<a href="\$2">\$1</a>');

  // Rendu des Listes à puces (- élément ou * élément)
  html = html.replace(/^\s*-\s+(.*)\$/gim, '<li>\$1</li>');
  html = html.replace(/^\s*\*\s+(.*)\$/gim, '<li>\$1</li>');
  
  // Rendu des paragraphes simples (double saut de ligne)
  html = html.split(/\n\s*\n/).map(p => {
    if (p.trim().startsWith('<h') || p.trim().startsWith('<li')) return p;
    return `<p>${p.trim()}</p>`;
  }).join('\n');

  return html;
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

  const items = posts.map((post) => {
    const url = new URL(postHref(post), siteConfig.siteUrl).toString();
    
    // On convertit le body Markdown brut en HTML via notre fonction isolée
    const htmlContent = parseMarkdownToHtml(post.body || "");

    return `<item>
  <title>${escapeXml(post.data.title)}</title>
  <link>${url}</link>
  <guid>${url}</guid>
  <pubDate>${post.data.date.toUTCString()}</pubDate>
  <description>${escapeXml(post.data.excerpt)}</description>
  <content:encoded><![CDATA[${htmlContent}]]></content:encoded>
</item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org">
<channel>
  <title>${escapeXml(siteConfig.name)}</title>
  <link>${siteConfig.siteUrl}</link>
  <description>${escapeXml(siteConfig.description)}</description>
  <language>${escapeXml(siteConfig.language)}</language>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
