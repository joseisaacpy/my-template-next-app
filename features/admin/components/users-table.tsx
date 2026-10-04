import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { AdminUser } from "../types/admin.types";
import { UserRoleForm } from "./user-role-form";

interface UsersTableProps {
  users: AdminUser[];
  /** Id do admin logado — a própria linha fica travada. */
  currentUserId: string;
}

/** Tabela de usuários. Server Component; só o select de papel é client. */
export function UsersTable({ users, currentUserId }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuário</TableHead>
          <TableHead className="text-right">Papel</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <p className="font-medium">{user.name}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </TableCell>
            <TableCell className="text-right">
              <UserRoleForm
                userId={user.id}
                role={user.role}
                disabled={user.id === currentUserId}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
