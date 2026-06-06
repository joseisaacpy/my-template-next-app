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

- ⚡ Next.js (App Router)
- 🔷 TypeScript
- 🗄️ Prisma ORM
- 🐘 PostgreSQL (Neon)
- 🔐 Better Auth
- 🌐 Google OAuth
- 🎨 Tailwind CSS
- 🧩 shadcn/ui
- 📏 ESLint

---

## ✨ Recursos Inclusos

### Autenticação

- Login com Google
- Sessão persistente
- Better Auth configurado
- Estrutura preparada para Email/Senha

### Banco de Dados

- Prisma configurado
- PostgreSQL (Neon)
- Cliente Prisma centralizado

### Interface

- Tailwind CSS configurado
- shadcn/ui configurado
- Dark Mode
- Componentes reutilizáveis

### Arquitetura

- Feature-Based Architecture
- Separação entre domínio e infraestrutura
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
DATABASE_URL=
DIRECT_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

BETTER_AUTH_SECRET=
NEXT_PUBLIC_APP_URL=
```

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
src
├── app
│   ├── (public)
│   ├── (private)
│   └── api
│
├── components
│   ├── ui
│   ├── layout
│   ├── theme
│   └── shared
│
├── features
│   └── auth
│       ├── actions
│       ├── components
│       ├── hooks
│       ├── schemas
│       ├── services
│       ├── types
│       └── constants
│
├── lib
│   ├── auth
│   ├── db
│   ├── email
│   └── errors
│
└── prisma
```

---

## 🏗️ Arquitetura

O projeto utiliza uma abordagem **Feature-Based Architecture**.

Cada domínio da aplicação possui seus próprios arquivos:

```txt
features
└── auth
    ├── actions
    ├── components
    ├── hooks
    ├── schemas
    ├── services
    ├── types
    └── constants
```

Benefícios:

- Escalabilidade
- Organização por domínio
- Baixo acoplamento
- Fácil manutenção
- Melhor experiência para equipes

---

## 🔐 Autenticação

O projeto utiliza Better Auth com suporte a:

- Google OAuth
- Sessão persistente
- Server Components
- Route Handlers

A estrutura foi preparada para expansão futura com:

- Login por email e senha
- Recuperação de senha
- Verificação de email
- Multi-provider OAuth

---

## 🎨 Componentes UI

O template já vem preparado com:

- Button
- Dialog
- Form
- Input
- Toast
- Theme Toggle

E toda a infraestrutura do shadcn/ui configurada.

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

### Prisma

```bash
npx prisma db push
npx prisma studio
```

---

## 🛣️ Roadmap

- [ ] Email & Password Authentication
- [ ] Password Reset
- [ ] Email Verification
- [ ] Role Based Access Control (RBAC)
- [ ] Upload de Arquivos
- [ ] Resend Integration
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
