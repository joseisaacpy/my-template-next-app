import { z } from "zod";

/**
 * Regra de senha do projeto (ver `docs/features/auth.md`):
 * mínimo 8 caracteres, com maiúscula, minúscula, dígito e caractere especial.
 */
export const passwordSchema = z
  .string()
  .min(8, "Mínimo de 8 caracteres")
  .regex(/[A-Z]/, "Precisa de ao menos uma letra maiúscula")
  .regex(/[a-z]/, "Precisa de ao menos uma letra minúscula")
  .regex(/[0-9]/, "Precisa de ao menos um dígito")
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

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
