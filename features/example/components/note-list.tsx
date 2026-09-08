import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Note } from "../types/note.types";
import { formatNoteDate } from "../utils/note.utils";
import { NoteRowActions } from "./note-row-actions";

/** Tabela de notas. Server Component — só recebe os DTOs já prontos. */
export function NoteList({ notes }: { notes: Note[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead className="hidden sm:table-cell">Criada em</TableHead>
          <TableHead className="w-24 text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notes.map((note) => (
          <TableRow key={note.id}>
            <TableCell>
              <p className="font-medium">{note.title}</p>
              <p className="line-clamp-1 text-sm text-muted-foreground">
                {note.content}
              </p>
            </TableCell>
            <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
              {formatNoteDate(note.createdAt)}
            </TableCell>
            <TableCell className="text-right">
              <NoteRowActions note={note} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
