# Logs e erros

No servidor use o `logger` (`lib/logger.ts`), nunca `console`. A regra
`no-console` do ESLint avisa.

## Como usar

```ts
import { logger } from "@/lib/logger";

logger.info("nota criada", { noteId });
logger.warn("tentativa de login bloqueada", { email });
logger.error("falha ao enviar e-mail", { err: error, to });

const log = logger.child({ feature: "notes" }); // todo log leva feature=notes
log.debug("buscando notas", { userId });
```

- O primeiro argumento é a mensagem; o segundo, campos soltos de contexto.
- **Erros vão em `err`**: o logger guarda nome, mensagem, stack, `cause`, `digest`
  e `code`.
- `logger` só existe no servidor (`import "server-only"`). No navegador, veja
  [Quem cobre o quê](#quem-cobre-o-quê).

## Níveis

`debug` < `info` < `warn` < `error`, mais `silent` (desliga tudo). Defina com
`LOG_LEVEL` (no `.env` ou no ambiente). Sem ele:

| Ambiente          | Nível padrão |
| ----------------- | ------------ |
| desenvolvimento   | `debug`      |
| produção          | `info`       |
| testes (`vitest`) | `silent`     |

## Formato

- **Desenvolvimento** — uma linha legível e colorida; o erro aparece com a stack
  logo abaixo:

  ```txt
  18:41:59 ERROR action: erro inesperado
  Error: conexão recusada
      at ...
  ```

- **Produção** — uma linha JSON por log, pronta para a Vercel e para
  `docker compose logs`. Dá para filtrar por qualquer campo:

  ```json
  {
    "level": "error",
    "time": "2026-10-04T18:44:12.847Z",
    "msg": "erro de requisição",
    "path": "/notes",
    "method": "GET",
    "digest": "2677511292",
    "err": { "name": "PrismaClientKnownRequestError", "message": "..." }
  }
  ```

Os logs de `error` vão para stderr e os de `warn` para o nível de aviso, então a
plataforma classifica a severidade certa.

## O que **não** logar

Senha, token, cookie, chave de API, dados de cartão. O logger troca por
`[redacted]` o valor de chaves chamadas `password`, `token`, `secret`,
`authorization`, `cookie` e `apiKey` (inclusive aninhadas), mas isso é só uma
rede de segurança: a mensagem do erro e valores em outras chaves passam
direto. Ao logar uma URL, tire a query (ela pode ter token).

## Quem cobre o quê

| Onde                          | Cobre                                                             | Como            |
| ----------------------------- | ----------------------------------------------------------------- | --------------- |
| `toActionError`               | erro inesperado dentro de uma server action (`createAction`)      | `logger.error`  |
| `instrumentation.ts`          | erro de render, route handler, action e proxy no servidor         | `logger.error`  |
| `lib/auth/auth.ts` (`logger`) | avisos e erros do Better Auth (segredo curto, provedor sem chave) | `logger`        |
| `captureError`                | erro **no navegador** (error boundaries)                          | `console.error` |

- `instrumentation.ts` registra `path`, `method`, `routePath`, `routeType` e o
  `digest` — **sem query nem headers**. `redirect()` e `notFound()` não são
  erros e não aparecem.
- `captureError` roda no navegador, então não pode usar o `logger`. O `digest`
  que ele recebe é o mesmo do log do servidor: use-o para ligar o erro que o
  usuário viu ao log do servidor.
- `prisma/seed.ts` (script de CLI) e o transporte de e-mail em dev
  (`lib/email/transports/console.ts`) usam `console` de propósito: a saída é para
  uma pessoa ler no terminal, e o link do e-mail precisa ficar legível.

## Onde ver os logs

- `pnpm dev`: no terminal.
- Docker: `docker compose logs -f app`. `LOG_LEVEL` é repassado pelo compose
  (padrão `info`).
- Vercel: aba _Logs_ do projeto.

## Plugar um provedor (Sentry etc.)

São dois pontos, um para cada lado:

- **Servidor:** `instrumentation.ts` — chame, por exemplo,
  `Sentry.captureRequestError(error, request, context)` dentro de `onRequestError`.
- **Navegador:** `lib/observability/capture-error.ts` — chame
  `Sentry.captureException(error, { extra: context })`.

O provedor em si está no [roadmap](roadmap.md) (P2).
