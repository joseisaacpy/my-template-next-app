# 🚀 Next.js Fullstack SaaS Template

Template moderno e opinativo para construir aplicações SaaS com **Next.js**:
arquitetura **feature-based**, autenticação com papéis (RBAC) e banco já
configurados.

Desenvolva funcionalidades, não setup.

---

## 🛠️ Stack

- ⚡ Next.js 16 (App Router + Turbopack) · TypeScript
- 🗄️ Prisma ORM 7 + PostgreSQL (Neon)
- 🔐 Better Auth (e-mail/senha, Google, GitHub, papéis `user`/`admin`)
- 🎨 Tailwind CSS 4 · shadcn/ui · Sonner · Motion
- 📋 React Hook Form + Zod (validação de formulários e de `env.ts`)
- ✉️ Resend + React Email (sem chave, imprime o e-mail no terminal)
- 🧪 Vitest · 📏 ESLint + Prettier · 🪝 lefthook + commitlint · CI no GitHub Actions

## ✨ O que já vem pronto

- Login, cadastro com verificação de e-mail, recuperação de senha e login social (opt-in)
- Sessão validada no servidor, rotas privadas e área `/admin/users` por papel
- CRUD de referência (Notas) mostrando todas as camadas de uma feature
- Server actions tipadas (`createAction`) com validação Zod e tratamento de erro
- Headers de segurança + CSP, sitemap, robots, manifest e imagem OG
- Dark mode, estados de loading/erro/vazio

---

## 📦 Começando

Pré-requisitos: **Node 24**, **pnpm 10** (`corepack enable`) e **Docker** (ou uma
URL de Postgres, como o Neon).

Crie o seu projeto pelo botão **Use this template** do repositório no GitHub (ou
`git clone` e `rm -rf .git && git init`) e rode:

```bash
pnpm install
pnpm bootstrap   # cria o .env, gera o segredo, sobe o Postgres e aplica as migrações
pnpm db:seed     # (opcional) admin demo: admin@example.com / Admin@12345
pnpm dev         # http://localhost:3000
```

O `pnpm bootstrap` é seguro de repetir e não sobrescreve nada que você já
preencheu no `.env`. Quer usar o Neon? Coloque a `DATABASE_URL` no `.env` antes.
Todo o passo a passo, problemas comuns e o que ajustar depois do clone estão em
[`docs/getting-started.md`](docs/getting-started.md).

As variáveis são validadas por `env.ts`; o build falha cedo com mensagem clara
(use `SKIP_ENV_VALIDATION=1` em CI sem segredos). Para virar admin, cadastre-se
com um e-mail listado em `ADMIN_EMAILS`.

**Tudo em container?** Suba o Postgres e o app com Docker:

```bash
docker compose up --build   # http://localhost:3000
```

Veja [`docs/docker.md`](docs/docker.md).

---

## 📚 Documentação

Tudo sobre arquitetura, regras e decisões está em **[`docs/`](docs/README.md)**.
Por onde começar:

- [Arquitetura](docs/architecture.md) — mapa do projeto, camadas, auth, banco
- [Fluxo de uma request](docs/request-flow.md) — proxy, layout, page, action
- [Como adicionar uma feature](docs/how-to-add-a-feature.md) — e o que apagar do exemplo
- [Roadmap](docs/roadmap.md) — o que já foi feito e o que falta

---

## 📜 Scripts

```bash
pnpm dev            # desenvolvimento
pnpm build          # build de produção
pnpm start          # servir o build
pnpm lint           # ESLint
pnpm typecheck      # tsc --noEmit
pnpm test           # Vitest (test:watch para o modo watch)
pnpm format         # Prettier --write (format:check só verifica)

pnpm db:deploy      # aplica migrações (produção / setup)
pnpm db:migrate     # cria e aplica uma migração nova (dev)
pnpm db:push        # sincroniza sem migração (protótipo)
pnpm db:studio      # Prisma Studio
pnpm bootstrap      # primeiro setup: .env, banco e migrações
pnpm db:seed        # admin demo e notas de exemplo (só em banco local)

pnpm email:dev      # preview dos templates de e-mail (porta 3001)
```

## 🚀 Deploy

Pronto para a Vercel. Configure as variáveis de ambiente e faça o deploy.

## 🤝 Contribuição

Contribuições são bem-vindas: abra issues ou pull requests. Os commits seguem
[Conventional Commits](https://www.conventionalcommits.org/) (validados pelo
commitlint) e os git hooks formatam, rodam lint, typecheck e testes.

## 📄 Licença

MIT
