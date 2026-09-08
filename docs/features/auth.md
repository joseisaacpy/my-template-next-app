# Auth

## Features

- login
- register
- logout
- forgot password
- protected routes

## Regras

- email único
- senha: mínimo 8 chars, com maiúscula, minúscula, dígito e caractere especial
- verificação de e-mail obrigatória antes da 1ª sessão (`requireEmailVerification`)
- auto-login ao confirmar o e-mail (`autoSignInAfterVerification`)
- token de reset de senha expira em 1 hora
- rate limit por IP: 100 req/min, contador na tabela `rateLimit`
- redirect após login

## Fluxo

visitante -> login -> dashboard
