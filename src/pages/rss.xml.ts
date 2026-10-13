import rss from "@astrojs/rss"; // Utilisation du module officiel d'Astro
import { getCollection, render } from "astro:content";
import { siteConfig } from "@/config/site";
import { postHref, visiblePosts } from "@/lib/posts";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";

export async function GET() {
  const posts = visiblePosts(await getCollection("posts")).slice(0, 20);
  
  // Configuration propre du conteneur de rendu Astro
  const renderers = await loadRenderers();
  const container = await AstroContainer.create({ renderers });

  const items = await Promise.all(
    posts.map(async (post) => {
      const url = new URL(postHref(post), siteConfig.siteUrl).toString();
      
      // Extraction du contenu HTML de l'article de façon isolée
      const { Content } = await render(post);
      const htmlContent = await container.renderToString(Content);

      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.excerpt || "",
        link: url,
        // L'assistant rss() encapsule automatiquement cette chaîne dans un CDATA 
        // et configure l'espace de noms content:encoded
        content: htmlContent, 
      };
    })
  );

  // Appel de la méthode officielle d'Astro qui injecte les en-têtes HTTP exacts
  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: siteConfig.siteUrl,
    customData: `<language>${siteConfig.language || "fr"}</language>`,
    items: items,
  });
}
