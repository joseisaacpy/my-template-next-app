import type { Metadata } from "next";

import { routes, site, type RouteKey } from "@/nav.config";

const baseUrl = new URL(site.url);
const ogImages = site.ogImage ? [site.ogImage] : undefined;

interface CreateMetadataInput {
  /** Chave da rota em `nav.config.ts`. Puxa `title` e `description` do registro. */
  route?: RouteKey;
  /** Sobrescreve o título (senão usa `routes[route].label`). */
  title?: string;
  /** Sobrescreve a descrição (senão usa `routes[route].description`). */
  description?: string;
  /** Caminho canônico. Default: `routes[route].path` ou `"/"`. */
  path?: string;
  /** Remove a página dos índices de busca. */
  noIndex?: boolean;
  /** Campos extras / overrides do objeto `Metadata` final. */
  overrides?: Metadata;
}

/**
 * Monta o objeto `metadata` de uma página a partir do registro de rotas.
 *
 * Numa `page.tsx` (Server Component):
 * ```ts
 * export const metadata = createMetadata({ route: "dashboard" });
 * ```
 *
 * Rota fora do registro (ex.: dinâmica):
 * ```ts
 * export const metadata = createMetadata({ title: "Post X", path: "/blog/post-x" });
 * ```
 *
 * O sufixo do `<title>` (`%s · Meu Template`) vem do template definido
 * em `app/layout.tsx` via `rootMetadata`.
 */
export function createMetadata({
  route,
  title,
  description,
  path,
  noIndex,
  overrides,
}: CreateMetadataInput = {}): Metadata {
  const entry = route ? routes[route] : undefined;

  const resolvedTitle = title ?? entry?.label;
  const resolvedDescription =
    description ?? entry?.description ?? site.description;
  const canonical = new URL(path ?? entry?.path ?? "/", baseUrl).toString();

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      url: canonical,
      title: resolvedTitle ?? site.name,
      description: resolvedDescription,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle ?? site.name,
      description: resolvedDescription,
      images: ogImages,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    ...overrides,
  };
}

/**
 * Metadata raiz — importada por `app/layout.tsx`.
 * Define `metadataBase` e o template de `<title>` herdado por todas as páginas.
 */
export const rootMetadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: baseUrl.toString(),
    title: site.name,
    description: site.description,
    images: ogImages,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ogImages,
  },
};
