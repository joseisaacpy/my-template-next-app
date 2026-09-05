"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  /** Casa exatamente com o pathname. Use para a raiz (`"/"`). */
  exact?: boolean;
  className?: string;
}

/**
 * Link de navegação com estado ativo derivado do pathname.
 * Marca `aria-current="page"` e destaca visualmente a rota atual.
 */
export function NavLink({ href, children, exact, className }: NavLinkProps) {
  const pathname = usePathname();
  const active = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "text-sm text-muted-foreground transition-colors hover:text-foreground",
        active && "font-medium text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}
