# Decisions

## Auth

Better Auth

Motivo:

- integração simples
- suporte App Router
- prisma adapter

## ORM

Prisma

Motivo:

- tipagem forte
- produtividade

## RBAC

Plugin `admin` do Better Auth com papéis padrão `user` e `admin`

Motivo:

- já traz `role`, ban e troca de papel (`auth.api.setRole`)
- checagem simples: `hasRole()` / `requireRole()` / `createAction({ roles })`
- primeiro admin via `ADMIN_EMAILS` (só na criação da conta)

Evolução: permissões por recurso com `createAccessControl` (plugin admin) quando
dois papéis não bastarem. O papel pode ficar até 5 min defasado na sessão
(`cookieCache`) após uma troca.

## CSP (Content-Security-Policy)

CSP estática em `lib/security/headers.ts`, com `'unsafe-inline'` em script/style

Motivo:

- simples: um arquivo, sem middleware
- páginas continuam estáticas/cacheáveis (nonce força renderização dinâmica)
- já bloqueia iframes, plugins, `<base>` e origens externas não listadas

Evolução: nonce por request via `proxy.ts` (guia `content-security-policy` na doc do Next).
Nova origem externa (analytics, imagens, fontes)? Edite `lib/security/headers.ts`.

## Estilo

TailwindCSS
ShadcnUI

Motivo:

- velocidade
- consistência
- componentização
