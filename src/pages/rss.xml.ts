import { getCollection, render } from "astro:content"; // Étape 1 : Importer 'render' ici
import { siteConfig } from "@/config/site";
import { postHref, visiblePosts } from "@/lib/posts";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const posts = visiblePosts(await getCollection("posts")).slice(0, 20);
  
  const container = await AstroContainer.create();

  const itemPromises = posts.map(async (post) => {
    const url = new URL(postHref(post), siteConfig.siteUrl).toString();
    
    // Étape 2 : Utiliser la nouvelle syntaxe globale render(post)
    const { Content } = await render(post);
    const htmlContent = await container.renderToString(Content);

    return `<item>
  <title>${escapeXml(post.data.title)}</title>
  <link>${url}</link>
  <guid>${url}</guid>
  <pubDate>${post.data.date.toUTCString()}</pubDate>
  <description>${escapeXml(post.data.excerpt)}</description>
  <content:encoded><![CDATA[${htmlContent}]]></content:encoded>
</item>`;
  });

  const itemsArray = await Promise.all(itemPromises);
  const items = itemsArray.join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org"
  xmlns:dc="http://purl.org"
>
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
