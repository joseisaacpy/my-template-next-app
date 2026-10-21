// Barrel seguro para client e server. O `noteService` (server-only) NÃO entra
// aqui — importe direto de `./services/note.service` nos módulos de servidor.
export type { Note } from "./types/note.types";
export {
  createNoteSchema,
  noteInputSchema,
  updateNoteSchema,
  type NoteInput,
} from "./schemas/note.schema";
