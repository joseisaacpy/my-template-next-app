import { Header } from "@/components/layout";

/**
 * Layout da área autenticada. Renderiza o `<Header />` com os itens
 * protegidos visíveis. A proteção de sessão em si fica no `proxy.ts`.
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
    </div>
  );
}
