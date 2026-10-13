import { getCollection } from "astro:content";
import { siteConfig } from "@/config/site";
import { postHref, visiblePosts } from "@/lib/posts";
// Étape 1 : Importer le compilateur standard et officiel
import { marked } from "marked";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const posts = visiblePosts(await getCollection("posts")).slice(0, 20);

  // Étape 2 : Configurer marked pour qu'il s'exécute de manière synchrone et propre
  const items = posts.map((post) => {
    const url = new URL(postHref(post), siteConfig.siteUrl).toString();
    
    // marked.parseSync convertit instantanément le Markdown complexe en HTML parfait
    const htmlContent = marked.parseSync(post.body || "");

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
