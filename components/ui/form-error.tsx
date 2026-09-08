import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Mensagem de erro de nível de formulário (ex.: "Credenciais inválidas"
 * vinda do servidor). Não renderiza nada quando não há conteúdo.
 *
 * @example
 * <FormError>{formError}</FormError>
 */
function FormError({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  if (!children) return null;

  return (
    <p
      role="alert"
      data-slot="form-error"
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export { FormError };
