# Primeiros passos

Do clone ao login em 4 comandos.

## Pré-requisitos

- **Node 24** (`nvm use` lê o `.nvmrc`) e **pnpm 10** (`corepack enable` ativa a
  versão do `package.json`). Com outra versão, o `pnpm install` falha de propósito
  (`engine-strict` no `.npmrc`).
- **Docker**, para o Postgres local. Se preferir o Neon, não precisa (veja abaixo).

## Rodando

Crie o seu projeto pelo botão **Use this template** do repositório no GitHub (ou
`git clone <url> meu-app && cd meu-app && rm -rf .git && git init`) e:

```bash
pnpm install
pnpm bootstrap   # cria o .env, gera o segredo, sobe o Postgres e migra
pnpm db:seed     # (opcional) admin demo e algumas notas
pnpm dev         # http://localhost:3000
```

O `pnpm bootstrap` (`scripts/setup.ts`) é seguro de repetir: só preenche o que
está **em branco** no `.env`, nunca sobrescreve o que você já definiu.

### Escolhendo o tipo de projeto

Na primeira vez, o `pnpm bootstrap` pergunta o que você vai construir e **poda** o
que não precisa (`scripts/prune.ts`):

| Modo    | Fica                                               | Sai                                                                                    |
| ------- | -------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `full`  | Tudo: interface, auth, banco, e-mail e Docker      | Nada (só o próprio script de poda)                                                     |
| `front` | Interface (Tailwind, shadcn, Motion, tema)         | Banco, auth, e-mail, Docker, telas de login e área privada                             |
| `back`  | API (route handlers), auth, banco, e-mail e Docker | Páginas, componentes, Tailwind, shadcn, server actions e a checagem de cookie do proxy |

Para não ser perguntado: `pnpm bootstrap --mode=back` (acrescente `--yes` para
pular a confirmação). A poda só roda com a árvore git **limpa e com ao menos um
commit**; assim `git restore . && git clean -fd` desfaz tudo. Depois dela rodam
`pnpm install`, `typecheck`, `lint` e `test`.

> Os arquivos de `docs/` e o README continuam descrevendo o template completo:
> ajuste-os ao seu projeto.

#### API do modo `back`

Sem telas, as server actions de exemplo viram route handlers em `app/api/*`,
montados com `createRoute` (`lib/api/create-route.ts`): sessão → papéis →
validação do corpo JSON → handler. Toda resposta segue
`{ ok: true, data }` ou `{ ok: false, error, code, fieldErrors? }`.

| Rota                                  | O que faz                           |
| ------------------------------------- | ----------------------------------- |
| `GET /api/health`                     | Health check público                |
| `GET`/`POST /api/notes`               | Lista / cria notas do usuário       |
| `GET`/`PATCH`/`DELETE /api/notes/:id` | Lê / edita / apaga uma nota         |
| `GET /api/admin/users`                | Lista usuários (admin)              |
| `PATCH /api/admin/users/:id/role`     | Troca o papel de um usuário (admin) |

Rotas com corpo exigem `Content-Type: application/json` (415 caso contrário).
O login e o cadastro seguem os endpoints do better-auth em `/api/auth/*`; os
links dos e-mails de verificação e de redefinição apontam para eles, e quem
consome a API decide para onde redirecionar (`callbackURL`).

### Login de demonstração

Depois do `pnpm db:seed`, entre em `/login` com:

- e-mail: `admin@example.com`
- senha: `Admin@12345`

É um admin com e-mail já verificado. Troque com `SEED_ADMIN_EMAIL` e
`SEED_ADMIN_PASSWORD` no `.env`. Como é uma credencial **conhecida**, o seed
recusa rodar com `NODE_ENV=production` e em banco que não seja local
(a menos que você defina `SEED_ALLOW_REMOTE=1` sabendo o que está fazendo).

Sem o seed, cadastre-se em `/register`: o link de verificação aparece no terminal
do `pnpm dev`. Para virar admin, ponha o seu e-mail em `ADMIN_EMAILS` **antes**
de se cadastrar.

## Usando o Neon em vez do Docker

1. Crie o banco no Neon e coloque a URL em `DATABASE_URL` no `.env`
   (`DATABASE_DRIVER=neon`, o padrão).
2. Rode `pnpm bootstrap`: com `DATABASE_URL` já preenchido, ele **não** mexe no
   banco nem no Docker; só gera o segredo e aplica as migrações.
   (Se preferir fazer à mão: `cp .env.example .env`, gere o segredo com
   `openssl rand -base64 32` e rode `pnpm db:deploy`.)

## Problemas comuns

| Sintoma                                      | O que fazer                                                                                   |
| -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `port is already allocated` ao subir o banco | A 5432 está ocupada. Defina `DB_PORT=5433` no `.env` e rode `pnpm bootstrap`.                 |
| `Variáveis de ambiente inválidas`            | Leia a lista: cada linha diz qual variável e por quê. `pnpm bootstrap` resolve a maioria.     |
| `Unsupported engine` no `pnpm install`       | Use Node 24 e pnpm 10 (ver pré-requisitos).                                                   |
| Aviso do `lefthook` no `pnpm install`        | Normal fora de um repo git. Rode `git init` e `pnpm install` de novo para ligar os git hooks. |

## Depois do clone

- [ ] `package.json`: troque o `name` (`meu-template`).
- [ ] `nav.config.ts`: `site.name`, `shortName`, `description`, `repoUrl` e `author`.
- [ ] `LICENSE`: nome do autor.
- [ ] Home (`app/(public)/_components/home-view.tsx`): é a vitrine do template —
      troque pelo conteúdo do seu produto.
- [ ] Apague o exemplo de Notas quando não precisar mais dele — veja
      [how-to-add-a-feature.md](how-to-add-a-feature.md#começando-um-projeto-o-que-apagar-do-exemplo).
- [ ] Opcional: login social (`GOOGLE_*`, `GITHUB_*`) e envio de e-mail
      (`RESEND_API_KEY`) no `.env`.

Para entender o projeto, siga a ordem do [índice](README.md).
