import "server-only";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import type { z } from "zod";

import { requireUser } from "@/lib/auth/session";

import { toActionError } from "./to-action-error";
import type { ActionResult } from "./types";

type SessionUser = Awaited<ReturnType<typeof requireUser>>;

interface CreateActionConfig<Schema extends z.ZodType, Data> {
  /** Schema Zod aplicado ao `FormData` (via `Object.fromEntries`). */
  schema: Schema;
  /** Lógica de negócio. Recebe o input já validado e o usuário da sessão. */
  handler: (
    input: z.output<Schema>,
    ctx: { user: SessionUser },
  ) => Promise<Data>;
  /** Caminhos a revalidar após sucesso. */
  revalidate?: string[];
  /** Redireciona para cá após sucesso (a action não retorna nesse caso). */
  redirectTo?: string;
}

/**
 * Monta uma server action tipada pronta para `useActionState`.
 *
 * Faz, na ordem: `requireUser()` → valida o `FormData` → `handler` →
 * `revalidatePath` → `redirect` → `{ ok: true, data }`. Qualquer `ZodError`
 * ou `AppError` vira `{ ok: false, ... }`; o resto é logado e some atrás de
 * uma mensagem genérica. `unstable_rethrow` roda primeiro no `catch` para não
 * engolir os `redirect()`.
 *
 * @example
 * "use server";
 * export const createNoteAction = createAction({
 *   schema: createNoteSchema,
 *   revalidate: ["/notes"],
 *   handler: (input, { user }) => noteService.create(user.id, input),
 * });
 */
export function createAction<Schema extends z.ZodType, Data = void>(
  config: CreateActionConfig<Schema, Data>,
) {
  return async function action(
    _prevState: ActionResult<Data> | undefined,
    formData: FormData,
  ): Promise<ActionResult<Data>> {
    try {
      const user = await requireUser();

      const parsed = config.schema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return toActionError(parsed.error);
      }

      const data = await config.handler(parsed.data as z.output<Schema>, {
        user,
      });

      for (const path of config.revalidate ?? []) {
        revalidatePath(path);
      }

      if (config.redirectTo) {
        redirect(config.redirectTo);
      }

      return { ok: true, data };
    } catch (error) {
      unstable_rethrow(error);
      return toActionError(error);
    }
  };
}
