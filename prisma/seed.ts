import "dotenv/config";

import { randomUUID } from "node:crypto";

import { hashPassword } from "better-auth/crypto";

import { createAdapter } from "../lib/db/adapter";
import { PrismaClient } from "../lib/generated/prisma/client";

/**
 * Seed de desenvolvimento. Roda com `pnpm db:seed` (via `tsx`, ver
 * `prisma.config.ts`) e pode ser repetido: não duplica nada.
 *
 * Cria um admin de demonstração, já com e-mail verificado — dá para entrar
 * direto em `/login`, sem passar pelo e-mail de verificação — e algumas notas.
 * O hash da senha é feito com o mesmo código do better-auth, então o login
 * funciona normalmente.
 *
 * É uma credencial **conhecida**, por isso o seed recusa rodar em produção ou
 * em banco que não seja local (veja `assertSafeToSeed`).
 */
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Defina DATABASE_URL no .env antes de semear (ou rode `pnpm bootstrap`).",
  );
}

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1", "[::1]", "db"];

/** Impede criar uma conta com senha conhecida num banco que não é de dev. */
function assertSafeToSeed(url: string) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("O seed não roda com NODE_ENV=production.");
  }

  const host = new URL(url).hostname;
  if (!LOCAL_HOSTS.includes(host) && process.env.SEED_ALLOW_REMOTE !== "1") {
    throw new Error(
      `O banco "${host}" não parece local. O seed cria um admin com senha ` +
        "conhecida; se é mesmo um banco de desenvolvimento, rode com " +
        "SEED_ALLOW_REMOTE=1.",
    );
  }
}

assertSafeToSeed(connectionString);

const prisma = new PrismaClient({
  adapter: createAdapter(
    connectionString,
    process.env.DATABASE_DRIVER === "pg" ? "pg" : "neon",
  ),
});

async function main() {
  const passwordHash = await hashPassword(ADMIN_PASSWORD);

  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });
  const user = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: { role: "admin", emailVerified: true },
      })
    : await prisma.user.create({
        data: {
          id: randomUUID(),
          name: "Admin Demo",
          email: ADMIN_EMAIL,
          emailVerified: true,
          role: "admin",
        },
      });

  // Login por e-mail/senha = uma `Account` com providerId "credential".
  const account = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" },
  });
  if (account) {
    await prisma.account.update({
      where: { id: account.id },
      data: { password: passwordHash },
    });
  } else {
    await prisma.account.create({
      data: {
        id: randomUUID(),
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: passwordHash,
      },
    });
  }

  const noteCount = await prisma.note.count({ where: { userId: user.id } });
  if (noteCount === 0) {
    await prisma.note.createMany({
      data: [
        {
          title: "Bem-vindo ao template",
          content: "Esta nota veio do seed (prisma/seed.ts). Edite ou apague.",
          userId: user.id,
        },
        {
          title: "Como funciona",
          content: "Notas são o CRUD de referência: veja features/example.",
          userId: user.id,
        },
        {
          title: "Próximos passos",
          content: "Leia docs/getting-started.md e crie a sua feature.",
          userId: user.id,
        },
      ],
    });
  }

  console.log("Seed concluído.");
  console.log(`  Login: ${ADMIN_EMAIL}`);
  console.log(`  Senha: ${ADMIN_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
