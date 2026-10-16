import { getCollection, render } from 'astro:content';

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
    // 💡 Utilisation de la méthode moderne d'Astro pour appliquer vos plugins Rehype
    const rendered = await render(post);
    let htmlContent = rendered.html;

    // Transformation des URLs relatives en absolues pour les médias
    if (siteUrl) {
      htmlContent = htmlContent.replace(/(src|href)="\/([^"]*)"/g, `$1="${siteUrl}/$2"`);
      htmlContent = htmlContent.replace(/(src|href)="\.\/([^"]*)"/g, `$1="${siteUrl}/blog/${post.id}/$2"`);
    }

    // Échappement des caractères spéciaux
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
