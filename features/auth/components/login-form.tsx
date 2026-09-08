"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { SubmitButton } from "@/components/ui/submit-button";
import { authClient } from "@/lib/auth/auth-client";

import { loginSchema, type LoginInput } from "../schemas/auth.schema";
import type { SocialProviderId } from "../constants/social-providers";
import { AuthField } from "./auth-field";
import { SocialAuthButtons } from "./social-auth-buttons";

interface LoginFormProps {
  /** Rota após login bem-sucedido. Padrão: `/dashboard`. */
  callbackURL?: string;
  /** Provedores sociais habilitados (vem da page, server-side). */
  socialProviders?: SocialProviderId[];
}

/** Mensagem por código de erro do better-auth. Não revela qual campo falhou. */
function messageFor(code: string | undefined, status: number): string {
  if (status === 429) return "Muitas tentativas. Tente de novo em instantes.";
  switch (code) {
    case "EMAIL_NOT_VERIFIED":
      return "Confirme seu e-mail antes de entrar.";
    case "INVALID_EMAIL_OR_PASSWORD":
      return "E-mail ou senha inválidos.";
    default:
      return "Não foi possível entrar.";
  }
}

export function LoginForm({
  callbackURL = "/dashboard",
  socialProviders = [],
}: LoginFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setFormError(null);
    setUnverifiedEmail(null);

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL,
    });

    if (error) {
      setFormError(messageFor(error.code, error.status ?? 0));
      if (error.code === "EMAIL_NOT_VERIFIED") {
        setUnverifiedEmail(values.email);
      }
      return;
    }

    router.push(callbackURL);
  }

  async function resendVerification() {
    if (!unverifiedEmail) return;
    setResending(true);
    const { error } = await authClient.sendVerificationEmail({
      email: unverifiedEmail,
      callbackURL,
    });
    setResending(false);
    toast[error ? "error" : "success"](
      error
        ? "Não foi possível reenviar agora."
        : "E-mail de confirmação reenviado.",
    );
  }

  return (
    <div className="space-y-6">
      {socialProviders.length > 0 ? (
        <>
          <SocialAuthButtons providers={socialProviders} callbackURL={callbackURL} />
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            ou
            <span className="h-px flex-1 bg-border" />
          </div>
        </>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <AuthField
          label="E-mail"
          type="email"
          autoComplete="email"
          autoFocus
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm leading-none font-medium"
            >
              Senha
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>
          <AuthField
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <FormError>{formError}</FormError>

        {unverifiedEmail ? (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={resendVerification}
            disabled={resending}
          >
            {resending ? "Reenviando..." : "Reenviar e-mail de confirmação"}
          </Button>
        ) : null}

        <SubmitButton
          size="lg"
          className="w-full"
          loading={isSubmitting}
          loadingText="Entrando..."
        >
          Entrar
        </SubmitButton>
      </form>
    </div>
  );
}
