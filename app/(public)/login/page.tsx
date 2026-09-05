import Link from "next/link";

import { AuthCard, LoginForm } from "@/features/auth";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ route: "login" });

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  // `?redirect=` vem do proxy.ts. Só aceita caminho interno (evita open redirect).
  const callbackURL =
    redirect?.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : undefined;

  return (
    <AuthCard
      title="Entrar"
      description="Acesse sua conta para continuar"
      footer={
        <>
          Não tem conta?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Criar conta
          </Link>
        </>
      }
    >
      <LoginForm callbackURL={callbackURL} />
    </AuthCard>
  );
}
