# 🚀 Next.js Fullstack Template

Template moderno para aplicações fullstack usando **Next.js (App Router)** com um stack completo pronto para produção.

---

## ✨ Stack

- ⚡ Next.js (App Router + TypeScript)
- 🗄️ Prisma ORM + PostgreSQL (Neon)
- 🔐 Better Auth (Google OAuth)
- 🎨 shadcn/ui + Tailwind CSS

---

## 📦 Instalação

Crie um novo projeto usando este template:

```bash
npx create-next-app@latest -e https://github.com/joseisaacpy/my-template-next-ap
```

Entre na pasta:

```bash
cd nome-do-projeto
```

---

## ⚙️ Configuração

### 1. Variáveis de ambiente

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

### 2. Banco de dados

Execute:

```bash
npx prisma db push
```

Opcional (visualizar banco):

```bash
npx prisma studio
```

---

### 3. Rodar o projeto

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

---

## 🧱 Estrutura do projeto

```bash
src/
  app/            # App Router
  components/     # Componentes UI
  lib/            # Helpers e configs
  prisma/           # Schema do banco
```

---

## 🔐 Autenticação

O projeto já vem configurado com:

- Estrutura de arquivos base, pronta para expansão (email/senha, etc)

---

## 🗄️ Banco de dados

- Prisma configurado
- Pronto para usar com Neon

---

## 🎨 UI

- shadcn/ui configurado
- Componentes incluídos:
  - Button
  - Form
  - Dialog
  - Toast

---

## ⚠️ Importante

- O arquivo `.env` **não é versionado**
- Use sempre `.env.example` como base

---

## 📜 Scripts úteis

```bash
npm run dev        # iniciar projeto
npm run build      # build produção
npm run start      # rodar build
```

Prisma:

```bash
npx prisma db push
npx prisma studio
```

---

## 🚀 Deploy

Pode ser facilmente deployado em:

- Vercel

---

## 💡 Objetivo

Esse template existe para:

- evitar setup repetitivo
- padronizar projetos
- acelerar desenvolvimento

---

## 🧠 Futuras melhorias (opcional)

- tRPC
- Upload de arquivos
- Logs estruturados
- Error handling centralizado

---

## 📄 Licença

MIT
