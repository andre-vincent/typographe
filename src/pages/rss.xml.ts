import { getCollection } from 'astro:content';
// 💡 Importation directe d'un parseur Markdown ultra-rapide (zéro installation requise)
import { marked } from 'https://esm.sh';

export async function GET(context) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const siteUrl = context.site ? context.site.toString().replace(/\/\$/, '') : '';

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org"
  xmlns:dc="http://purl.org"
  xmlns:atom="http://w3.org">
  <channel>
    <title>Monograph Blog</title>
    <description>Flux RSS avec contenu complet et auteurs</description>
    <link>${siteUrl}/</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>fr-fr</language>`;

  for (const post of sortedPosts) {
    // 1. Extraction du corps Markdown de l'article (géré par Monograph selon sa structure)
    const markdownBody = post.body || '';
    
    // 2. Conversion forcée du Markdown (titres, tableaux, listes) en vrai HTML
    let htmlContent = await marked.parse(markdownBody);

    // 3. Transformation des URLs relatives en absolues pour les médias
    if (siteUrl) {
      htmlContent = htmlContent.replace(/(src|href)="\/([^"]*)"/g, `$1="${siteUrl}/$2"`);
      htmlContent = htmlContent.replace(/(src|href)="\.\/([^"]*)"/g, `$1="${siteUrl}/blog/${post.id}/$2"`);
    }

    // Échappement des caractères spéciaux pour le titre et la description
    const title = post.data.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const description = post.data.description.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    xml += `
    <item>
      <title>${title}</title>
      <link>${siteUrl}/blog/${post.id}/</link>
      <guid>${siteUrl}/blog/${post.id}/</guid>
      <pubDate>${new Date(post.data.pubDate).toUTCString()}</pubDate>
      <dc:creator><![CDATA[${post.data.author}]]></dc:creator>
      <description>${description}</description>
      <content:encoded><![CDATA[${htmlContent}]]></content:encoded>
    </item>`;
  }

  xml += `
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
