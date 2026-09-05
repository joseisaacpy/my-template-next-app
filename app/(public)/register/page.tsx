import Link from "next/link";

import { AuthCard, RegisterForm } from "@/features/auth";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ route: "register" });

export default function RegisterPage() {
  return (
    <AuthCard
      title="Criar conta"
      description="Comece agora, leva menos de um minuto"
      footer={
        <>
          Já possui conta?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Entrar
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
