import "server-only";

import { ZodError, flattenError } from "zod";

import { AppError } from "@/lib/errors";

import type { ActionError } from "./types";

/**
 * Normaliza qualquer erro em `ActionError`:
 * - `ZodError`  → `fieldErrors` por campo;
 * - `AppError`  → mensagem + código de domínio;
 * - resto       → loga e devolve mensagem genérica (não vaza detalhe interno).
 *
 * NÃO trata os erros de controle de fluxo do Next (`redirect`, `notFound`) —
 * quem chama deve rodar `unstable_rethrow(e)` antes.
 */
export function toActionError(error: unknown): ActionError {
  if (error instanceof ZodError) {
    return {
      ok: false,
      error: "Confira os campos destacados.",
      code: "VALIDATION_ERROR",
      fieldErrors: flattenError(error).fieldErrors,
    };
  }

  if (error instanceof AppError) {
    return { ok: false, error: error.message, code: error.code };
  }

  console.error("[action] erro inesperado:", error);
  return {
    ok: false,
    error: "Algo deu errado. Tente novamente.",
    code: "INTERNAL_ERROR",
  };
}
