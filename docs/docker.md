# Docker

Duas formas de usar, as duas com **Postgres em container** (sem conta no Neon):

| Quero                                  | Comando                                |
| -------------------------------------- | -------------------------------------- |
| subir tudo (banco + migração + app)    | `docker compose up --build`            |
| só o banco, app rodando com `pnpm dev` | `docker compose up -d db` + `pnpm dev` |

## O que tem

- **`Dockerfile`** (multi-stage) com dois _targets_ usados pelo compose:
  - `migrate` — roda `prisma migrate deploy` e sai;
  - `runner` — o app Next.js em modo standalone (imagem final, usuário não-root).
- **`docker-compose.yml`** com 3 serviços:
  - `db` — `postgres:17-alpine`, dados no volume `db-data`;
  - `migrate` — aplica as migrações assim que o banco está saudável;
  - `app` — só sobe depois que a migração terminou com sucesso.
- **`.dockerignore`** — `.env*`, `node_modules`, `.next` e afins ficam fora da imagem.

## Tudo em container

1. `cp .env.example .env` e defina **`BETTER_AUTH_SECRET`**
   (`openssl rand -base64 32`). As outras variáveis são opcionais.
2. `docker compose up --build`
3. Abra `http://localhost:3000`.

Não precisa definir `DATABASE_URL` nem `DATABASE_DRIVER`: o compose já aponta o
app para o serviço `db` e usa o driver `pg`.

**E-mails** (verificação, reset de senha): sem `RESEND_API_KEY` eles saem no log —
`docker compose logs -f app`. Copie o link de lá.

**Admin:** coloque seu e-mail em `ADMIN_EMAILS` no `.env` **antes** de se cadastrar.

## Só o banco, app no host

```bash
docker compose up -d db
```

O jeito mais simples é `pnpm bootstrap` (ver [getting-started.md](getting-started.md)):
ele cria o `.env`, sobe este banco e aplica as migrações. Depois, `pnpm dev`.

À mão, no `.env`:

```env
DATABASE_DRIVER=pg
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app
```

e `pnpm db:deploy`. Prisma Studio (`pnpm db:studio`) e
`pnpm db:migrate` também funcionam contra esse banco.

## Variáveis do compose

Lidas do `.env` (todas opcionais, exceto o segredo do auth):

| Variável                              | Padrão                          | Para quê                                      |
| ------------------------------------- | ------------------------------- | --------------------------------------------- |
| `BETTER_AUTH_SECRET`                  | —                               | **obrigatória** para o app subir              |
| `NEXT_PUBLIC_BASE_URL`                | `http://localhost:3000`         | URL pública do site (ver aviso abaixo)        |
| `APP_PORT` / `DB_PORT`                | `3000` / `5432`                 | portas no host (use se já estiverem ocupadas) |
| `POSTGRES_USER` / `_PASSWORD` / `_DB` | `postgres` / `postgres` / `app` | credenciais do banco do compose               |
| `ADMIN_EMAILS`, `RESEND_API_KEY`      | vazio                           | iguais ao `.env.example`                      |

> **Atenção — `NEXT_PUBLIC_BASE_URL` é embutida no build.** Se mudar a URL (ou a
> `APP_PORT`), reconstrua: `docker compose up --build`. Ela precisa ser igual à
> URL real em que você acessa, senão o login falha (`trustedOrigins`).

## Dois drivers de banco

O Prisma usa um _adapter_ para falar com o Postgres, escolhido por
`DATABASE_DRIVER` (`lib/db/adapter.ts`):

- `neon` (padrão): driver serverless do Neon — só funciona com o Neon.
- `pg`: driver comum do Postgres — use com container ou Postgres local.

Quem usa Neon não precisa mudar nada.

## Comandos úteis

```bash
docker compose logs -f app     # logs (e links de e-mail); nível em LOG_LEVEL
docker compose down            # para tudo, mantém os dados
docker compose down -v         # para tudo E apaga o banco (volume)
docker compose build app       # reconstrói só o app
```

## Em produção

A imagem `runner` serve para qualquer host de containers. Pontos de atenção:

- passe `BETTER_AUTH_SECRET`, `DATABASE_URL`, `DATABASE_DRIVER` e
  `NEXT_PUBLIC_BASE_URL` como variáveis de ambiente (a validação de `env.ts` roda
  na subida; faltou algo, o container não inicia);
- rode a imagem `migrate` antes de subir uma versão nova;
- com **várias réplicas**, defina a mesma `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`
  (no build) em todas — ver `node_modules/next/dist/docs/01-app/02-guides/self-hosting.md`;
- em HTTPS, o build com `NEXT_PUBLIC_BASE_URL=https://...` liga o
  `upgrade-insecure-requests` na CSP automaticamente.
