import type { Instrumentation } from "next";

/**
 * Chamado pelo Next a cada erro de servidor: render de página, route handler,
 * server action e proxy. É o que cobre os erros que não passam pelo
 * `createAction` (que já loga via `toActionError`).
 *
 * `redirect()` e `notFound()` não chegam aqui — são controle de fluxo, não erro.
 *
 * Para um provedor de observabilidade, chame-o aqui, por exemplo:
 *   Sentry.captureRequestError(error, request, context)
 */
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  // O logger usa APIs do Node; este arquivo também é carregado no Edge.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { logger } = await import("@/lib/logger");

  logger.error("erro de requisição", {
    err: error,
    // `digest` é o mesmo id que o navegador mostra no error boundary.
    digest: (error as { digest?: string } | null)?.digest,
    // Só o caminho: a query pode ter token (verificação de e-mail, reset de
    // senha) e os headers têm cookie — nunca logue nenhum dos dois.
    path: request.path.split("?")[0],
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
  });
};
