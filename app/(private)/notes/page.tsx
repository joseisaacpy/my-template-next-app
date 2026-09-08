import { NoteForm, NoteList, NotesEmptyState } from "@/features/example";
import { noteService } from "@/features/example/services/note.service";
import { requireUser } from "@/lib/auth/session";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ route: "notes" });

export default async function NotesPage() {
  const user = await requireUser();
  const notes = await noteService.list(user.id);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Notas</h1>
        <p className="text-muted-foreground">
          Fatia vertical completa (schema → repository → service → action →
          UI). Copie <code>features/example</code> como molde.
        </p>
      </div>

      <div className="rounded-xl border p-4">
        <NoteForm />
      </div>

      {notes.length > 0 ? <NoteList notes={notes} /> : <NotesEmptyState />}
    </div>
  );
}
