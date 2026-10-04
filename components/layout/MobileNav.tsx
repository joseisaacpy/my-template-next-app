"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { NavLinkItem } from "@/nav.config";

import { NavLink } from "./NavLink";

/**
 * Só os campos serializáveis: este componente é client e recebe a prop de um
 * Server Component, então não pode levar `icon` (um componente React).
 */
type MobileNavLink = Pick<NavLinkItem, "key" | "path" | "label">;

interface MobileNavProps {
  links: MobileNavLink[];
  siteName: string;
}

/** Menu de navegação em `Sheet`, visível só abaixo de `md`. */
export function MobileNav({ links, siteName }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Abrir menu"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-3/4 sm:max-w-xs">
        <SheetHeader>
          <SheetTitle>{siteName}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4">
          {links.map((item) => (
            <NavLink
              key={item.key}
              href={item.path}
              exact={item.path === "/"}
              onClick={() => setOpen(false)}
              className="text-base"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
