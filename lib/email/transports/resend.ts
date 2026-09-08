import "server-only";

import { Resend } from "resend";

import { env } from "@/env";

import type { EmailMessage, EmailTransport } from "../types";

/**
 * Transporte de produção via Resend (https://resend.com).
 * Ativado automaticamente quando `RESEND_API_KEY` existe no ambiente
 * (ver `send-email.ts`). O remetente vem de `EMAIL_FROM`.
 */
export function createResendTransport(apiKey: string): EmailTransport {
  const resend = new Resend(apiKey);

  return {
    name: "resend",
    async send({ to, subject, react }: EmailMessage) {
      const { error } = await resend.emails.send({
        from: env.EMAIL_FROM,
        to,
        subject,
        react,
      });

      if (error) {
        throw new Error(`Falha ao enviar e-mail (Resend): ${error.message}`);
      }
    },
  };
}
