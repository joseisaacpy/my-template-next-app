# Auth

## Features

- login (email/senha)
- registro + verificação de e-mail obrigatória
- logout
- recuperação de senha (e-mail com token → `/reset-password`)
- login social Google / GitHub (opt-in por env)
- rotas privadas protegidas

## Regras

- email único
- senha: mínimo 8 chars, com maiúscula, minúscula, dígito e caractere especial
- verificação de e-mail obrigatória antes da 1ª sessão (`requireEmailVerification`)
- auto-login ao confirmar o e-mail (`autoSignInAfterVerification`)
- token de reset de senha expira em 1 hora
- rate limit por IP: 100 req/min, contador na tabela `rateLimit`
- redirect após login

## Fluxos

### Cadastro + verificação

1. `/register` → `authClient.signUp.email({ ..., callbackURL })`.
2. Form **não** redireciona: mostra "confirme seu e-mail" + botão reenviar.
3. Link do e-mail → `GET /api/auth/verify-email?token=...&callbackURL=...`
   (coberto pelo catch-all `app/api/auth/[...all]`). Com
   `autoSignInAfterVerification`, o usuário cai logado no `callbackURL`.

### Reset de senha

1. `/forgot-password` → `authClient.requestPasswordReset({ email, redirectTo: "/reset-password" })`.
2. Link do e-mail → `GET /api/auth/reset-password/:token` → redireciona para
   `/reset-password?token=...` (válido) ou `?error=INVALID_TOKEN` (expirado).
3. `/reset-password` (server) decide entre o form e a tela "link inválido".
4. Form → `authClient.resetPassword({ newPassword, token })` → `/login`.

### Login

`login-form` ramifica a mensagem por `error.code`: `EMAIL_NOT_VERIFIED`
(oferece reenvio), `INVALID_EMAIL_OR_PASSWORD` ("e-mail ou senha inválidos"),
status `429` ("muitas tentativas"). Cópia neutra, não revela qual campo falhou.

### Logout

`features/auth` → `<LogoutButton />` no `Header`: `authClient.signOut()` →
`router.push("/login")` + `router.refresh()`.

## Sessão no servidor

`lib/auth/session.ts`:

- `getSession()` — sessão ou `null`, memoizada por request (`cache()`).
- `requireSession()` — redireciona para `/login` se não houver.
- `requireUser()` — atalho para o usuário.

Use `requireUser()` em toda page e action privada. O `proxy.ts` é só a primeira
barreira (otimista, sem banco).

## Login social

`lib/auth/social-providers.ts` → `enabledSocialProviders()` lê os envs OAuth no
servidor. As pages `login`/`register` passam a lista aos forms; os botões +
divisor "ou" só aparecem quando há provedor configurado. Sem env, somem.
Adicionar provedor: registrar em `features/auth/constants/social-providers.tsx`,
ligar em `lib/auth/auth.ts` e incluir em `enabledSocialProviders()`.
