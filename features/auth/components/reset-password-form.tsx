"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormError } from "@/components/ui/form-error";
import { SubmitButton } from "@/components/ui/submit-button";
import { authClient } from "@/lib/auth/auth-client";

import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "../schemas/auth.schema";
import { AuthField } from "./auth-field";

interface ResetPasswordFormProps {
  /** Token vindo do link do e-mail (`/reset-password?token=...`). */
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(values: ResetPasswordInput) {
    setFormError(null);
    const { error } = await authClient.resetPassword({
      newPassword: values.newPassword,
      token,
    });

    if (error) {
      setFormError(
        error.code === "INVALID_TOKEN"
          ? "Este link expirou ou já foi usado. Peça um novo."
          : (error.message ?? "Não foi possível redefinir a senha"),
      );
      return;
    }

    toast.success("Senha redefinida. Faça login com a nova senha.");
    router.push("/login");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <AuthField
        label="Nova senha"
        type="password"
        autoComplete="new-password"
        autoFocus
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <AuthField
        label="Confirmar nova senha"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <FormError>{formError}</FormError>

      <SubmitButton
        size="lg"
        className="w-full"
        loading={isSubmitting}
        loadingText="Salvando..."
      >
        Redefinir senha
      </SubmitButton>
    </form>
  );
}
