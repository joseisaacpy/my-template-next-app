import "server-only";

import { prisma } from "@/lib/db/prisma";

import type { NoteInput } from "../schemas/note.schema";

/**
 * Acesso a dados de Nota. **Única camada que fala com o Prisma** — o service
 * chama isto, nunca o contrário. Toda query já é escopada por `userId`.
 */
export const noteRepository = {
  listByUser(userId: string) {
    return prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  findByIdForUser(id: string, userId: string) {
    return prisma.note.findFirst({ where: { id, userId } });
  },

  create(userId: string, data: NoteInput) {
    return prisma.note.create({ data: { ...data, userId } });
  },

  update(id: string, userId: string, data: NoteInput) {
    // updateMany + where userId: só atualiza se a nota for do usuário.
    return prisma.note.updateMany({ where: { id, userId }, data });
  },

  delete(id: string, userId: string) {
    return prisma.note.deleteMany({ where: { id, userId } });
  },
};
