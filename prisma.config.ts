// Config das ferramentas de CLI do Prisma (migrate, db, studio, generate).
// Roda ANTES de `env.ts` — por isso lê `process.env` cru, sem validação Zod.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Campo espera um comando, não um caminho. `tsx` roda o `.ts` resolvendo
    // os imports sem extensão do client gerado (o `node` puro não consegue).
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations e introspecção usam a conexão direta do Postgres (transações
    // longas, shadow database). Só cai na pooled se DIRECT_URL não existir
    // (`||`, não `??`: uma variável em branco no .env também conta como ausente).
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
