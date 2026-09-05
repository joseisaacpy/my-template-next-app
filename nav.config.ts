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
   * Imagem OG padrão em `/public` (ex.: `"/og.png"`).
   * Deixe `undefined` enquanto não houver arquivo — evita link quebrado.
   */
  ogImage: undefined as string | undefined,
} as const;

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
