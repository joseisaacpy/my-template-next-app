import { requireRole } from "@/lib/auth/session";

/**
 * Gate da área admin: quem não é admin vê 404. Cada `page.tsx` daqui também
 * chama `requireRole("admin")` — layouts podem não re-renderizar em navegações
 * parciais, então a page é a barreira de verdade.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");

  return children;
}
