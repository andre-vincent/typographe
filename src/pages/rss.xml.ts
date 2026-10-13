import { getCollection } from "astro:content";
import { siteConfig } from "@/config/site";
import { postHref, visiblePosts } from "@/lib/posts";
import { marked } from "marked";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// Fonction pour réparer les guillemets HTML cassés par le plugin de typographie
function fixHtmlAttributes(html: string): string {
  // Cette regex cible les attributs HTML (comme href=, src=, class=) 
  // qui ont été transformés à tort avec des chevrons « » et les remet en guillemets droits " "
  return html.replace(/(href|src|class|target|alt)=\s*«\u202F?([^»]+?)\u202F?»/g, '\$1="\$2"');
}

export async function GET() {
  const posts = visiblePosts(await getCollection("posts")).slice(0, 20);

  const items = posts.map((post) => {
    const url = new URL(postHref(post), siteConfig.siteUrl).toString();
    
    // 1. Génération du HTML standard par marked
    let htmlContent = marked.parseSync(post.body || "");
    
    // 2. Correction locale pour immuniser le RSS contre le bogue du plugin typo
    htmlContent = fixHtmlAttributes(htmlContent);

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
