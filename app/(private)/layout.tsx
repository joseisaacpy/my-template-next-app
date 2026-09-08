import { Footer, Header } from "@/components/layout";
import { requireSession } from "@/lib/auth/session";

/**
 * Layout da área autenticada.
 *
 * O `proxy.ts` faz a checagem otimista (só o cookie). A validação real da
 * sessão é aqui — e, para segurança de verdade, também em cada `page.tsx` e
 * cada server action via `requireUser()` (layouts podem não re-renderizar em
 * navegações parciais).
 */
export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireSession();

  return (
    <div className="flex min-h-dvh flex-col">
      <Header user={user} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
