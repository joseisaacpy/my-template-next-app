"use server";

import { createAction } from "@/lib/actions";

import { ADMIN_USERS_PATH } from "../constants/admin.constants";
import { setUserRoleSchema } from "../schemas/admin.schema";
import { adminService } from "../services/admin.service";

/** Só admin troca papéis (`roles`); o service ainda barra o auto-rebaixamento. */
export const setUserRoleAction = createAction({
  schema: setUserRoleSchema,
  roles: ["admin"],
  revalidate: [ADMIN_USERS_PATH],
  handler: (input, { user }) => adminService.setRole(user.id, input),
});
