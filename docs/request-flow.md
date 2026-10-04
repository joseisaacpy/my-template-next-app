# Fluxo de uma request

Dois caminhos cobrem quase tudo no template: **carregar uma página** e
**executar uma server action**.

## 1. Página privada

```mermaid
flowchart TD
  R[Request] --> P["proxy.ts<br/>só checa o cookie de sessão"]
  P -->|sem cookie| LG["redirect para /login"]
  P --> LY["layout (private)<br/>requireSession()"]
  LY --> PG["page.tsx<br/>requireUser() ou requireRole()"]
  PG -->|sem o papel| NF["página 404 (notFound)"]
  PG --> S["service<br/>regras de negócio + userId"]
  S --> RP["repository<br/>única camada com Prisma"]
  RP --> DB[("PostgreSQL")]
```

- **`proxy.ts`** é uma checagem otimista: só olha se o cookie existe, sem
  consultar o banco. Serve para redirecionar rápido, não para proteger dados.
- **Layout** valida a sessão, mas layouts podem não re-renderizar em navegações
  parciais — por isso **a page também valida** e é a barreira de verdade.
- **Service** garante que o recurso é do usuário (`NotFoundError` se não for).

## 2. Server action

```mermaid
sequenceDiagram
  participant F as Form (client)
  participant A as createAction
  participant S as service
  F->>A: FormData (via useActionState)
  A->>A: requireUser()
  A->>A: roles? se não tem o papel, FORBIDDEN
  A->>A: schema.safeParse(FormData)
  A->>S: handler(input, { user })
  S-->>A: DTO ou AppError
  A->>A: revalidatePath / redirect
  A-->>F: ActionResult
  F->>F: toast ou fieldErrors
```

`ActionResult` é `{ ok: true, data }` ou `{ ok: false, error, code?, fieldErrors? }`
(`lib/actions/types.ts`). Erro de validação (`ZodError`) e erro de domínio
(`AppError`) viram `ok: false`; qualquer outro erro é logado e vira mensagem
genérica. Detalhes em `lib/actions/create-action.ts`.

## Quem protege o quê

| Camada              | O que faz                                         | É a barreira real? |
| ------------------- | ------------------------------------------------- | ------------------ |
| `proxy.ts`          | redireciona quem não tem cookie                   | não (otimista)     |
| layout `(private)`  | exige sessão válida                               | não (pode pular)   |
| `page.tsx`          | `requireUser()` / `requireRole()`                 | **sim**            |
| action              | `requireUser()` + `roles` no `createAction`       | **sim**            |
| service             | dono do recurso (`userId`), 404 quando não é dele | **sim**            |
| menu (`nav.config`) | `roles` só esconde o link                         | não (visual)       |

Regra prática: **nunca confie só no proxy, no layout ou no menu**.
