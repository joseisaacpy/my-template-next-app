import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";

import { env } from "@/env";
import { isAdminEmail } from "@/lib/auth/roles";
import { prisma } from "@/lib/db/prisma";
import { ResetPassword, VerifyEmail, sendEmail } from "@/lib/email";

const SECOND = 1;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Só registra um provedor social quando as credenciais existem no ambiente.
 * Assim o template funciona sem OAuth configurado e cada provedor é opt-in
 * por variável de ambiente.
 */
function buildSocialProviders(): BetterAuthOptions["socialProviders"] {
  const providers: NonNullable<BetterAuthOptions["socialProviders"]> = {};

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    };
  }

  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    };
  }

  return providers;
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  secret: env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: HOUR,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Redefina sua senha",
        react: ResetPassword({ url, name: user.name }),
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Confirme seu e-mail",
        react: VerifyEmail({ url, name: user.name }),
      });
    },
  },

  session: {
    expiresIn: 7 * DAY,
    updateAge: 1 * DAY,
    // Lê a sessão do cookie assinado por até 5 min antes de bater no banco.
    cookieCache: { enabled: true, maxAge: 5 * MINUTE },
  },

  // Memória é inútil em serverless (cada invocação é um processo novo) — o
  // contador vive na tabela `rateLimit` (ver prisma/schema.prisma).
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 1 * MINUTE,
    max: 100,
  },

  // Origens aceitas em callbacks/redirects. Adicione as URLs de preview da
  // Vercel aqui se for usar OAuth em deploy de preview.
  trustedOrigins: [env.NEXT_PUBLIC_BASE_URL],

  socialProviders: buildSocialProviders(),

  databaseHooks: {
    user: {
      create: {
        // Bootstrap do primeiro admin: e-mail listado em `ADMIN_EMAILS` nasce
        // com papel "admin". Seguro porque o cadastro exige e-mail verificado.
        async before(user) {
          if (!isAdminEmail(user.email, env.ADMIN_EMAILS)) return;
          return { data: { ...user, role: "admin" } };
        },
      },
    },
  },

  plugins: [
    // Papéis padrão "user" e "admin" (ver lib/auth/roles.ts).
    admin(),
    // `nextCookies` intercepta a resposta para gravar os cookies de sessão em
    // server actions — precisa ser o ÚLTIMO plugin do array.
    nextCookies(),
  ],
});
