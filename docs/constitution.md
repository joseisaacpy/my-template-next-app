# Constitution

## Stack
- Next.js App Router
- TypeScript
- Tailwind
- Better Auth
- Prisma

## Regras
- Server Components por padrão
- Server Actions antes de API routes
- Actions retornam `ActionResult` (`lib/actions`); nunca `throw` para erro
  esperado — erro de domínio via `lib/errors` (`AppError` e subclasses)
- Zod em todos os inputs (o schema é aplicado ao `FormData` na action)
- Prisma só em `repositories/` — service e action nunca importam o client direto
- Autorização no `service`: toda busca por id passa o `userId`; recurso de
  outro usuário responde `NotFoundError` (404), não 403
- DTO na fronteira: o service devolve o DTO, não a linha crua do Prisma
- Nunca acessar Prisma no client
- Components desacoplados
- Evitar lógica em `page.tsx`

## Estrutura
- features por domínio
- camadas: repository → service → action → component
- schemas, types, constants, utils separados

## UI
- shadcn/ui
- acessibilidade mínima
- loading states
- empty states
