// Barrel seguro para client e server. O `noteService` (server-only) NÃO entra
// aqui — importe direto de `./services/note.service` nos módulos de servidor.
export { NOTES_PATH } from "./constants/note.constants";
export { NoteForm } from "./components/note-form";
export { NoteList } from "./components/note-list";
export { NotesEmptyState } from "./components/notes-empty-state";
export type { Note } from "./types/note.types";
export {
  createNoteSchema,
  updateNoteSchema,
  type NoteInput,
} from "./schemas/note.schema";
