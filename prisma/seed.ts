import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "../lib/generated/prisma/client";

/**
 * Seed do banco. Roda com `pnpm db:seed` (ou `pnpm prisma db seed`).
 *
 * Não semeia usuários: o hash de senha é responsabilidade do better-auth —
 * crie contas pelo fluxo de cadastro (`/register`).
 */
const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Defina DATABASE_URL (ou DIRECT_URL) no .env antes de semear.");
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
});

async function main() {
  // Exemplo — descomente e ajuste conforme os seus models:
  //
  // const user = await prisma.user.findFirst();
  // if (user) {
  //   await prisma.note.createMany({
  //     data: [
  //       { title: "Primeira nota", content: "Conteúdo de exemplo.", userId: user.id },
  //     ],
  //   });
  // }

  console.log("Seed concluído (nada a inserir — edite prisma/seed.ts).");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
