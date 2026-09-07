"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  /**
   * Estado de carregamento. Se omitido, usa `useFormStatus().pending`
   * (funciona com `<form action>` / Server Actions).
   * Passe explicitamente ao usar react-hook-form: `loading={isSubmitting}`.
   */
  loading?: boolean;
  /** Texto exibido enquanto carrega. Padrão: mantém `children`. */
  loadingText?: React.ReactNode;
}

/**
 * Botão de submit com spinner e `disabled`/`aria-busy` automáticos.
 *
 * @example
 * // react-hook-form
 * <SubmitButton loading={isSubmitting} loadingText="Entrando...">Entrar</SubmitButton>
 *
 * @example
 * // Server Action (<form action={...}>) — pega o pending sozinho
 * <SubmitButton>Salvar</SubmitButton>
 */
function SubmitButton({
  loading,
  loadingText,
  children,
  disabled,
  type = "submit",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isLoading = loading ?? pending;

  return (
    <Button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2Icon className="animate-spin" aria-hidden="true" />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export { SubmitButton };
