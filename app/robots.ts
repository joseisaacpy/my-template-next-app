import type { MetadataRoute } from "next";

import { privatePathPrefixes, site } from "@/nav.config";

/**
 * robots.txt gerado a partir do registro de rotas (`nav.config.ts`).
 * As rotas privadas (`auth: true`) viram regras `Disallow` automaticamente.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        ...privatePathPrefixes().map((prefix) => `${prefix}/`),
      ],
    },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: site.url,
  };
}
