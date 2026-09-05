import { cn } from "@/lib/utils";
import { nav, site } from "@/nav.config";

import { NavLink } from "./NavLink";

interface FooterProps {
  className?: string;
}

/**
 * Footer padrão. Os links vêm de `nav.footer` em `nav.config.ts` (vazio por
 * padrão) — para adicionar itens, edite a lista lá.
 */
export function Footer({ className }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("border-t", className)}>
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name}
        </p>

        {nav.footer.length > 0 ? (
          <nav className="flex flex-wrap items-center gap-4">
            {nav.footer.map((item) => (
              <NavLink
                key={item.key}
                href={item.path}
                exact={item.path === "/"}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : null}
      </div>
    </footer>
  );
}
