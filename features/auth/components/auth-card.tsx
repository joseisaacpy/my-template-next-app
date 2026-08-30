import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  /** Linha de rodapé, ex.: "Não tem conta? Criar conta". */
  footer?: ReactNode;
  className?: string;
}

/** Moldura visual compartilhada pelas telas de autenticação. */
export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div
        className={cn(
          "w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm",
          className,
        )}
      >
        <div className="space-y-1.5 text-center">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {children}

        {footer ? (
          <p className="text-center text-sm text-muted-foreground">{footer}</p>
        ) : null}
      </div>
    </div>
  );
}
