import { z } from "zod";

import { ROLES } from "@/lib/auth/roles";

export const setUserRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(ROLES, { error: "Papel inválido" }),
});

export type SetUserRoleInput = z.infer<typeof setUserRoleSchema>;
