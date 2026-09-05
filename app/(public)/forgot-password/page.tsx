import Link from "next/link";

import { AuthCard, ForgotPasswordForm } from "@/features/auth";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ route: "forgotPassword" });

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Recuperar senha"
      description="Enviaremos um link para redefinir sua senha"
      footer={
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Voltar para o login
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
