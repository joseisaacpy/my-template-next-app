import type { Note as NoteRow } from "@/lib/generated/prisma/client";

import type { Note } from "../types/note.types";

/** Linha crua do Prisma → DTO enviado ao client. */
export function toNoteDTO(row: NoteRow): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatNoteDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}
