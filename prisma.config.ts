// Config das ferramentas de CLI do Prisma (migrate, db, studio, generate).
// Roda ANTES de `env.ts` — por isso lê `process.env` cru, sem validação Zod.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Campo espera um comando, não um caminho. Node 24 executa `.ts` nativo.
    seed: "node prisma/seed.ts",
  },
  datasource: {
    // Migrations e introspecção usam a conexão direta do Postgres (transações
    // longas, shadow database). Só cai na pooled se DIRECT_URL não existir.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
