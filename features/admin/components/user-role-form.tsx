"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ROLES, type Role } from "@/lib/auth/roles";

import { setUserRoleAction } from "../actions/set-user-role";

interface UserRoleFormProps {
  userId: string;
  role: Role;
  /** Desabilita a troca (ex.: a própria conta do admin logado). */
  disabled?: boolean;
}

/** Select de papel + botão salvar para uma linha da tabela de usuários. */
export function UserRoleForm({ userId, role, disabled }: UserRoleFormProps) {
  const [state, formAction, pending] = useActionState(
    setUserRoleAction,
    undefined,
  );
  const seen = useRef<typeof state>(undefined);

  useEffect(() => {
    if (state === seen.current) return;
    seen.current = state;
    if (!state) return;

    if (state.ok) toast.success("Papel atualizado.");
    else toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="flex items-center justify-end gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={role}
        disabled={disabled || pending}
        aria-label="Papel do usuário"
        className="border-input bg-background h-8 rounded-md border px-2 text-sm disabled:opacity-50"
      >
        {ROLES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm" disabled={disabled || pending}>
        Salvar
      </Button>
    </form>
  );
}
