"use server";

import { createAction } from "@/lib/actions";

import { NOTES_PATH } from "../constants/note.constants";
import { createNoteSchema } from "../schemas/note.schema";
import { noteService } from "../services/note.service";

/** Padrão 1: action tipada via wrapper (auth + validação + revalidate prontos). */
export const createNoteAction = createAction({
  schema: createNoteSchema,
  revalidate: [NOTES_PATH],
  handler: (input, { user }) => noteService.create(user.id, input),
});
