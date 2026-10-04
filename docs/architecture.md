# Architecture

Visão geral do projeto. Para o caminho de uma request, veja
[request-flow.md](request-flow.md); para criar uma feature,
[how-to-add-a-feature.md](how-to-add-a-feature.md).

## Mapa do repositório

```txt
app/
  (public)/            home, login, register, forgot-password, reset-password
  (private)/           layout valida a sessão
    dashboard/
    notes/             exemplo (CRUD de Notas)
    admin/users/       só papel admin (layout + page chamam requireRole)
  api/auth/[...all]/   handler do Better Auth
  error.tsx · global-error.tsx · not-found.tsx · loading.tsx
  sitemap.ts · robots.ts · manifest.ts · icon.tsx · apple-icon.tsx · opengraph-image.tsx
  providers.tsx        tema, barra de progresso, transições, Toaster
components/
  ui/                  primitivos shadcn + helpers de form
  layout/              Header, Footer, MobileNav, NavLink
  theme/ · animations/ · providers/
features/
  auth/                UI de login/registro (sem service nem repository)
  example/             molde: CRUD de Notas, todas as camadas
  admin/               lista de usuários e troca de papel (service sobre auth.api)
lib/
  actions/             createAction(), toActionError(), ActionResult
  auth/                auth.ts, auth-client.ts, session.ts (DAL), roles.ts, social-providers.ts
  db/                  cliente Prisma único + adapter.ts (driver neon ou pg)
  email/               sendEmail + transportes + templates React Email
  errors/              AppError e subclasses
  hooks/               use-mounted
  logger.ts            logger do servidor (JSON em produção)
  observability/       captureError() (navegador)
  security/            headers.ts (headers de segurança + CSP)
  generated/prisma/    client gerado (ignorado pelo git)
  metadata.ts          createMetadata()
prisma/                schema.prisma, migrations/, seed.ts
public/                arquivos estáticos (vazio no template)
Dockerfile · docker-compose.yml   imagem standalone + Postgres (docs/docker.md)
docs/                  esta documentação
vitest/stubs/          stub de `server-only` para os testes
instrumentation.ts    onRequestError: loga erros de servidor
nav.config.ts          rotas, navegação e identidade do site
proxy.ts               checagem otimista de sessão
env.ts                 validação das variáveis de ambiente (Zod)
```

## Auth

Better Auth (e-mail/senha + Google/GitHub opt-in + plugin `admin`).

- `lib/auth/auth.ts` — config do servidor: e-mail, sessão, rate limit, plugins
  `admin()` e `nextCookies()` (este por último) e o hook que dá papel `admin` a
  quem está em `ADMIN_EMAILS`.
- `lib/auth/auth-client.ts` — client (`signIn`, `signUp`, `signOut`,
  `useSession`, `getSession`) com `adminClient()`.
- `lib/auth/session.ts` — **DAL**: `getSession` / `requireSession` /
  `requireUser` / `requireRole` (memoizados com `cache()` do React quando
  aplicável). Toda page/action privada passa por aqui.
- `lib/auth/roles.ts` — `ROLES`, `Role`, `hasRole()`, `isAdminEmail()`
  (client-safe).
- `lib/auth/social-providers.ts` — quais provedores OAuth estão configurados.

Fluxos e regras: [features/auth.md](features/auth.md).

## Database

Prisma 7 (`generator prisma-client`, output em `lib/generated/prisma`). Cliente
único em `lib/db/prisma.ts`; o driver vem de `lib/db/adapter.ts`, escolhido por
`DATABASE_DRIVER`: `neon` (padrão, Neon) ou `pg` (Postgres comum, usado no
Docker — ver [docker.md](docker.md)). Models: `user` / `session` /
`account` / `verification` (better-auth, incluindo os campos do plugin admin:
`role`, `banned`, `banReason`, `banExpires` em `User` e `impersonatedBy` em
`Session`) + `RateLimit` + `Note` (exemplo). Migrações versionadas em
`prisma/migrations/`.

## Camadas de uma feature

```txt
component → action → service → repository → Prisma
```

- **repository** — única camada que toca o Prisma; toda query escopada por `userId`.
- **service** — regras de negócio + autorização (`NotFoundError` quando o
  recurso não é do usuário — 404, não 403). Devolve DTO.
- **action** — fronteira HTTP: `lib/actions/createAction()` faz `requireUser`,
  checa `roles` (opcional), valida o `FormData` (Zod), chama o service, revalida
  e redireciona.
- **component** — UI; recebe DTOs prontos, nunca a linha crua do Prisma.

Referência viva: `features/example`. Variações (`features/auth`,
`features/admin`) em [how-to-add-a-feature.md](how-to-add-a-feature.md).

## Server Actions e erros

`lib/actions/` — `ActionResult<T>` (`{ ok: true, data } | { ok: false, error,
code?, fieldErrors? }`), `createAction()` (wrapper tipado) e `toActionError()`.
`lib/errors/` — `AppError` + `Validation/Unauthorized/Forbidden/NotFound/
Conflict`Error.

## Segurança

- `lib/security/headers.ts` — headers aplicados a toda resposta (CSP estática,
  nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS). O
  `next.config.ts` só importa a lista. Nova origem externa → editar a CSP ali.
- `proxy.ts` — checagem otimista (só cookie). Ver [request-flow.md](request-flow.md).
- Rate limit de autenticação persistido na tabela `rateLimit`.

## E-mail

`lib/email/` — interface fina (`sendEmail` + `EmailTransport`). Sem
`RESEND_API_KEY` usa o transporte `console` (imprime no terminal); com a chave,
envia via Resend. Templates React Email em `lib/email/templates/`
(`pnpm email:dev` abre o preview).

## Observabilidade

- `lib/logger.ts` — logger do servidor (JSON em produção, legível em dev),
  nível por `LOG_LEVEL`. Use no lugar de `console`.
- `instrumentation.ts` — `onRequestError` registra os erros de servidor (render,
  route handler, action, proxy) com `digest`, método e caminho.
- `lib/observability/capture-error.ts` — `captureError()` é a captura de erro
  **do navegador**, chamada pelos error boundaries (`app/error.tsx`,
  `app/global-error.tsx`). Só loga no console do navegador; plugue o provedor ali.

Detalhes, formatos e como plugar o Sentry: [logging.md](logging.md).

## Rotas, Navegação e Metadata

`nav.config.ts` (raiz) é a fonte única: nome + descrição de cada rota, itens do
menu, identidade do site, e as funções que alimentam `sitemap.ts` / `robots.ts`.

- `lib/metadata.ts` → `createMetadata({ route })` gera a metadata de cada page.
- `components/layout/{Header,Footer}.tsx` → consomem `nav.header` / `nav.footer`;
  o `Header` filtra itens por `auth` e `roles`.
- `proxy.ts` → redireciona rotas privadas sem cookie e tira o usuário logado de
  `/login` e `/register`.

Detalhes e esqueleto de página nova: [routing.md](routing.md).

## Ambiente

`env.ts` (raiz) valida `process.env` com Zod; o build falha cedo se faltar algo
obrigatório. Server importa `@/env`; client usa `process.env.NEXT_PUBLIC_*`.
Sem segredos (ex.: CI): `SKIP_ENV_VALIDATION=1`. A lista de variáveis está em
`.env.example`.

## Estados

`app/loading.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`,
e `loading.tsx` por rota quando fizer sentido (ex.: `app/(private)/notes/`).

## Qualidade

- Testes: [testing.md](testing.md) (Vitest, `*.test.ts` ao lado do código).
- Git hooks (lefthook, instalados no `pnpm install`): `pre-commit` formata e
  roda ESLint nos arquivos staged; `pre-push` roda `typecheck` e `test`;
  `commit-msg` valida Conventional Commits (commitlint). Pular pontualmente:
  `LEFTHOOK=0`.
- CI (`.github/workflows/ci.yml`): format → typecheck → lint → test → build.
