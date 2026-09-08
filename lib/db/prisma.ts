import { PrismaNeon } from "@prisma/adapter-neon";

import { env } from "@/env";
import { PrismaClient } from "@/lib/generated/prisma/client";

/**
 * Client Prisma único do app (better-auth incluso — ver `lib/auth/auth.ts`).
 *
 * O singleton em `globalThis` evita abrir um pool novo do Neon a cada
 * hot-reload do `next dev`. Em produção cada instância tem o seu.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaNeon({
      connectionString: env.DATABASE_URL,
    }),
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
