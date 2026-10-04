# Testes

Runner: **Vitest**, ambiente `node`. Hoje só há testes unitários — não existem
testes de componente nem e2e.

```bash
pnpm test         # roda uma vez
pnpm test:watch   # modo watch
```

O `pre-push` (lefthook) e o CI rodam `pnpm test`; um teste quebrado bloqueia o
push e o merge.

## Onde ficam

Ao lado do código, com sufixo `.test.ts`:

```txt
features/example/services/note.service.ts
features/example/services/note.service.test.ts
```

O `vitest.config.mts` só inclui `**/*.test.ts` — um `.test.tsx` **não roda**.

## Configuração que importa

- Alias `@/` aponta para a raiz, igual ao `tsconfig`.
- `server-only` lança erro fora do bundler do Next; nos testes ele é trocado por
  `vitest/stubs/server-only.ts`. Por isso dá para testar services normalmente.

## O que testar e como

| O que                    | Como                                                          | Exemplo                                          |
| ------------------------ | ------------------------------------------------------------- | ------------------------------------------------ |
| Schema Zod               | `safeParse` com entradas válidas e inválidas                  | `features/example/schemas/note.schema.test.ts`   |
| Service com repository   | `vi.mock` do repository; checar DTO e `NotFoundError`         | `features/example/services/note.service.test.ts` |
| Service sobre `auth.api` | `vi.mock("@/lib/auth/auth")` e `vi.mock("next/headers")`      | `features/admin/services/admin.service.test.ts`  |
| `createAction`           | mock de `@/lib/auth/session`, `next/cache`, `next/navigation` | `lib/actions/create-action.test.ts`              |
| Funções puras            | chamada direta                                                | `lib/auth/roles.test.ts`, `nav.config.test.ts`   |

### Padrão de mock

Declare o `vi.mock` antes e importe o módulo testado **depois**, com `await import`
(os mocks são hoisted, mas o import dinâmico deixa a ordem explícita):

```ts
vi.mock("../repositories/note.repository", () => ({
  noteRepository: { listByUser: vi.fn() /* ... */ },
}));

const { noteRepository } = await import("../repositories/note.repository");
const { noteService } = await import("./note.service");
```

Chame `vi.clearAllMocks()` num `beforeEach`.

## O que ainda não existe

Testes de integração (com banco real) estão no roadmap — ver
[roadmap.md](roadmap.md).
