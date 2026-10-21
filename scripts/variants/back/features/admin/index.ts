// Barrel seguro para client e server. O `adminService` (server-only) NÃO entra
// aqui — importe direto de `./services/admin.service` nos módulos de servidor.
export type { AdminUser } from "./types/admin.types";
export {
  setUserRoleSchema,
  type SetUserRoleInput,
} from "./schemas/admin.schema";
