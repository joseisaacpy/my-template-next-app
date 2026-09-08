import Link from "next/link";

import { AuthCard, ResetPasswordForm } from "@/features/auth";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  route: "resetPassword",
  noIndex: true,
});

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  // O GET /api/auth/reset-password/:token redireciona para cá com ?token=
  // (válido) ou ?error=INVALID_TOKEN (expirado / adulterado).
  if (!token || error) {
    return (
      <AuthCard
        title="Link inválido"
        description="Este link de redefinição expirou ou já foi usado."
        footer={
          <Link
            href="/forgot-password"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Pedir um novo link
          </Link>
        }
      >
        <p className="text-muted-foreground text-center text-sm">
          Solicite um novo e-mail de recuperação para continuar.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Nova senha"
      description="Escolha uma senha para voltar a acessar sua conta"
      footer={
        <Link
          href="/login"
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          Voltar para o login
        </Link>
      }
    >
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
