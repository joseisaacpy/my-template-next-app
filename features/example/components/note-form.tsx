"use client";

import { FormControl, FormField } from "@/components/ui/form-field";
import { FormError } from "@/components/ui/form-error";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";

import { createNoteAction } from "../actions/create-note";
import { updateNoteAction } from "../actions/update-note";
import {
  NOTE_CONTENT_MAX,
  NOTE_TITLE_MAX,
} from "../constants/note.constants";
import { useNoteForm } from "../hooks/use-note-form";
import type { Note } from "../types/note.types";

interface NoteFormProps {
  /** Passe a nota para editar; omita para criar. */
  note?: Note;
  /** Chamado após salvar com sucesso (ex.: fechar o dialog). */
  onSaved?: () => void;
}

export function NoteForm({ note, onSaved }: NoteFormProps) {
  const editing = Boolean(note);
  const { state, formAction } = useNoteForm(
    editing ? updateNoteAction : createNoteAction,
    editing ? "Nota atualizada." : "Nota criada.",
    onSaved,
  );

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const formError =
    state && !state.ok && !state.fieldErrors ? state.error : null;

  return (
    <form action={formAction} className="space-y-4">
      {note ? <input type="hidden" name="id" defaultValue={note.id} /> : null}

      <FormField
        label="Título"
        error={fieldErrors?.title?.[0]}
        inputProps={{
          name: "title",
          defaultValue: note?.title,
          maxLength: NOTE_TITLE_MAX,
          autoComplete: "off",
          required: true,
        }}
      />

      <FormField label="Conteúdo" error={fieldErrors?.content?.[0]}>
        <FormControl>
          <Textarea
            name="content"
            rows={4}
            defaultValue={note?.content}
            maxLength={NOTE_CONTENT_MAX}
            required
          />
        </FormControl>
      </FormField>

      <FormError>{formError}</FormError>

      <SubmitButton loadingText="Salvando...">
        {editing ? "Salvar alterações" : "Adicionar nota"}
      </SubmitButton>
    </form>
  );
}
