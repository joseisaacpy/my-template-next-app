import { UsersTable } from "@/features/admin";
import { adminService } from "@/features/admin/services/admin.service";
import { requireRole } from "@/lib/auth/session";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ route: "admin" });

export default async function AdminUsersPage() {
  const admin = await requireRole("admin");
  const users = await adminService.listUsers();

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Usuários</h1>
        <p className="text-muted-foreground">
          Troque o papel de cada conta. A mudança pode levar até 5 minutos para
          valer na sessão do usuário (cache de cookie).
        </p>
      </div>

      <UsersTable users={users} currentUserId={admin.id} />
    </div>
  );
}
