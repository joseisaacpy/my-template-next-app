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
- `components/layout/Header.tsx` → consome `nav.header`, montado em `app/(private)/layout.tsx`.

Detalhes e esqueleto de página nova: `docs/routing.md`.