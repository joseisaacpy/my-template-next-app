/**
 * Erros de domínio. São **esperados**: representam uma regra de negócio que
 * não passou (recurso não existe, sem permissão, conflito...), não um bug.
 *
 * Nas server actions eles viram `{ ok: false, error, code }` via
 * `toActionError` — nunca chegam ao `error.tsx`. Para o inesperado (banco
 * caiu), deixe a exceção subir.
 */
export class AppError extends Error {
  readonly code: string;
  readonly httpStatus: number;

  constructor(message: string, code: string, httpStatus: number) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

export class ValidationError extends AppError {
  constructor(message = "Dados inválidos.") {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Você precisa estar autenticado.") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Você não tem acesso a este recurso.") {
    super(message, "FORBIDDEN", 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado.") {
    super(message, "NOT_FOUND", 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflito com o estado atual do recurso.") {
    super(message, "CONFLICT", 409);
  }
}
