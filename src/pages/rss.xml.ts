import { getCollection } from "astro:content";
import { siteConfig } from "@/config/site";
import { postHref, visiblePosts } from "@/lib/posts";
// Étape 1 : Importer la fonction d'Astro pour compiler le Markdown en HTML
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
  
  // Initialisation du container Astro pour faire le rendu des composants/markdown
  const container = await AstroContainer.create();

  // Étape 2 : Utiliser Promise.all car la compilation HTML est asynchrone (async/await)
  const itemPromises = posts.map(async (post) => {
    const url = new URL(postHref(post), siteConfig.siteUrl).toString();
    
    // Compilation du contenu Markdown de l'article en HTML propre
    const { Content } = await post.render();
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

  // Étape 3 : Ajouter les espaces de noms (namespaces) requis pour le content:encoded dans la balise <rss>
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
