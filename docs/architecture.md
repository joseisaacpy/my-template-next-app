# Architecture

## App Router

app/
(public)/
(private)/

## Auth
Better Auth

## Database
Prisma + PostgreSQL

## Organização

src/
features/
services/
actions/
schemas/
components/
lib/

## Protected Routes
(private)

## Public Routes
(public)

## Rotas, Navegação e Metadata

`nav.config.ts` (raiz) é a fonte única de verdade: nome + descrição de cada
rota, itens do menu e identidade do site.

- `lib/metadata.ts` → `createMetadata({ route })` gera a metadata de cada page.
- `components/layout/{Header,Footer}.tsx` → consomem `nav.header` / `nav.footer`,
  montados em `app/(private)/layout.tsx`.
- `proxy.ts` → checagem otimista de sessão nas rotas privadas.

Detalhes e esqueleto de página nova: `docs/routing.md`.

## Ambiente

`env.ts` (raiz) valida `process.env` com zod. Server importa `@/env`;
client usa `process.env.NEXT_PUBLIC_*`.

## Estados

`app/loading.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`.