import { z } from "zod";

/**
 * Regra de senha do projeto (ver `docs/features/auth.md`):
 * mínimo 8 caracteres, ao menos uma letra maiúscula e um caractere especial.
 */
export const passwordSchema = z
  .string()
  .min(8, "Mínimo de 8 caracteres")
  .regex(/[A-Z]/, "Precisa de ao menos uma letra maiúscula")
  .regex(/[^A-Za-z0-9]/, "Precisa de ao menos um caractere especial");

export const emailSchema = z.email("E-mail inválido");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe a senha"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
