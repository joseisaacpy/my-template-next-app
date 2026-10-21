import { createRoute } from "@/lib/api/create-route";
import { setUserRoleSchema } from "@/features/admin/schemas/admin.schema";
import { adminService } from "@/features/admin/services/admin.service";

/** PATCH /api/admin/users/:id/role — só admin. Corpo: `{ role }`. */
export const PATCH = createRoute({
  schema: setUserRoleSchema.pick({ role: true }),
  roles: ["admin"],
  handler: async ({ input, params, user }) => {
    await adminService.setRole(user.id, {
      userId: params.id,
      role: input.role,
    });
  },
});
