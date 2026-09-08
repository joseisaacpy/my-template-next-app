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
- security headers no `next.config.ts` + `app/opengraph-image.tsx`
- `lib/observability/captureError()` nos error boundaries
- `home-view.tsx` sem dados pessoais hardcoded (`site.author` / `site.repoUrl`)
- `ThemeButton` com `useSyncExternalStore` (`useMounted`)

## T3 — não bloqueia, quando fizer sentido

- `Content-Security-Policy` com nonce (middleware)
- provedor de observabilidade real (Sentry) em `captureError`
- Docker
- `.github/` templates de issue/PR + Dependabot

## Features

- onboarding
- billing / Stripe
- organization system
- RBAC (plugin `admin` do better-auth)
- notifications
- email queue
- upload de arquivos
- i18n (`next-intl`)
