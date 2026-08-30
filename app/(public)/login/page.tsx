import Link from "next/link";

import { AuthCard, LoginForm } from "@/features/auth";

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
