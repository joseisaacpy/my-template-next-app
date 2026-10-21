import "server-only";

import { ZodError, flattenError, type z } from "zod";

import { auth } from "@/lib/auth/auth";
import { hasRole, type Role } from "@/lib/auth/roles";
import {
  AppError,
  ForbiddenError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/errors";
import { logger } from "@/lib/logger";

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
export type SessionUser = Session["user"];

/** Tipo do `input`: saída do schema, ou `undefined` quando não há schema. */
type RouteInput<Schema> = Schema extends z.ZodType
  ? z.output<Schema>
  : undefined;

interface CreateRouteConfig<Schema extends z.ZodType | undefined, Data> {
  /** Schema Zod aplicado ao corpo JSON. Sem schema, o corpo nem é lido. */
  schema?: Schema;
  /** Restringe a rota a estes papéis. Omitido = qualquer usuário logado. */
  roles?: Role[];
  /** Status HTTP de sucesso (padrão 200; use 201 em criações). */
  status?: number;
  /** Lógica de negócio. Recebe o corpo já validado, os params da URL e a sessão. */
  handler: (ctx: {
    input: RouteInput<Schema>;
    params: Record<string, string>;
    user: SessionUser;
  }) => Promise<Data>;
}

/** Corpo de toda resposta de erro da API (mesmo formato das server actions). */
export interface ApiError {
  ok: false;
  error: string;
  code: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

async function readJson(request: Request): Promise<unknown> {
  // Exigir JSON barra `<form>` cross-site (text/plain) mandando corpo "JSON".
  if (!request.headers.get("content-type")?.includes("application/json")) {
    throw new AppError(
      "Envie o corpo como application/json.",
      "UNSUPPORTED_MEDIA_TYPE",
      415,
    );
  }

  try {
    return await request.json();
  } catch {
    throw new ValidationError("O corpo da requisição não é um JSON válido.");
  }
}

/**
 * Normaliza qualquer erro em resposta JSON:
 * - `ZodError` → 400 com `fieldErrors`;
 * - `AppError` → o status e a mensagem do próprio erro;
 * - resto      → loga e devolve 500 genérico (não vaza detalhe interno).
 */
function toErrorResponse(error: unknown): Response {
  if (error instanceof ZodError) {
    const body: ApiError = {
      ok: false,
      error: "Confira os campos informados.",
      code: "VALIDATION_ERROR",
      fieldErrors: flattenError(error).fieldErrors,
    };
    return Response.json(body, { status: 400 });
  }

  if (error instanceof AppError) {
    const body: ApiError = {
      ok: false,
      error: error.message,
      code: error.code,
    };
    return Response.json(body, { status: error.httpStatus });
  }

  logger.error("route: erro inesperado", { err: error });
  const body: ApiError = {
    ok: false,
    error: "Algo deu errado. Tente novamente.",
    code: "INTERNAL_ERROR",
  };
  return Response.json(body, { status: 500 });
}

/**
 * Monta um route handler autenticado e tipado (equivalente do `createAction`
 * para APIs). Faz, na ordem: sessão → `roles` → valida o corpo JSON →
 * `handler` → `{ ok: true, data }`. Falhas viram `{ ok: false, ... }` com o
 * status HTTP certo.
 *
 * @example
 * export const POST = createRoute({
 *   schema: noteInputSchema,
 *   status: 201,
 *   handler: ({ input, user }) => noteService.create(user.id, input),
 * });
 */
export function createRoute<Schema extends z.ZodType | undefined, Data>(
  config: CreateRouteConfig<Schema, Data>,
) {
  return async function route(
    request: Request,
    context?: { params: Promise<Record<string, string>> },
  ): Promise<Response> {
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session) {
        throw new UnauthorizedError();
      }

      const { user } = session;
      if (config.roles && !hasRole(user, ...config.roles)) {
        throw new ForbiddenError();
      }

      const input = config.schema
        ? config.schema.parse(await readJson(request))
        : undefined;
      const params = context ? await context.params : {};

      const data = await config.handler({
        input: input as RouteInput<Schema>,
        params,
        user,
      });

      return Response.json(
        { ok: true, data },
        { status: config.status ?? 200 },
      );
    } catch (error) {
      return toErrorResponse(error);
    }
  };
}
