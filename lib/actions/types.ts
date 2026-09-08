/**
 * Contrato de retorno de toda server action do projeto.
 *
 * No React 19 erro de validação é um **valor de retorno** (`ok: false`), não
 * um `throw`. `throw` numa action é só para o inesperado (vira `error.tsx`).
 */
export type ActionResult<T = void> = ActionSuccess<T> | ActionError;

export interface ActionSuccess<T = void> {
  ok: true;
  data: T;
}

export interface ActionError {
  ok: false;
  /** Mensagem pronta para exibir ao usuário. */
  error: string;
  /** Código estável (ex.: `NOT_FOUND`) para o cliente ramificar, se precisar. */
  code?: string;
  /** Erros por campo, no formato `{ campo: ["mensagem"] }` (validação Zod). */
  fieldErrors?: Record<string, string[] | undefined>;
}
