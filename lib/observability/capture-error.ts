interface ErrorContext {
  /** `digest` do Next, quando houver. */
  digest?: string;
  /** De onde veio (`error-boundary`, `global-error-boundary`, action...). */
  source?: string;
  [key: string]: unknown;
}

/**
 * Captura de erro **do navegador** — chamada pelos error boundaries
 * (`app/error.tsx`, `app/global-error.tsx`). Hoje só loga no console do
 * navegador. Ligue aqui o seu provedor de observabilidade no cliente:
 *
 * ```ts
 * import * as Sentry from "@sentry/nextjs";
 * Sentry.captureException(error, { extra: context });
 * ```
 *
 * Este arquivo roda no navegador, então **não** pode importar `lib/logger.ts`
 * (só de servidor). O erro de servidor correspondente é logado por
 * `instrumentation.ts`; o `digest` aqui é o mesmo que aparece lá, e é com ele
 * que você liga os dois logs.
 */
export function captureError(error: unknown, context?: ErrorContext): void {
  console.error("[captureError]", context?.source ?? "app", error, context);
}
