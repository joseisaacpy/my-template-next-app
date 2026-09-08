"use server";

import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { NotFoundError } from "@/lib/errors";

import { NOTES_PATH } from "../constants/note.constants";
import { noteService } from "../services/note.service";

/**
 * Padrão 2: action "crua" para `<form action={deleteNoteAction}>` — sem estado
 * de retorno. Faz a checagem de sessão na mão e ignora "nota já não existe".
 */
export async function deleteNoteAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  try {
    await noteService.remove(id, user.id);
  } catch (error) {
    unstable_rethrow(error);
    if (!(error instanceof NotFoundError)) throw error;
  }

  revalidatePath(NOTES_PATH);
}
