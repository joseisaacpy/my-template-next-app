import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Qual driver o Prisma usa para falar com o Postgres:
 *
 * - `neon` (padrão): o driver serverless do Neon, que fala com o banco por
 *   WebSocket. Só funciona com o Neon.
 * - `pg`: o driver comum do Postgres (TCP). Use com Postgres local ou em Docker.
 *
 * Escolha com `DATABASE_DRIVER` (ver `.env.example`).
 *
 * Este arquivo não importa `@/env` de propósito: o `prisma/seed.ts` roda fora
 * do Next e também usa esta função.
 */
export type DatabaseDriver = "neon" | "pg";

export function createAdapter(
  connectionString: string,
  driver: DatabaseDriver,
) {
  return driver === "pg"
    ? new PrismaPg({ connectionString })
    : new PrismaNeon({ connectionString });
}
