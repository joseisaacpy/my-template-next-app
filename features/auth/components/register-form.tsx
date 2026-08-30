"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

import { registerSchema, type RegisterInput } from "../schemas/auth.schema";
import { AuthField } from "./auth-field";

interface RegisterFormProps {
  /** Rota após cadastro bem-sucedido. Padrão: `/dashboard`. */
  callbackURL?: string;
}

export function RegisterForm({ callbackURL = "/dashboard" }: RegisterFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

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

    // requireEmailVerification está ligado: pode não haver sessão ainda.
    setDone(true);
    router.push(callbackURL);
  }

  if (done) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Conta criada. Verifique seu e-mail para confirmar o acesso.
      </p>
    );
  }

  return (
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

      {formError ? (
        <p className="text-sm text-destructive">{formError}</p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
}
