import "server-only";

import { styleText } from "node:util";

/**
 * Logger do servidor, sem dependências.
 *
 * - **Produção:** uma linha JSON por log (a Vercel e o `docker logs` leem isso
 *   direto, e dá para filtrar por campo).
 * - **Desenvolvimento:** linha colorida e legível, com a stack do erro embaixo.
 *
 * Use no lugar de `console.*` no código de servidor (a regra `no-console` do
 * ESLint avisa). Erros vão em `err`; o resto do contexto são campos soltos:
 *
 * @example
 * logger.info("nota criada", { noteId });
 * logger.error("falha ao enviar e-mail", { err: error, to });
 * const log = logger.child({ feature: "notes" });
 *
 * O nível vem de `LOG_LEVEL` (`debug | info | warn | error | silent`). Sem ele:
 * `info` em produção, `silent` nos testes e `debug` no resto.
 *
 * Não logue senha, token ou cookie: chaves com esses nomes viram `[redacted]`,
 * mas isso é só uma rede de segurança.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogLevelSetting = LogLevel | "silent";
export type LogContext = Record<string, unknown>;

const WEIGHT: Record<LogLevelSetting, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 100,
};

/** Chaves cujo valor nunca deve aparecer no log. */
const SENSITIVE_KEY =
  /pass(word)?|token|secret|authorization|cookie|api[-_]?key/i;
const MAX_DEPTH = 4;

/** Campos do envelope do log; o contexto não pode sobrescrevê-los. */
const RESERVED_KEYS = new Set(["level", "time", "msg"]);

export interface Logger {
  debug(msg: string, ctx?: LogContext): void;
  info(msg: string, ctx?: LogContext): void;
  warn(msg: string, ctx?: LogContext): void;
  error(msg: string, ctx?: LogContext): void;
  /** Novo logger que inclui `bindings` em todo log. */
  child(bindings: LogContext): Logger;
}

export interface LoggerOptions {
  level: LogLevelSetting;
  /** `true`: uma linha JSON por log. `false`: formato legível para dev. */
  json: boolean;
  bindings?: LogContext;
  /** Para onde vai a linha pronta. Padrão: `console`. Útil nos testes. */
  sink?: (level: LogLevel, line: string) => void;
}

/** Linha JSON/texto → `console` com o nível certo (`error` vai para stderr). */
function consoleSink(level: LogLevel, line: string) {
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

/** Copia o valor deixando-o seguro para JSON: erros, datas, segredos e ciclos. */
function normalize(value: unknown, depth = 0): unknown {
  if (value instanceof Error) {
    const out: Record<string, unknown> = {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
    // `digest` (erros do Next) e `code` ajudam a correlacionar com o cliente.
    for (const key of ["digest", "code"] as const) {
      if (key in value) out[key] = (value as unknown as LogContext)[key];
    }
    if (value.cause !== undefined && depth < MAX_DEPTH) {
      out.cause = normalize(value.cause, depth + 1);
    }
    return out;
  }
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (value === null || typeof value !== "object") return value;
  if (depth >= MAX_DEPTH) return "[truncated]";
  if (Array.isArray(value))
    return value.map((item) => normalize(item, depth + 1));

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      SENSITIVE_KEY.test(key) ? "[redacted]" : normalize(item, depth + 1),
    ]),
  );
}

const COLOR = {
  debug: "gray",
  info: "cyan",
  warn: "yellow",
  error: "red",
} as const;

function formatPretty(
  level: LogLevel,
  msg: string,
  time: string,
  fields: LogContext,
): string {
  const { err, ...rest } = fields;
  const clock = time.slice(11, 19);
  const tag = styleText(COLOR[level], level.toUpperCase().padEnd(5));
  const extra = Object.keys(rest).length
    ? ` ${styleText("gray", JSON.stringify(rest))}`
    : "";

  let line = `${styleText("gray", clock)} ${tag} ${msg}${extra}`;

  if (err && typeof err === "object") {
    const { stack, message } = err as { stack?: string; message?: string };
    line += `\n${stack ?? message ?? JSON.stringify(err)}`;
  }
  return line;
}

export function createLogger(options: LoggerOptions): Logger {
  const { level: minLevel, json, bindings = {}, sink = consoleSink } = options;

  function write(level: LogLevel, msg: string, ctx?: LogContext) {
    if (WEIGHT[level] < WEIGHT[minLevel]) return;

    const time = new Date().toISOString();
    const fields = normalize({ ...bindings, ...ctx }) as LogContext;

    if (json) {
      // `level`, `time` e `msg` vêm primeiro e não podem ser sobrescritos.
      const extra = Object.fromEntries(
        Object.entries(fields).filter(([key]) => !RESERVED_KEYS.has(key)),
      );
      sink(level, JSON.stringify({ level, time, msg, ...extra }));
    } else {
      sink(level, formatPretty(level, msg, time, fields));
    }
  }

  return {
    debug: (msg, ctx) => write("debug", msg, ctx),
    info: (msg, ctx) => write("info", msg, ctx),
    warn: (msg, ctx) => write("warn", msg, ctx),
    error: (msg, ctx) => write("error", msg, ctx),
    child: (childBindings) =>
      createLogger({ ...options, bindings: { ...bindings, ...childBindings } }),
  };
}

function resolveLevel(): LogLevelSetting {
  const fromEnv = process.env.LOG_LEVEL;
  if (fromEnv && Object.hasOwn(WEIGHT, fromEnv)) {
    return fromEnv as LogLevelSetting;
  }
  if (process.env.NODE_ENV === "production") return "info";
  if (process.env.NODE_ENV === "test") return "silent";
  return "debug";
}

/** Logger padrão do app. */
export const logger = createLogger({
  level: resolveLevel(),
  json: process.env.NODE_ENV === "production",
});
