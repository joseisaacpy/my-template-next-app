import { createMetadata } from "@/lib/metadata";
import { requireUser } from "@/lib/auth/session";

export const metadata = createMetadata({ route: "dashboard" });

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Olá, {user.name || user.email}</h1>
      <p className="text-muted-foreground">
        Esta página só é acessível com sessão ativa.
      </p>
    </div>
  );
}
