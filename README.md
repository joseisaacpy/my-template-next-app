# 🚀 Next.js Fullstack SaaS Template

Um template moderno e opinativo para construir aplicações SaaS com **Next.js**, utilizando uma arquitetura **Feature-Based**, autenticação pronta para produção e banco de dados configurado.

Desenvolva funcionalidades, não setup.

---

## ✨ O que este template resolve?

Configurar um projeto fullstack moderno normalmente exige:

- Next.js
- TypeScript
- Prisma
- PostgreSQL
- Autenticação
- UI Components
- Estrutura escalável

Esse template entrega tudo isso pronto para que você possa iniciar o desenvolvimento imediatamente.

---

## 🛠️ Stack

- ⚡ Next.js 16 (App Router + Turbopack)
- 🔷 TypeScript
- 🗄️ Prisma ORM 7 (adapter Neon)
- 🐘 PostgreSQL (Neon)
- 🔐 Better Auth (email/senha + Google + GitHub)
- 🎨 Tailwind CSS 4
- 🧩 shadcn/ui (estilo `radix-nova`)
- 📋 React Hook Form + Zod
- 🔔 Sonner (toasts)
- 🎞️ Motion + BProgress (transições e barra de progresso)
- ✉️ Resend + React Email (fallback: imprime o e-mail no terminal em dev)
- 🧪 Validação de env com Zod (`env.ts`)
- 📏 ESLint

---

## ✨ Recursos Inclusos

### Autenticação

- Login com email e senha
- Login social com Google e GitHub (opt-in por env — some quando não configurado)
- Recuperação de senha (e-mail com token → `/reset-password`)
- Verificação de email obrigatória + auto-login ao confirmar
- Logout + sessão validada no servidor (`lib/auth/session.ts`)
- Rate limit por IP na tabela `rateLimit`
- Rotas privadas protegidas (`app/(private)`)

### Banco de Dados

- Prisma 7 (generator `prisma-client`, adapter Neon)
- PostgreSQL (Neon)
- Cliente Prisma único (better-auth incluso)
- Models do better-auth + `Note` (exemplo) + `RateLimit`
- Migração inicial versionada (`prisma/migrations/`)
- Seed pronto (`pnpm db:seed`)

### Interface

- Tailwind CSS 4 configurado
- shadcn/ui configurado
- Dark Mode
- Barra de progresso e transições de página
- Componentes reutilizáveis + helpers de formulário

### Arquitetura

- Feature-Based Architecture
- Separação entre domínio e infraestrutura
- Navegação (`nav.config.ts`) e metadata (`lib/metadata.ts`) centralizadas
- Estrutura preparada para projetos SaaS

---

## 📦 Instalação

Crie um novo projeto utilizando este template:

```bash
npx create-next-app@latest -e https://github.com/joseisaacpy/my-template-next-app
```

Entre no diretório:

```bash
cd nome-do-projeto
```

Instale as dependências:

```bash
pnpm install
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Preencha com suas credenciais:

```env
# Banco (Neon)
DATABASE_URL=
DIRECT_URL=

# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# OAuth (opcional — cada provedor liga sozinho quando as duas chaves existem)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# E-mail (opcional — sem RESEND_API_KEY os e-mails saem no terminal)
RESEND_API_KEY=
EMAIL_FROM="Meu Template <onboarding@resend.dev>"
```

As variáveis são validadas na inicialização por `env.ts` (Zod). O build
falha cedo com mensagem clara se algo obrigatório estiver faltando
(use `SKIP_ENV_VALIDATION=1` em CI sem segredos).

---

## 🗄️ Banco de Dados

Aplicar as migrações no seu banco:

```bash
pnpm db:deploy      # produção / primeira vez
pnpm db:migrate     # cria uma migração nova durante o desenvolvimento
```

Iteração rápida sem migração e Prisma Studio:

```bash
pnpm db:push
pnpm db:studio
```

---

## ▶️ Executando o Projeto

Modo desenvolvimento:

```bash
pnpm dev
```

Acesse:

```txt
http://localhost:3000
```

Build de produção:

```bash
pnpm build
pnpm start
```

---

## 🧱 Estrutura do Projeto

```txt
├── app
│   ├── (public)        # rotas abertas (home, login, register, forgot/reset-password)
│   ├── (private)       # rotas protegidas (dashboard, notes)
│   ├── api
│   ├── sitemap.ts · robots.ts · manifest.ts · icon.tsx · apple-icon.tsx
│   └── providers.tsx   # theme, progress bar, page transitions
│
├── components
│   ├── ui              # primitivos shadcn + helpers de form
│   ├── layout          # Header, Footer, NavLink
│   ├── theme           # ThemeProvider, ThemeButton
│   ├── animations      # variantes Motion reutilizáveis
│   └── providers       # PageTransition
│
├── features
│   ├── auth            # domínio de autenticação (schemas, components, constants)
│   └── example         # CRUD de referência (Notas) — molde de feature
│       ├── actions · components · constants · hooks
│       ├── repositories · schemas · services · types · utils
│
├── lib
│   ├── actions         # createAction() + contrato ActionResult
│   ├── auth            # Better Auth (server + client + session DAL)
│   ├── db              # cliente Prisma único
│   ├── email           # Resend + React Email (+ fallback console)
│   └── errors          # AppError e subclasses de domínio
│
├── docs                # arquitetura, decisões, roadmap
├── prisma              # schema.prisma + migrations + seed.ts
├── nav.config.ts       # navegação central
└── env.ts              # validação de variáveis de ambiente (Zod)
```

---

## 🏗️ Arquitetura

O projeto utiliza uma abordagem **Feature-Based Architecture**.

Cada domínio da aplicação possui seus próprios arquivos:

```txt
features
└── example                 # CRUD de referência (Notas)
    ├── constants           # rota, limites de campo
    ├── schemas             # Zod (create / update / delete)
    ├── types               # DTO exposto ao client
    ├── utils               # row Prisma → DTO
    ├── repositories        # única camada que fala com o Prisma
    ├── services            # regras de negócio + checagem de dono
    ├── actions             # createAction() tipado + action crua (delete)
    ├── hooks               # useActionState + toast
    └── components          # form, list, row-actions, empty-state
```

Fluxo de uma operação: `component → action → service → repository → Prisma`.
A autorização vive no `service` (`findByIdForUser` → `NotFoundError`, nunca
`where: { id }` sem o `userId`). Copie a pasta e renomeie para criar uma feature.

Benefícios:

- Escalabilidade
- Organização por domínio
- Baixo acoplamento
- Fácil manutenção
- Melhor experiência para equipes

---

## 🔐 Autenticação

O projeto utiliza Better Auth com:

- Login por email e senha
- Login social com Google e GitHub (cada provedor liga sozinho quando as chaves existem)
- Recuperação de senha por email → tela `/reset-password` (token na URL)
- Verificação de email obrigatória, com auto-login ao confirmar
- Logout e sessão validada no servidor (`getSession` / `requireUser`)
- Rate limit persistido (`storage: "database"`)
- Telas prontas: `/login`, `/register`, `/forgot-password`, `/reset-password`
- Rotas privadas protegidas em `app/(private)`

Regra de senha: mínimo 8 caracteres, com maiúscula, minúscula, dígito e
caractere especial (`features/auth/schemas/auth.schema.ts`).

Preparado para expansão com:

- Novos provedores OAuth (GitLab, Discord, Microsoft, Apple, Facebook)
- Role Based Access Control (RBAC)

---

## 🎨 Componentes UI

Primitivos shadcn/ui (`components/ui`):

- `button`, `input`, `label`, `textarea`, `checkbox`, `select`
- `card`, `dialog`, `table`
- `sonner` (toasts) — `<Toaster />` já montado em `app/providers.tsx`

Helpers de formulário:

- `FormField` / `FormControl` / `useFormField` — label + controle + descrição + erro, com acessibilidade ligada
- `FormError` — mensagem de erro de nível de formulário
- `SubmitButton` — botão de submit com spinner e `disabled`/`aria-busy` automáticos (React Hook Form ou `useFormStatus`)

Mais primitivos: `pnpm dlx shadcn@latest add <componente>`.

## ⚙️ Server Actions

`lib/actions/createAction()` monta uma action tipada pronta para `useActionState`:
faz `requireUser()`, valida o `FormData` com um schema Zod, roda o handler,
revalida caminhos e redireciona. Erros de validação viram
`{ ok: false, fieldErrors }`; erros de domínio (`lib/errors`) viram
`{ ok: false, error, code }`; o resto é logado e vira mensagem genérica.
`features/example` mostra o padrão com wrapper (create/update) e o padrão de
action crua (delete).

---

## 🚀 Deploy

Pronto para deploy em:

- Vercel

Após configurar as variáveis de ambiente, basta realizar o deploy normalmente.

---

## 📜 Scripts

```bash
pnpm dev            # desenvolvimento
pnpm build          # build de produção
pnpm start          # servir o build
pnpm lint           # ESLint
pnpm typecheck      # tsc --noEmit

pnpm db:deploy      # aplica migrações (produção / setup)
pnpm db:migrate     # cria e aplica uma migração nova (dev)
pnpm db:push        # sincroniza sem migração (protótipo)
pnpm db:studio      # Prisma Studio
pnpm db:seed        # popula o banco (prisma/seed.ts)

pnpm email:dev      # preview dos templates de e-mail (porta 3001)
```

---

## 🛣️ Roadmap

- [x] Autenticação por email e senha
- [x] Recuperação de senha (link com token → `/reset-password`)
- [x] Verificação de email (com auto-login)
- [x] Login social (Google, GitHub)
- [x] Logout + sessão no servidor
- [x] CRUD de referência (Notas) + camada de server actions tipada
- [ ] `LICENSE` (MIT — arquivo pendente)
- [ ] Testes (Vitest) e CI/CD (GitHub Actions)
- [ ] Prettier + git hooks
- [ ] Role Based Access Control (RBAC)
- [ ] Upload de Arquivos
- [ ] Stripe Integration
- [ ] Docker
- [ ] Internacionalização (i18n)

---

## 🤝 Contribuição

Contribuições são bem-vindas.

Sinta-se à vontade para abrir issues, enviar sugestões ou criar pull requests.

---

## 📄 Licença

MIT

---

Feito para acelerar o desenvolvimento de aplicações SaaS modernas com Next.js.
