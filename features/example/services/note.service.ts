import "server-only";

import { NotFoundError } from "@/lib/errors";

import { noteRepository } from "../repositories/note.repository";
import type { NoteInput } from "../schemas/note.schema";
import type { Note } from "../types/note.types";
import { toNoteDTO } from "../utils/note.utils";

/**
 * Regras de negócio de Nota + autorização. O service nunca confia num id
 * "solto": toda operação passa o `userId` da sessão e, se a nota não for
 * daquele usuário, responde `NotFoundError` (404, não 403 — não revela que o
 * recurso existe).
 */
export const noteService = {
  async list(userId: string): Promise<Note[]> {
    const rows = await noteRepository.listByUser(userId);
    return rows.map(toNoteDTO);
  },

  async get(id: string, userId: string): Promise<Note> {
    const row = await noteRepository.findByIdForUser(id, userId);
    if (!row) {
      throw new NotFoundError("Nota não encontrada.");
    }
    return toNoteDTO(row);
  },

  async create(userId: string, input: NoteInput): Promise<Note> {
    const row = await noteRepository.create(userId, input);
    return toNoteDTO(row);
  },

  async update(id: string, userId: string, input: NoteInput): Promise<Note> {
    const { count } = await noteRepository.update(id, userId, input);
    if (count === 0) {
      throw new NotFoundError("Nota não encontrada.");
    }
    return this.get(id, userId);
  },

  async remove(id: string, userId: string): Promise<void> {
    const { count } = await noteRepository.delete(id, userId);
    if (count === 0) {
      throw new NotFoundError("Nota não encontrada.");
    }
  },
};
