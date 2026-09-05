import { Footer, Header } from "@/components/layout";

/**
 * Layout da área autenticada. Renderiza o `<Header />` com os itens
 * protegidos visíveis. A checagem otimista de sessão fica no `proxy.ts`;
 * a validação real deve ser feita aqui ou nas server actions.
 */
export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header authenticated />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
