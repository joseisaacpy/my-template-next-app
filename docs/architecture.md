# Architecture

## App Router

```
app/
  (public)/    → home, login, register, forgot-password, reset-password
  (private)/   → dashboard, notes   (layout valida a sessão)
  api/
```

## Auth

Better Auth (email/senha + Google/GitHub opt-in).

- `lib/auth/auth.ts` — config do servidor (e-mail, sessão, rate limit, `nextCookies`).
- `lib/auth/auth-client.ts` — client (`signIn`, `signUp`, `signOut`, `useSession`).
- `lib/auth/session.ts` — **DAL**: `getSession` / `requireSession` / `requireUser`
  (memoizados com `cache()` do React). Toda page/action privada passa por aqui.
- `lib/auth/social-providers.ts` — quais provedores OAuth estão configurados.

## Database

Prisma 7 (`generator prisma-client`, output em `lib/generated/prisma`, adapter
Neon). Cliente único em `lib/db/prisma.ts`. Models: `user/session/account/
verification` (better-auth) + `RateLimit` + `Note` (exemplo). Migrações
versionadas em `prisma/migrations/`.

## Camadas de uma feature

```
component → action → service → repository → Prisma
```

- **repository** — única camada que toca o Prisma; toda query escopada por `userId`.
- **service** — regras de negócio + autorização (`NotFoundError` quando o
  recurso não é do usuário — 404, não 403).
- **action** — fronteira HTTP: `lib/actions/createAction()` faz `requireUser`,
  valida o `FormData` (Zod), chama o service, revalida e redireciona.
- **component** — UI; recebe DTOs prontos, nunca a linha crua do Prisma.

Referência viva: `features/example` (CRUD de Notas).

## Server Actions

`lib/actions/` — `ActionResult<T>` (`{ ok: true, data } | { ok: false, error,
code?, fieldErrors? }`), `createAction()` (wrapper tipado) e `toActionError()`.
`lib/errors/` — `AppError` + `Validation/Unauthorized/Forbidden/NotFound/
Conflict`Error.

## E-mail

`lib/email/` — interface fina (`sendEmail` + `EmailTransport`). Sem
`RESEND_API_KEY` usa o transporte `console` (imprime no terminal); com a chave,
envia via Resend. Templates React Email em `lib/email/templates/`.

## Rotas, Navegação e Metadata

`nav.config.ts` (raiz) é a fonte única: nome + descrição de cada rota, itens do
menu, identidade do site, e as funções que alimentam `sitemap.ts` / `robots.ts`.

- `lib/metadata.ts` → `createMetadata({ route })` gera a metadata de cada page.
- `components/layout/{Header,Footer}.tsx` → consomem `nav.header` / `nav.footer`.
  O `Header` recebe `user` (da sessão) e mostra a inicial + botão Sair.
- `proxy.ts` → checagem otimista de sessão (só o cookie) nas rotas privadas +
  redirect-away de `/login` e `/register` quando já logado.

Detalhes e esqueleto de página nova: `docs/routing.md`.

## Ambiente

`env.ts` (raiz) valida `process.env` com zod. Server importa `@/env`;
client usa `process.env.NEXT_PUBLIC_*`. CI sem segredos: `SKIP_ENV_VALIDATION=1`.

## Estados

`app/loading.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`,
e `loading.tsx` por rota quando fizer sentido (ex.: `app/(private)/notes/`).
