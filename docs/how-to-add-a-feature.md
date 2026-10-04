# Como adicionar uma feature

Uma feature é uma fatia vertical por domínio em `features/<nome>/`. O molde é
`features/example` (CRUD de Notas): copie a pasta, renomeie e adapte. Os
exemplos abaixo usam uma feature fictícia, **tarefas**.

## Checklist

1. **Model Prisma** em `prisma/schema.prisma` (com `userId` se o dado é de um
   usuário) e rode `pnpm db:migrate` — cria a migração e atualiza o client.
2. **`constants/`** — rota da lista (`TASKS_PATH`), limites de campo.
3. **`schemas/`** — schema Zod do input (`*.schema.ts`). Para update, estenda o
   schema base com `id` (vem de um `<input type="hidden">`).
4. **`types/`** — o **DTO**: formato que sai do service e chega no client.
   Não inclua `userId` nem nada interno do Prisma.
5. **`utils/`** — função que converte a linha do Prisma em DTO
   (`toNoteDTO` em `features/example/utils/note.utils.ts`).
6. **`repositories/`** — única camada que importa o Prisma. Toda query é
   escopada por `userId` (`where: { id, userId }`). Comece o arquivo com
   `import "server-only"`.
7. **`services/`** — regras de negócio e autorização. Se o recurso não é do
   usuário, lance `NotFoundError` (404, não 403: não revela que existe). Devolve
   DTO. Também com `import "server-only"`.
8. **`actions/`** — arquivo com `"use server"`. Duas formas:
   - **wrapper** (padrão): `createAction({ schema, handler, revalidate })` —
     já faz `requireUser`, valida o `FormData`, trata erro e devolve
     `ActionResult`. Ver `features/example/actions/create-note.ts`.
   - **action crua**: para `<form action={...}>` sem estado de retorno (ex.:
     excluir). Chame `requireUser()` você mesmo. Ver `delete-note.ts`.
   - Ação só para um papel? Adicione `roles: ["admin"]` ao `createAction`.
9. **`hooks/` e `components/`** — hook com `useActionState` + toast, e os
   componentes. Components recebem DTOs prontos. Server Component por padrão;
   `"use client"` só onde há estado ou evento.
10. **`index.ts` (barrel)** — exporta o que o client pode importar. **Não
    exporte o service** (é `server-only`): quem precisa dele importa
    direto de `services/<nome>.service`.
11. **Rota** — veja [routing.md](routing.md): registrar em `nav.config.ts`,
    criar a `page.tsx` e, se privada, incluir o prefixo em `PRIVATE_PREFIXES`
    no `proxy.ts`. A page chama `requireUser()` (ou `requireRole()`) e o
    service; sem lógica de negócio na page.
12. **Testes** — ao menos o schema e o service ([testing.md](testing.md)).

Nomes de arquivo: kebab-case com sufixo do papel (`task.service.ts`,
`task.repository.ts`, `task.schema.ts`, `task.test.ts`).

## Variações do molde

Nem toda feature tem as 9 pastas:

- **`features/auth`** — só UI, schemas e constantes. O login roda no client
  via `authClient`; não há service nem repository próprios.
- **`features/admin`** — tem service e action, mas **sem repository**: o dado
  vem do Better Auth (`auth.api.listUsers` / `setRole`), não do Prisma. Quando a
  fonte é o Better Auth, o service pode chamar `auth.api` diretamente.

## Começando um projeto: o que apagar do exemplo

`Notas` existe só para mostrar o padrão. Ao começar um projeto de verdade:

1. apague `features/example/` e `app/(private)/notes/`;
2. remova o model `Note` (e a relação `notes` em `User`) do
   `prisma/schema.prisma` e gere uma migração nova com `pnpm db:migrate`;
3. remova a rota `notes` em `nav.config.ts` (`RouteKey`, `routes` e
   `nav.header`) e `/notes` de `PRIVATE_PREFIXES` no `proxy.ts`;
4. procure outras referências: `grep -rn "notes\|Notas" app components docs README.md`.

Mantenha `features/auth` e `features/admin` — fazem parte da base do template.
