"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import type { ActionResult } from "@/lib/actions";

import type { Note } from "../types/note.types";

type NoteFormAction = (
  prev: ActionResult<Note> | undefined,
  formData: FormData,
) => Promise<ActionResult<Note>>;

/**
 * Liga uma action de nota (`createNoteAction` / `updateNoteAction`) a um
 * `<form action>`: expõe `state` (com `fieldErrors`), `formAction` e `pending`,
 * e dispara um toast a cada resultado novo.
 */
export function useNoteForm(
  action: NoteFormAction,
  successMessage: string,
  onSuccess?: () => void,
) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const seen = useRef<typeof state>(undefined);

  useEffect(() => {
    if (state === seen.current) return;
    seen.current = state;
    if (!state) return;

    if (state.ok) {
      toast.success(successMessage);
      onSuccess?.();
    } else if (!state.fieldErrors) {
      toast.error(state.error);
    }
  }, [state, successMessage, onSuccess]);

  return { state, formAction, pending };
}
