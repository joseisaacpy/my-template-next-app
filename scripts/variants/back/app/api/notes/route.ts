import { createRoute } from "@/lib/api/create-route";
import { noteInputSchema } from "@/features/example/schemas/note.schema";
import { noteService } from "@/features/example/services/note.service";

/** GET /api/notes — notas do usuário logado. */
export const GET = createRoute({
  handler: ({ user }) => noteService.list(user.id),
});

/** POST /api/notes — cria uma nota. Corpo: `{ title, content }`. */
export const POST = createRoute({
  schema: noteInputSchema,
  status: 201,
  handler: ({ input, user }) => noteService.create(user.id, input),
});
