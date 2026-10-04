import Link from "next/link";

import { ThemeButton } from "@/components/theme/ThemeButton";
import { LogoutButton } from "@/features/auth";
import { hasRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";
import { nav, site } from "@/nav.config";

import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";

interface HeaderUser {
  name?: string | null;
  email: string;
  image?: string | null;
  /** Papel do usuário (plugin admin). Usado para filtrar itens com `roles`. */
  role?: string | null;
}

interface HeaderProps {
  /** Usuário da sessão. Quando presente, revela os itens `auth: true` e o menu da conta. */
  user?: HeaderUser | null;
  /** Força o modo autenticado sem um objeto de usuário (ex.: skeleton). */
  authenticated?: boolean;
  className?: string;
}

function initialOf(user: HeaderUser): string {
  const source = user.name?.trim() || user.email;
  return source.charAt(0).toUpperCase();
}

/**
 * Header padrão do app. Os links vêm de `nav.header` em `nav.config.ts` —
 * para mudar o menu, edite a lista lá, não este componente.
 */
export function Header({ user, authenticated, className }: HeaderProps) {
  const isAuthenticated = authenticated ?? Boolean(user);
  const links = nav.header.filter(
    (item) =>
      (!item.auth || isAuthenticated) &&
      (!item.roles || (user != null && hasRole(user, ...item.roles))),
  );

  return (
    <header
      className={cn(
        "bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold">
            {site.name}
          </Link>

          <nav className="hidden items-center gap-4 md:flex">
            {links.map((item) => (
              <NavLink
                key={item.key}
                href={item.path}
                exact={item.path === "/"}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <MobileNav links={links} siteName={site.name} />

          {user ? (
            <>
              <span
                className="bg-muted flex size-7 items-center justify-center rounded-full text-xs font-medium"
                title={user.name ?? user.email}
                aria-hidden
              >
                {initialOf(user)}
              </span>
              <LogoutButton />
            </>
          ) : null}
          <ThemeButton />
        </div>
      </div>
    </header>
  );
}
