import type { LucideIcon } from "lucide-react";
import { HomeIcon, LayoutDashboardIcon } from "lucide-react";

/**
 * Configuração central de navegação e identidade do site.
 *
 * Fonte única de verdade para:
 * - nome / descrição / URL do site (consumidos em `lib/metadata.ts`);
 * - registro de rotas: cada página tem uma chave, um caminho e um "nome";
 * - itens exibidos no header / footer.
 *
 * Ao criar uma rota nova:
 * 1. adicione a chave em `RouteKey` e uma entrada em `routes`
 *    (com `path`, `label` e `description`);
 * 2. na `page.tsx`, exporte a metadata pré-pronta:
 *      export const metadata = createMetadata({ route: "<chave>" });
 * 3. se a rota deve aparecer no menu, inclua a chave em `nav.header`
 *    (ou `nav.footer`).
 */

export const site = {
  name: "Meu Template",
  /** Nome curto p/ PWA (`short_name`) e telas pequenas. Máx. ~12 chars. */
  shortName: "Template",
  /** Sufixo do `<title>` e fallback de `description`. */
  description:
    "Template Next.js fullstack com autenticação, banco e UI prontos.",
  /** URL pública, sem barra no final. */
  url: (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  locale: "pt-BR",
  /**
   * Cor da barra do navegador e da splash PWA
   * (`<meta name="theme-color">` via `app/layout.tsx` + `theme_color` no manifest).
   * Ajuste para a cor da sua marca. Formato hex.
   */
  themeColor: { light: "#ffffff", dark: "#0a0a0a" },
  /** Fundo da splash screen PWA (`background_color` no manifest). */
  backgroundColor: "#ffffff",
  /**
   * Imagem OG padrão em `/public` (ex.: `"/og.png"`).
   * Deixe `undefined` enquanto não houver arquivo — evita link quebrado.
   */
  ogImage: undefined as string | undefined,
} as const;

/** Frequência de mudança declarada no `sitemap.xml`. */
export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type RouteKey =
  | "home"
  | "login"
  | "register"
  | "forgotPassword"
  | "dashboard";

export interface RouteMeta {
  /** Caminho real da rota. */
  path: string;
  /** Nome da página: base do `<title>` e rótulo padrão no menu. */
  label: string;
  /** Descrição da página: vira `<meta name="description">` quando a page não define outra. */
  description: string;
  /** `true` quando a rota exige sessão. */
  auth?: boolean;
  /** Ícone opcional para uso no menu / sidebar. */
  icon?: LucideIcon;
  /**
   * Controle da rota no `sitemap.xml`:
   * - omitido: entra com defaults (`priority` 1 na home, 0.7 nas demais, `monthly`);
   * - `false`: fica de fora;
   * - objeto: entra com `changeFrequency` / `priority` customizados.
   *
   * Rotas com `auth: true` nunca entram no sitemap.
   */
  sitemap?: false | { changeFrequency?: ChangeFrequency; priority?: number };
}

/** Registro de todas as rotas de página do app. */
export const routes: Record<RouteKey, RouteMeta> = {
  home: {
    path: "/",
    label: "Início",
    description: site.description,
    icon: HomeIcon,
  },
  login: {
    path: "/login",
    label: "Entrar",
    description: "Acesse sua conta para continuar.",
  },
  register: {
    path: "/register",
    label: "Criar conta",
    description: "Crie sua conta em menos de um minuto.",
  },
  forgotPassword: {
    path: "/forgot-password",
    label: "Recuperar senha",
    description: "Enviaremos um link para redefinir sua senha.",
    // Página de fluxo, sem valor de busca — fora do sitemap.
    sitemap: false,
  },
  dashboard: {
    path: "/dashboard",
    label: "Dashboard",
    description: "Painel da sua conta.",
    auth: true,
    icon: LayoutDashboardIcon,
  },
};

export interface NavLinkItem extends RouteMeta {
  key: RouteKey;
  /** Abre em nova aba (links externos). */
  external?: boolean;
}

/** Resolve chaves de rota em itens completos, preservando a ordem. */
function items(keys: RouteKey[]): NavLinkItem[] {
  return keys.map((key) => ({ key, ...routes[key] }));
}

/**
 * Itens de navegação por área. Edite as listas para mudar o menu.
 * Itens com `auth: true` só aparecem quando `authenticated` é passado ao `<Header />`.
 */
export const nav = {
  header: items(["home", "dashboard"]),
  footer: items([]),
} as const;

/**
 * Rotas que entram no `sitemap.xml`: as públicas (`auth` != true) não marcadas
 * com `sitemap: false`. Consumido por `app/sitemap.ts` — edite `routes`, não o
 * arquivo de sitemap.
 */
export function sitemapRoutes(): Array<{
  key: RouteKey;
  path: string;
  label: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}> {
  return (Object.keys(routes) as RouteKey[])
    .map((key) => ({ key, ...routes[key] }))
    .filter((route) => !route.auth && route.sitemap !== false)
    .map((route) => {
      const cfg = typeof route.sitemap === "object" ? route.sitemap : undefined;
      return {
        key: route.key,
        path: route.path,
        label: route.label,
        changeFrequency: cfg?.changeFrequency ?? "monthly",
        priority: cfg?.priority ?? (route.path === "/" ? 1 : 0.7),
      };
    });
}

/**
 * Prefixos de caminho que exigem sessão — derivados das rotas `auth: true`.
 * Consumido por `app/robots.ts` para montar as regras `Disallow`.
 * (O `proxy.ts` mantém a própria lista para não inflar o bundle do middleware.)
 */
export function privatePathPrefixes(): string[] {
  return (Object.keys(routes) as RouteKey[])
    .filter((key) => routes[key].auth)
    .map((key) => routes[key].path);
}
