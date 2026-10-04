import type { Role } from "@/lib/auth/roles";

/** Usuário como a tela de admin enxerga (sem campos sensíveis). */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}
