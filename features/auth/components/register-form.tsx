"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { SubmitButton } from "@/components/ui/submit-button";
import { authClient } from "@/lib/auth/auth-client";

import { registerSchema, type RegisterInput } from "../schemas/auth.schema";
import type { SocialProviderId } from "../constants/social-providers";
import { AuthField } from "./auth-field";
import { SocialAuthButtons } from "./social-auth-buttons";

interface RegisterFormProps {
  /** Destino do link de verificação de e-mail. Padrão: `/dashboard`. */
  callbackURL?: string;
  /** Provedores sociais habilitados (vem da page, server-side). */
  socialProviders?: SocialProviderId[];
}

export function RegisterForm({
  callbackURL = "/dashboard",
  socialProviders = [],
}: RegisterFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setFormError(null);
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL,
    });

    if (error) {
      setFormError(error.message ?? "Não foi possível criar a conta");
      return;
    }

    // requireEmailVerification está ligado: não há sessão ainda. Não
    // redireciona — mostra a tela de "confirme seu e-mail".
    setSentTo(values.email);
  }

  async function resend() {
    if (!sentTo) return;
    setResending(true);
    const { error } = await authClient.sendVerificationEmail({
      email: sentTo,
      callbackURL,
    });
    setResending(false);
    toast[error ? "error" : "success"](
      error
        ? "Não foi possível reenviar agora."
        : "E-mail de confirmação reenviado.",
    );
  }

  if (sentTo) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground text-sm">
          Enviamos um link de confirmação para <strong>{sentTo}</strong>. Abra o
          e-mail para ativar sua conta.
        </p>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={resend}
          disabled={resending}
        >
          {resending ? "Reenviando..." : "Reenviar e-mail"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {socialProviders.length > 0 ? (
        <>
          <SocialAuthButtons
            providers={socialProviders}
            callbackURL={callbackURL}
          />
          <div className="text-muted-foreground flex items-center gap-3 text-xs">
            <span className="bg-border h-px flex-1" />
            ou
            <span className="bg-border h-px flex-1" />
          </div>
        </>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <AuthField
          label="Nome"
          autoComplete="name"
          autoFocus
          error={errors.name?.message}
          {...register("name")}
        />
        <AuthField
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <AuthField
          label="Senha"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <AuthField
          label="Confirmar senha"
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
          loadingText="Criando conta..."
        >
          Criar conta
        </SubmitButton>
      </form>
    </div>
  );
}
