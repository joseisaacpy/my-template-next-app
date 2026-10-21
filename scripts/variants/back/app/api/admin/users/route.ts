import { createRoute } from "@/lib/api/create-route";
import { adminService } from "@/features/admin/services/admin.service";

/** GET /api/admin/users — só admin. */
export const GET = createRoute({
  roles: ["admin"],
  handler: () => adminService.listUsers(),
});
