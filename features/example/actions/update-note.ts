"use server";

import { createAction } from "@/lib/actions";

import { NOTES_PATH } from "../constants/note.constants";
import { updateNoteSchema } from "../schemas/note.schema";
import { noteService } from "../services/note.service";

export const updateNoteAction = createAction({
  schema: updateNoteSchema,
  revalidate: [NOTES_PATH],
  handler: ({ id, ...data }, { user }) => noteService.update(id, user.id, data),
});
