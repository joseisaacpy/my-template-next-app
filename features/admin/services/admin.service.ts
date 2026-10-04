import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";
import { hasRole } from "@/lib/auth/roles";
import { ForbiddenError } from "@/lib/errors";

import { ADMIN_USERS_LIMIT } from "../constants/admin.constants";
import type { SetUserRoleInput } from "../schemas/admin.schema";
import type { AdminUser } from "../types/admin.types";

/**
 * Regras de administração de usuários. Quem chama já foi autorizado pelo
 * `createAction({ roles })` / `requireRole()`; os endpoints do plugin admin
 * checam a permissão de novo (defesa em profundidade).
 */
export const adminService = {
  async listUsers(): Promise<AdminUser[]> {
    const { users } = await auth.api.listUsers({
      headers: await headers(),
      query: {
        limit: ADMIN_USERS_LIMIT,
        sortBy: "createdAt",
        sortDirection: "desc",
      },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: hasRole(user, "admin") ? "admin" : "user",
      createdAt: user.createdAt,
    }));
  },

  async setRole(actorId: string, input: SetUserRoleInput): Promise<void> {
    // Evita o admin se trancar para fora ao rebaixar a si mesmo.
    if (actorId === input.userId) {
      throw new ForbiddenError("Você não pode alterar o seu próprio papel.");
    }

    await auth.api.setRole({
      headers: await headers(),
      body: { userId: input.userId, role: input.role },
    });
  },
};
