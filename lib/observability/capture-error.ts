interface ErrorContext {
  /** `digest` do Next, quando houver. */
  digest?: string;
  /** De onde veio (`error-boundary`, `global-error-boundary`, action...). */
  source?: string;
  [key: string]: unknown;
}

/**
 * Ponto único de captura de erro do app. Hoje só loga no console — ligue aqui
 * o seu provedor de observabilidade:
 *
 * ```ts
 * import * as Sentry from "@sentry/nextjs";
 * Sentry.captureException(error, { extra: context });
 * ```
 */
export function captureError(error: unknown, context?: ErrorContext): void {
  console.error("[captureError]", context?.source ?? "app", error, context);
}
