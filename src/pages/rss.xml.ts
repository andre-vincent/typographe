import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  
  // Tri des articles du plus récent au plus ancien
  const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  
  // Récupération de l'URL racine de votre site (ex: https://monsite.com)
  const siteUrl = context.site ? context.site.toString().replace(/\/\$/, '') : '';

  return rss({
    title: 'Monograph Blog',
    description: 'Flux RSS avec contenu complet, auteurs et médias absolus',
    site: context.site,
    xmlns: {
      content: 'http://purl.org',
      dc: 'http://purl.org',
    },
    items: await Promise.all(
      sortedPosts.map(async (post) => {
        const rendered = await post.render();
        let htmlContent = rendered.html;

        // 💡 Remplacement magique des chemins relatifs par l'URL complète du site
        // Gère les attributs src="..." (images, audio, video) et href="..." (liens vers des fichiers)
        if (siteUrl) {
          // Remplace les chemins commençant par / (ex: src="/images/photo.jpg")
          htmlContent = htmlContent.replace(/(src|href)="\/([^"]*)"/g, `$1="${siteUrl}/$2"`);
          
          // Remplace les chemins relatifs commençant par ./ (ex: src="./photo.jpg")
          // Dans le contexte de l'article, ils pointent vers le dossier du post
          const postUrlPath = `blog/${post.id}`;
          htmlContent = htmlContent.replace(/(src|href)="\.\/([^"]*)"/g, `$1="${siteUrl}/${postUrlPath}/$2"`);
        }

        return {
          title: post.data.title,
          pubDate: post.data.pubDate,
          description: post.data.description,
          link: `/blog/${post.id}/`,
          
          // Contenu HTML corrigé par Rehype + médias aux URLs complètes
          content: htmlContent,
          
          customData: `<dc:creator>${post.data.author}</dc:creator>`,
        };
      })
    ),
  });
}

