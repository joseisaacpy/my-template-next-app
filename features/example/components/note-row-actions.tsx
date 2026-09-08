"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { deleteNoteAction } from "../actions/delete-note";
import type { Note } from "../types/note.types";
import { NoteForm } from "./note-form";

export function NoteRowActions({ note }: { note: Note }) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex items-center justify-end gap-1">
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Editar nota">
            <PencilIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar nota</DialogTitle>
            <DialogDescription>
              Altere o título ou o conteúdo.
            </DialogDescription>
          </DialogHeader>
          <NoteForm note={note} onSaved={() => setEditing(false)} />
        </DialogContent>
      </Dialog>

      <form action={deleteNoteAction}>
        <input type="hidden" name="id" value={note.id} />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          aria-label="Excluir nota"
        >
          <Trash2Icon />
        </Button>
      </form>
    </div>
  );
}
