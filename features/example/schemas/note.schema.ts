import { z } from "zod";

import { NOTE_CONTENT_MAX, NOTE_TITLE_MAX } from "../constants/note.constants";

/** Campos que o usuário edita. Base de create e update. */
export const noteInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Informe um título")
    .max(NOTE_TITLE_MAX, `No máximo ${NOTE_TITLE_MAX} caracteres`),
  content: z
    .string()
    .trim()
    .min(1, "Escreva algo")
    .max(NOTE_CONTENT_MAX, `No máximo ${NOTE_CONTENT_MAX} caracteres`),
});

export const createNoteSchema = noteInputSchema;

/** Update carrega o id do recurso junto (vem de um input hidden no form). */
export const updateNoteSchema = noteInputSchema.extend({
  id: z.string().min(1),
});

export const deleteNoteSchema = z.object({
  id: z.string().min(1),
});

export type NoteInput = z.infer<typeof noteInputSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
