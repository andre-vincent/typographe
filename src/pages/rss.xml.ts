import { getCollection } from "astro:content";
import { siteConfig } from "@/config/site";
import { postHref, visiblePosts } from "@/lib/posts";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// Fonction pour corriger les attributs HTML brisés par le plugin de typographie
function fixHtmlTypography(html: string): string {
  if (!html) return "";
  // Répare les attributs HTML techniques (href, src, etc.) qui ont été convertis à tort en «...»
  return html.replace(/(href|src|class|target|alt)=\s*«\u202F?([^»]+?)\u202F?»/g, '\$1="\$2"');
}

export async function GET() {
  const posts = visiblePosts(await getCollection("posts")).slice(0, 20);

  const items = posts
    .map((post) => {
      const url = new URL(postHref(post), siteConfig.siteUrl).toString();

      // Nous utilisons le résumé textuel natif ou le corps nettoyé 
      // pour éviter l'importation de packages de compilation lourds
      const summaryContent = post.data.excerpt || "";
      
      // Si vous avez du HTML brut stocké ou généré, on le nettoie ici
      const safeHtml = fixHtmlTypography(post.body || "");

      return `<item>
  <title>${escapeXml(post.data.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <pubDate>${post.data.date.toUTCString()}</pubDate>
  <description>${escapeXml(summaryContent)}</description>
</item>`;
    })
    .join("\n");

  // Structure XML pure avec les en-têtes universels requis par Simple Newsletter
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://w3.org">
<channel>
  <title>${escapeXml(siteConfig.name)}</title>
  <link>${siteConfig.siteUrl}</link>
  <description>${escapeXml(siteConfig.description)}</description>
  <language>${escapeXml(siteConfig.language || "fr")}</language>
  <atom:link href="${new URL("rss.xml", siteConfig.siteUrl).toString()}" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>`;

  // Forcer les en-têtes HTTP de Cloudflare pour distribuer du XML valide
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff"
    },
  });
}
