/**
 * Papéis do app. Fonte única dos nomes: use `ROLES` / `Role` em vez de
 * strings soltas. Para criar um papel novo, é preciso registrá-lo também no
 * plugin `admin` (ver `docs/decisions.md`).
 *
 * Client-safe: não importa nada de servidor.
 */
export const ROLES = ["user", "admin"] as const;

export type Role = (typeof ROLES)[number];

/**
 * `true` se o usuário tem ao menos um dos papéis informados.
 * Conta sem `role` (criada antes do RBAC) conta como "user". O plugin admin
 * guarda vários papéis como "a,b", por isso o split.
 */
export function hasRole(
  user: { role?: string | null },
  ...roles: Role[]
): boolean {
  const userRoles = (user.role ?? "user").split(",").map((r) => r.trim());
  return roles.some((role) => userRoles.includes(role));
}

/**
 * `true` se o e-mail está em `ADMIN_EMAILS` (lista separada por vírgula,
 * sem diferenciar maiúsculas). Usado só na criação da conta.
 */
export function isAdminEmail(email: string, adminEmails?: string): boolean {
  if (!adminEmails) return false;

  return adminEmails
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.trim().toLowerCase());
}
