import type { MetadataRoute } from "next";

import { site, sitemapRoutes } from "@/nav.config";

/**
 * Sitemap gerado a partir do registro de rotas (`nav.config.ts`).
 * Para incluir/excluir uma rota, edite `routes` lá — não este arquivo.
 *
 * Rotas dinâmicas (ex.: `/blog/[slug]`) entram concatenando um array extra:
 *   const posts = await getPosts();
 *   return [...staticEntries, ...posts.map((p) => ({ url: ..., lastModified: p.updatedAt }))];
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return sitemapRoutes().map((route) => ({
    url: new URL(route.path, site.url).toString(),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
