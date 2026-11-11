"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useMounted } from "@/lib/hooks/use-mounted";

export function ThemeButton() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  // Guard de hidratação: no servidor não há tema resolvido, então o botão só
  // aparece depois de montar no cliente.
  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {isDark ? (
        <Sun className="size-5 transition-all" />
      ) : (
        <Moon className="size-5 transition-all" />
      )}
    </Button>
  );
}
