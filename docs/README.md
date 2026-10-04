# Documentação

Ponto de partida para quem acabou de clonar o template. Comece pelo
[README da raiz](../README.md) (instalação e scripts) e siga esta ordem:

| #   | Doc                                                | Leia quando                                                     |
| --- | -------------------------------------------------- | --------------------------------------------------------------- |
| 1   | [architecture.md](architecture.md)                 | quer o mapa do projeto: pastas, camadas, auth, banco            |
| 2   | [request-flow.md](request-flow.md)                 | quer entender o caminho de uma request e de uma server action   |
| 3   | [how-to-add-a-feature.md](how-to-add-a-feature.md) | vai criar uma funcionalidade (ou limpar o exemplo para começar) |
| 4   | [constitution.md](constitution.md)                 | quer as regras de código do projeto, curtas e diretas           |
| 5   | [routing.md](routing.md)                           | vai criar uma página, mexer no menu ou na metadata              |
| 6   | [features/auth.md](features/auth.md)               | vai mexer em login, sessão ou papéis (RBAC)                     |
| 7   | [testing.md](testing.md)                           | vai escrever ou rodar testes                                    |
| 8   | [decisions.md](decisions.md)                       | quer saber **por que** algo foi feito assim antes de mudar      |
| 9   | [roadmap.md](roadmap.md)                           | quer ver o que já foi feito e o que falta                       |

## Em uma frase cada

- **Arquitetura:** features por domínio, com as camadas
  `component → action → service → repository → Prisma`.
- **Segurança:** o `proxy.ts` só olha o cookie; a barreira de verdade fica na
  page (`requireUser` / `requireRole`), na action e no service.
- **Erros:** server actions devolvem `ActionResult`; erro esperado nunca é `throw`.
- **Fonte de verdade:** rotas em `nav.config.ts`, variáveis em `env.ts` e
  `.env.example`, exemplo vivo em `features/example`.

> O projeto usa Next.js 16, que tem mudanças em relação a versões antigas
> (por exemplo `proxy.ts` no lugar de `middleware.ts`). Em caso de dúvida,
> consulte `node_modules/next/dist/docs/` — ver `AGENTS.md`.
