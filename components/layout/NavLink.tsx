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
  onClick?: () => void;
}

/**
 * Link de navegação com estado ativo derivado do pathname.
 * Marca `aria-current="page"` e destaca visualmente a rota atual.
 */
export function NavLink({
  href,
  children,
  exact,
  className,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  const active = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "text-muted-foreground hover:text-foreground text-sm transition-colors",
        active && "text-foreground font-medium",
        className,
      )}
    >
      {children}
    </Link>
  );
}
