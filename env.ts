import { z } from "zod";

/**
 * Validação centralizada das variáveis de ambiente.
 *
 * Importe `env` apenas em módulos server (auth, prisma, actions, route
 * handlers). No client, use `process.env.NEXT_PUBLIC_*` diretamente — o
 * Next.js inlina essas no bundle.
 *
 * Para pular a validação (ex.: build de CI sem segredos):
 *   SKIP_ENV_VALIDATION=1 pnpm build
 */
const envSchema = z.object({
  // Banco de dados
  DATABASE_URL: z.url(),
  DIRECT_URL: z.url().optional(),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(1, "defina BETTER_AUTH_SECRET"),
  NEXT_PUBLIC_BASE_URL: z.url(),

  // OAuth — opt-in por provedor (ver lib/auth/auth.ts)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // E-mail — sem RESEND_API_KEY o envio cai no transporte "console" (dev).
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("Meu Template <onboarding@resend.dev>"),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

function parseEnv(): z.infer<typeof envSchema> {
  if (process.env.SKIP_ENV_VALIDATION) {
    return process.env as unknown as z.infer<typeof envSchema>;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  • ${issue.path.join(".") || "(raiz)"}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `Variáveis de ambiente inválidas:\n${issues}\n\n` +
        "Copie .env.example para .env e preencha os valores.",
    );
  }

  return parsed.data;
}

export const env = parseEnv();
