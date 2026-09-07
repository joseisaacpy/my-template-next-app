"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormError } from "@/components/ui/form-error";
import { SubmitButton } from "@/components/ui/submit-button";
import { authClient } from "@/lib/auth/auth-client";

import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "../schemas/auth.schema";
import { AuthField } from "./auth-field";

interface ForgotPasswordFormProps {
  /** Rota da tela de redefinição de senha. Padrão: `/reset-password`. */
  redirectTo?: string;
}

export function ForgotPasswordForm({
  redirectTo = "/reset-password",
}: ForgotPasswordFormProps) {
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordInput) {
    setFormError(null);
    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo,
    });

    if (error) {
      setFormError(error.message ?? "Não foi possível enviar o e-mail");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Se existir uma conta com esse e-mail, enviamos um link para redefinir a
        senha.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <AuthField
        label="E-mail"
        type="email"
        autoComplete="email"
        autoFocus
        error={errors.email?.message}
        {...register("email")}
      />

      <FormError>{formError}</FormError>

      <SubmitButton
        size="lg"
        className="w-full"
        loading={isSubmitting}
        loadingText="Enviando..."
      >
        Enviar link de recuperação
      </SubmitButton>
    </form>
  );
}
