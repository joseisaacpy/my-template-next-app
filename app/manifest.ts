import type { MetadataRoute } from "next";

import { site } from "@/nav.config";

/**
 * Web App Manifest (PWA). Habilita "adicionar à tela inicial" / "instalar app",
 * define nome, ícones e cores da splash. O Next injeta `<link rel="manifest">`
 * automaticamente — nada a fazer em `layout.tsx`.
 *
 * Isto NÃO deixa o app offline: cache offline exige um service worker, que fica
 * fora do template (ver `@serwist/next` ou `next-pwa` se precisar).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: site.backgroundColor,
    theme_color: site.themeColor.light,
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
