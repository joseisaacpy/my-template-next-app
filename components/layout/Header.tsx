import Link from "next/link";

import { ThemeButton } from "@/components/theme/ThemeButton";
import { LogoutButton } from "@/features/auth";
import { cn } from "@/lib/utils";
import { nav, site } from "@/nav.config";

import { NavLink } from "./NavLink";

interface HeaderUser {
  name?: string | null;
  email: string;
  image?: string | null;
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
  const links = nav.header.filter((item) => !item.auth || isAuthenticated);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold">
            {site.name}
          </Link>

          <nav className="flex items-center gap-4">
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
          {user ? (
            <>
              <span
                className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-medium"
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
