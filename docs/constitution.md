# Constitution

Regras de código do projeto. O **porquê** de cada uma está em
[decisions.md](decisions.md).

## Stack

- Next.js 16 (App Router) — `proxy.ts` no lugar de `middleware.ts`
- TypeScript
- Tailwind + shadcn/ui
- Better Auth
- Prisma 7 + PostgreSQL (Neon)
- Zod (validação)
- Vitest (testes)

## Regras

- Server Components por padrão
- Server Actions antes de API routes
- Actions retornam `ActionResult` (`lib/actions`); nunca `throw` para erro
  esperado — erro de domínio via `lib/errors` (`AppError` e subclasses)
- Zod em todos os inputs (o schema é aplicado ao `FormData` na action)
- Prisma só em `repositories/` — service e action nunca importam o client direto
  (exceção: service cuja fonte é o Better Auth chama `auth.api`, ver `features/admin`)
- Autorização no `service`: toda busca por id passa o `userId`; recurso de
  outro usuário responde `NotFoundError` (404), não 403
- Autorização por papel: page → `requireRole("admin")` (404 se negado); action →
  `createAction({ roles: ["admin"] })` (`FORBIDDEN` se negado). Nomes de papel só
  via `Role` de `lib/auth/roles.ts`
- `proxy.ts` é só checagem otimista (cookie); a barreira real é page, action e service
- DTO na fronteira: o service devolve o DTO, não a linha crua do Prisma
- Nunca acessar Prisma no client
- `import "server-only"` em service e repository
- Barrel (`index.ts`) da feature nunca exporta o service
- Components desacoplados
- Evitar lógica em `page.tsx`

## Estrutura

- features por domínio (`features/<nome>/`)
- camadas: repository → service → action → component
- schemas, types, constants, utils separados
- arquivos em kebab-case com sufixo do papel: `.service.ts`, `.repository.ts`,
  `.schema.ts`, `.types.ts`, `.constants.ts`, `.test.ts`
- testes ao lado do código (`*.test.ts`)

Passo a passo: [how-to-add-a-feature.md](how-to-add-a-feature.md).

## UI

- shadcn/ui
- acessibilidade mínima
- loading states
- empty states
