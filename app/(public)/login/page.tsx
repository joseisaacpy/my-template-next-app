import Link from "next/link";

import { AuthCard, LoginForm } from "@/features/auth";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ route: "login" });

export default function LoginPage() {
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
      <LoginForm />
    </AuthCard>
  );
}
