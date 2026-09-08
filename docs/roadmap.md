# Roadmap

## Feito (T0 + T1 — destravar + arquitetura)

- schema Prisma + migração inicial + cliente único
- camada de e-mail (Resend + fallback console)
- verificação de e-mail, reset de senha, logout, sessão no servidor
- rate limit persistido, login social opt-in
- camada de server actions tipada (`lib/actions` + `lib/errors`)
- CRUD de referência (Notas) em `features/example`

## Próximo (T2 — higiene)

- `LICENSE` (README diz MIT, falta o arquivo)
- CI (GitHub Actions: install → typecheck → lint → build)
- testes (Vitest): schemas, `createAction`, `note.service`, `sitemapRoutes`
- Prettier + `eslint-config-prettier` + `prettier-plugin-tailwindcss`
- git hooks (lefthook/husky + lint-staged + commitlint)
- `packageManager` + `engines` + `.nvmrc`
- security headers no `next.config.ts`; `opengraph-image.tsx`
- ponto de plugue de observabilidade no `error.tsx` / `global-error.tsx`
- parametrizar dados pessoais de `app/(public)/_components/home-view.tsx`
  (hoje tem `github.com/joseisaacpy`, avatar e URL hardcoded) via `nav.config.ts`
- refatorar `ThemeButton` para `useSyncExternalStore` (tira o eslint-disable)

## Features

- onboarding
- billing / Stripe
- organization system
- RBAC (plugin `admin` do better-auth)
- notifications
- email queue
- upload de arquivos
- i18n (`next-intl`)
