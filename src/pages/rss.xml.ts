import { getCollection } from "astro:content";
import { siteConfig } from "@/config/site";
import { postHref, visiblePosts } from "@/lib/posts";

function cleanMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";
  let html = String(markdown).split("\(\r\\)n").join("\n");

  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>\$1</code></pre>");
  html = html.replace(/`([^`]+?)`/g, "<code>\$1</code>");
  html = html.replace(/^### (.*?)\$/gm, "<h3>\$1</h3>");
  html = html.replace(/^## (.*?)\$/gm, "<h2>\$1</h2>");
  html = html.replace(/^# (.*?)\$/gm, "<h1>\$1</h1>");
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>\$1</em></strong>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>\$1</strong>");
  html = html.replace(/__(.*?)__/g, "<strong>\$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>\$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>\$1</em>");
  html = html.replace(/\[\^(.*?)\]/g, "<sup>\$1</sup>");
  html = html.replace(/\[(.*?)\](.*?)/g, '<a href="\$2">\$1</a>');
  html = html.replace(/^\s*-\s+(.*?)\$/gm, "<li>\$1</li>");
  html = html.replace(/^\s*\*\s+(.*?)\$/gm, "<li>\$1</li>");

  // Prise en charge basique des tableaux Markdown pour éviter le rendu brut
  if (html.includes("|")) {
    html = html.replace(/^\|(.+)\|\$/gm, (_, content) => {
      const cells = content.split("|").map((c: string) => `<td>${c.trim()}</td>`).join("");
      return `<tr>${cells}</tr>`;
    });
    // Encapsulation naïve des lignes de tableau trouvées successives
    html = html.replace(/(<tr>.*<\/tr>)+/g, "<table><tbody>\$&</tbody></table>");
    // Nettoyage des lignes de séparation (| :--- |)
    html = html.replace(/<table><tbody><tr>(<td>-+:?<\/td>)+<\/tr>/g, "<table><tbody>");
  }

  return html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") || 
        trimmed.startsWith("<li") || 
        trimmed.startsWith("<pre") || 
        trimmed.startsWith("<p") ||
        trimmed.startsWith("<table")
      ) {
        return trimmed;
      }
      return `<p>${trimmed}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

const escapeXml = (value: any) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const posts = visiblePosts(await getCollection("posts")).slice(0, 20);
  const siteUrl = siteConfig.siteUrl ? siteConfig.siteUrl.toString().replace(/\/\$/, "") : "";

  const items = posts
    .map((post) => {
      const url = new URL(postHref(post), siteConfig.siteUrl).toString();
      let fullHtmlContent = cleanMarkdownToHtml(post.body || "");
      
      // 💡 Forcer les images et autres médias à utiliser l'URL absolue du site
      if (siteUrl) {
        fullHtmlContent = fullHtmlContent.replace(/(src|href)="\/([^"]*)"/g, `$1="${siteUrl}/$2"`);
        fullHtmlContent = fullHtmlContent.replace(/(src|href)="\.\/([^"]*)"/g, `$1="${url}/$2"`);
      }

      let authorName = "";

      if (post.data.author) {
        if (typeof post.data.author === "string") {
          authorName = post.data.author;
        } else if (typeof post.data.author === "object") {
          authorName = post.data.author.name || post.data.author.id || post.data.author.slug || "";
        }
      }

      if (!authorName) {
        authorName = siteConfig.author?.name || siteConfig.name || "Rédacteur";
      }

      return `<item>
  <title>${escapeXml(post.data.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <pubDate>${post.data.date ? post.data.date.toUTCString() : new Date().toUTCString()}</pubDate>
  <dc:creator>${escapeXml(authorName)}</dc:creator>
  <description>${escapeXml(post.data.excerpt || "")}</description>
  <content:encoded><![CDATA[${fullHtmlContent}]]></content:encoded>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
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
