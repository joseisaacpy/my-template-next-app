"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

import { loginSchema, type LoginInput } from "../schemas/auth.schema";
import { AuthField } from "./auth-field";

interface LoginFormProps {
  /** Rota após login bem-sucedido. Padrão: `/dashboard`. */
  callbackURL?: string;
}

export function LoginForm({ callbackURL = "/dashboard" }: LoginFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setFormError(null);
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL,
    });

    if (error) {
      setFormError(error.message ?? "Não foi possível entrar");
      return;
    }

    router.push(callbackURL);
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

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm leading-none font-medium">
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

      {formError ? (
        <p className="text-sm text-destructive">{formError}</p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
