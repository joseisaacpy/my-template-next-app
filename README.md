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
- ✉️ Nodemailer (SMTP Brevo)
- 🧪 Validação de env com Zod (`env.ts`)
- 📏 ESLint

---

## ✨ Recursos Inclusos

### Autenticação

- Login com email e senha
- Login social com Google e GitHub
- Recuperação de senha
- Verificação de email obrigatória
- Sessão persistente
- Rotas privadas protegidas (`app/(private)`)

### Banco de Dados

- Prisma configurado (adapter Neon)
- PostgreSQL (Neon)
- Cliente Prisma centralizado
- Seed pronto (`npm run seed`)

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
npm install
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

# Email SMTP (Brevo)
BREVO_SMTP_HOST=
BREVO_SMTP_PORT=
BREVO_SMTP_USER=
BREVO_SMTP_PASS=
BREVO_SENDER_NAME=
BREVO_SENDER_EMAIL=

# Cron
CRON_SECRET=
```

As variáveis são validadas na inicialização por `env.ts` (Zod). O build
falha cedo com mensagem clara se algo obrigatório estiver faltando.

---

## 🗄️ Banco de Dados

Aplicar schema:

```bash
npx prisma db push
```

Abrir Prisma Studio:

```bash
npx prisma studio
```

---

## ▶️ Executando o Projeto

Modo desenvolvimento:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

Build de produção:

```bash
npm run build
npm run start
```

---

## 🧱 Estrutura do Projeto

```txt
├── app
│   ├── (public)        # rotas abertas (home, login, register, forgot-password)
│   ├── (private)       # rotas protegidas (dashboard)
│   ├── api
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
│   ├── auth            # domínio de autenticação
│   │   ├── actions
│   │   ├── components
│   │   ├── constants
│   │   ├── hooks
│   │   ├── repositories
│   │   ├── schemas
│   │   ├── services
│   │   ├── types
│   │   └── utils
│   └── example         # feature de referência (CRUD) para copiar
│
├── lib
│   ├── auth            # Better Auth (server + client)
│   ├── db              # cliente Prisma
│   ├── email           # Nodemailer + templates
│   └── errors
│
├── docs                # arquitetura, decisões, roadmap
├── prisma              # schema.prisma + seed.ts
├── nav.config.ts       # navegação central
└── env.ts              # validação de variáveis de ambiente (Zod)
```

---

## 🏗️ Arquitetura

O projeto utiliza uma abordagem **Feature-Based Architecture**.

Cada domínio da aplicação possui seus próprios arquivos:

```txt
features
└── auth
    ├── actions        # Server Actions
    ├── components      # UI da feature
    ├── constants
    ├── hooks
    ├── repositories    # acesso a dados (Prisma)
    ├── schemas         # Zod
    ├── services        # regras de negócio
    ├── types
    └── utils
```

A pasta `features/example` traz um CRUD completo de referência com essa mesma
estrutura — copie e renomeie para criar uma nova feature.

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
- Recuperação de senha por email
- Verificação de email obrigatória
- Sessão persistente
- Telas prontas: `/login`, `/register`, `/forgot-password`
- Rotas privadas protegidas em `app/(private)`

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

Mais primitivos: `npx shadcn@latest add <componente>`.

---

## 🚀 Deploy

Pronto para deploy em:

- Vercel

Após configurar as variáveis de ambiente, basta realizar o deploy normalmente.

---

## 📜 Scripts

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

### Prisma

```bash
npx prisma db push   # aplica o schema
npx prisma studio    # abre o Studio
npm run seed         # popula o banco (prisma/seed.ts)
```

---

## 🛣️ Roadmap

- [x] Autenticação por email e senha
- [x] Recuperação de senha
- [x] Verificação de email
- [x] Login social (Google, GitHub)
- [ ] Role Based Access Control (RBAC)
- [ ] Upload de Arquivos
- [ ] Stripe Integration
- [ ] Docker
- [ ] CI/CD GitHub Actions
- [ ] Testes Automatizados
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
