import Link from "next/link";

import { ThemeButton } from "@/components/theme/ThemeButton";
import { cn } from "@/lib/utils";
import { nav, site } from "@/nav.config";

import { NavLink } from "./NavLink";

interface HeaderProps {
  /** Passe `true` quando houver sessão para revelar os itens com `auth: true`. */
  authenticated?: boolean;
  className?: string;
}

/**
 * Header padrão do app. Os links vêm de `nav.header` em `nav.config.ts` —
 * para mudar o menu, edite a lista lá, não este componente.
 */
export function Header({ authenticated = false, className }: HeaderProps) {
  const links = nav.header.filter((item) => !item.auth || authenticated);

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

        <ThemeButton />
      </div>
    </header>
  );
}
