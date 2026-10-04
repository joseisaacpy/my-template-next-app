# Roadmap

## Feito (T0 + T1 — destravar + arquitetura)

- schema Prisma + migração inicial + cliente único
- camada de e-mail (Resend + fallback console)
- verificação de e-mail, reset de senha, logout, sessão no servidor
- rate limit persistido, login social opt-in
- camada de server actions tipada (`lib/actions` + `lib/errors`)
- CRUD de referência (Notas) em `features/example`

## Feito (T2 — higiene)

- `LICENSE` MIT, `packageManager`, `engines`, `.nvmrc`, `.editorconfig`
- Prettier + `prettier-plugin-tailwindcss` + `eslint-config-prettier`
- git hooks (lefthook) + commitlint (Conventional Commits)
- Vitest — schemas, `toActionError`, `sitemapRoutes`, `noteService`
- CI (GitHub Actions: format → typecheck → lint → test → build)
- security headers (hoje em `lib/security/headers.ts`) + `app/opengraph-image.tsx`
- `lib/observability/captureError()` nos error boundaries
- `home-view.tsx` sem dados pessoais hardcoded (`site.author` / `site.repoUrl`)
- `ThemeButton` com `useSyncExternalStore` (`useMounted`)

## Feito (P0 — prioridade alta)

- `Content-Security-Policy` estática (`lib/security/headers.ts`)
- RBAC: plugin `admin` (user/admin), `requireRole`, `createAction({ roles })`, `/admin/users`
- docs de arquitetura: índice, fluxo de request, how-to de feature, testes, ADRs
- `robots.txt` bloqueia `/admin` inteiro

## Feito (P1)

- Docker: imagem standalone + compose com Postgres (`docs/docker.md`) e driver `pg`

## P0 — pendente

- testes de integração

## P1

- logger
- melhorar a DX do clone

## P2

- observability (provedor real, como Sentry, em `captureError`)

## T3 — não bloqueia, quando fizer sentido

- CSP com nonce (opcional — hoje é estática, ver [decisions.md](decisions.md))
- `.github/` templates de issue/PR + Dependabot

## Features (backlog)

- onboarding
- billing / Stripe
- organization system
- notifications
- email queue
- upload de arquivos
- i18n (`next-intl`)
