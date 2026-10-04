# Decisões

Registro curto das decisões de arquitetura (formato ADR leve). Cada uma tem
**Status**, **Contexto**, **Decisão**, **Alternativas** e **Consequências**.
Quando as alternativas não foram registradas na época, está escrito.

Para mudar algo daqui, atualize a decisão (ou crie uma nova e marque a antiga
como "Substituída") — não apague o histórico.

---

## 1. Better Auth para autenticação

- **Status:** aceita
- **Contexto:** o template precisa de login por e-mail/senha e social, com
  App Router e Prisma.
- **Decisão:** Better Auth, com o adapter Prisma (`lib/auth/auth.ts`).
- **Alternativas:** não registradas.
- **Consequências:** integração simples com o App Router e com o banco. A sessão
  vive em cookie assinado com cache de 5 min (`cookieCache`); o plugin
  `nextCookies()` precisa ser o **último** da lista de plugins.

## 2. Prisma + PostgreSQL (Neon)

- **Status:** aceita
- **Contexto:** tipagem forte e produtividade; o deploy alvo é serverless.
- **Decisão:** Prisma 7 com o adapter Neon (`@prisma/adapter-neon`) e cliente
  único em `lib/db/prisma.ts`. Migrações usam `DIRECT_URL` quando existe
  (`prisma.config.ts`).
- **Alternativas:** não registradas.
- **Consequências:** o client é gerado em `lib/generated/prisma` (ignorado pelo
  git, recriado no `postinstall`).

## 3. Tailwind + shadcn/ui

- **Status:** aceita
- **Contexto:** velocidade e consistência visual.
- **Decisão:** Tailwind CSS 4 e componentes shadcn/ui em `components/ui`.
- **Alternativas:** não registradas.
- **Consequências:** os primitivos são código do projeto (podem ser editados);
  novos componentes entram com `pnpm dlx shadcn@latest add <componente>`.

## 4. Camadas por feature e autorização por dono (404, não 403)

- **Status:** aceita
- **Contexto:** o template precisa de um padrão que um júnior consiga copiar sem
  abrir brecha de acesso a dados de outro usuário.
- **Decisão:** `component → action → service → repository → Prisma`. Só o
  repository toca o Prisma. Toda busca por id passa o `userId`; recurso de outro
  usuário responde `NotFoundError` (404), não 403, para não revelar que existe.
- **Alternativas:** responder 403 (descartada: confirma que o recurso existe).
- **Consequências:** mais arquivos por feature. Quando a fonte de dados é o
  Better Auth (`features/admin`), o service chama `auth.api` e não há repository.

## 5. Server actions devolvem `ActionResult`

- **Status:** aceita
- **Contexto:** no React 19, erro de validação é um valor de retorno consumido
  por `useActionState`, não uma exceção.
- **Decisão:** toda action retorna `{ ok: true, data }` ou
  `{ ok: false, error, code?, fieldErrors? }` (`lib/actions/types.ts`).
  `createAction()` monta o fluxo padrão; `throw` fica para o inesperado.
- **Alternativas:** não registradas.
- **Consequências:** o client ramifica por `code` (ex.: `FORBIDDEN`). Erros
  desconhecidos são logados e viram mensagem genérica.

## 6. `proxy.ts` otimista; validação real na page/action

- **Status:** aceita
- **Contexto:** o Proxy roda antes do cache e não serve para I/O lento; layouts
  podem não re-renderizar em navegações parciais.
- **Decisão:** `proxy.ts` só verifica a presença do cookie de sessão. A
  validação de verdade acontece no DAL (`lib/auth/session.ts`), chamado por cada
  page e action.
- **Alternativas:** checar sessão ou papel no proxy (descartada: sem acesso
  barato ao banco, divergiria do servidor).
- **Consequências:** duas listas de prefixos privados — `PRIVATE_PREFIXES` no
  proxy e `privatePathPrefixes()` em `nav.config.ts` — que precisam coincidir.

## 7. Rate limit persistido em banco

- **Status:** aceita
- **Contexto:** memória não serve em serverless (cada invocação é um processo
  novo).
- **Decisão:** `rateLimit.storage = "database"`, 100 req/min, na tabela
  `rateLimit`.
- **Alternativas:** memória (descartada pelo motivo acima).
- **Consequências:** o contador vive no banco, com custo de I/O por request.

## 8. RBAC com o plugin `admin` do Better Auth

- **Status:** aceita
- **Contexto:** precisamos de áreas restritas sem reinventar ban e troca de
  papel.
- **Decisão:** plugin `admin()` com os papéis padrão `user` e `admin`. Checagem
  por papel: `hasRole()`, `requireRole()` (page → 404) e
  `createAction({ roles })` (action → `FORBIDDEN`). Primeiro admin via
  `ADMIN_EMAILS`, aplicado na criação da conta.
- **Alternativas:** `createAccessControl` com permissões por recurso (mais
  flexível, mais conceitos); campo `role` próprio no Prisma (sem ban nem
  `setRole` prontos).
- **Consequências:** o papel pode ficar até 5 min defasado na sessão após uma
  troca (`cookieCache`). Evoluir para permissões por recurso exige
  `createAccessControl` no servidor e no `adminClient()`.

## 9. CSP estática, sem nonce

- **Status:** aceita
- **Contexto:** o Next injeta scripts e estilos inline.
- **Decisão:** CSP estática em `lib/security/headers.ts`, com `'unsafe-inline'`
  em script/style e `'unsafe-eval'` só em dev (o React usa `eval` para stacks de
  erro em desenvolvimento).
- **Alternativas:** nonce por request via `proxy.ts` (mais forte, mas força
  renderização dinâmica em todas as páginas).
- **Consequências:** páginas continuam estáticas/cacheáveis. Já bloqueia
  iframes, plugins, `<base>` e origens externas não listadas — nova origem
  (analytics, imagens, fontes) exige editar `lib/security/headers.ts`.

## 10. Vitest, testes unitários ao lado do código

- **Status:** aceita
- **Contexto:** feedback rápido para schemas, services e helpers.
- **Decisão:** Vitest em ambiente `node`, arquivos `*.test.ts` colocalizados,
  `server-only` trocado por stub.
- **Alternativas:** não registradas.
- **Consequências:** sem testes de componente nem e2e por enquanto; testes de
  integração com banco estão no [roadmap](roadmap.md). Ver [testing.md](testing.md).

## 11. E-mail com transporte `console` como fallback

- **Status:** aceita
- **Contexto:** o template deve rodar sem conta no Resend.
- **Decisão:** `lib/email` com `sendEmail` + `EmailTransport`. Sem
  `RESEND_API_KEY`, o e-mail é impresso no terminal; com a chave, vai pelo Resend.
- **Alternativas:** não registradas.
- **Consequências:** verificação de e-mail e reset de senha funcionam em dev
  copiando o link do terminal.

## 12. Dois drivers de banco, escolhidos por `DATABASE_DRIVER`

- **Status:** aceita
- **Contexto:** o adapter do Neon fala com o banco por WebSocket e não conecta
  num Postgres comum, então o template só rodava com conta no Neon.
- **Decisão:** `lib/db/adapter.ts` cria `PrismaNeon` ou `PrismaPg` conforme
  `DATABASE_DRIVER` (`neon` por padrão). O compose usa `pg`.
- **Alternativas:** detectar o driver pelo host da URL (descartada: mágica que
  confunde); usar só `adapter-pg` (descartada: muda o comportamento em produção
  de quem já usa o Neon em serverless).
- **Consequências:** uma env nova e uma dependência a mais. O `prisma/seed.ts`
  e o app usam a mesma função.

## 13. Imagem standalone com migração em serviço separado

- **Status:** aceita
- **Contexto:** a imagem de produção deve ser enxuta, e `prisma migrate deploy`
  precisa do CLI do Prisma, que é dependência de desenvolvimento.
- **Decisão:** `Dockerfile` multi-stage. O _target_ `migrate` (com todas as
  dependências) aplica as migrações e sai; o _target_ `runner` só leva o
  `.next/standalone`. `output: "standalone"` só liga com `NEXT_OUTPUT=standalone`,
  para não afetar o deploy na Vercel.
- **Alternativas:** rodar a migração no entrypoint do app (descartada: leva o
  CLI e dependências de dev na imagem final, e cada réplica tentaria migrar).
- **Consequências:** `NEXT_PUBLIC_BASE_URL` é embutida no build (mudar a URL
  exige reconstruir a imagem). A CSP só inclui `upgrade-insecure-requests` quando
  essa URL é https, porque em `http://localhost` a diretiva quebra o Safari.
