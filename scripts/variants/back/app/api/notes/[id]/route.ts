import { createRoute } from "@/lib/api/create-route";
import { noteInputSchema } from "@/features/example/schemas/note.schema";
import { noteService } from "@/features/example/services/note.service";

/** GET /api/notes/:id */
export const GET = createRoute({
  handler: ({ params, user }) => noteService.get(params.id, user.id),
});

/** PATCH /api/notes/:id — corpo: `{ title, content }`. */
export const PATCH = createRoute({
  schema: noteInputSchema,
  handler: ({ input, params, user }) =>
    noteService.update(params.id, user.id, input),
});

/** DELETE /api/notes/:id */
export const DELETE = createRoute({
  handler: async ({ params, user }) => {
    await noteService.remove(params.id, user.id);
  },
});
