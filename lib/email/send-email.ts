import "server-only";

import { env } from "@/env";

import { consoleTransport } from "./transports/console";
import { createResendTransport } from "./transports/resend";
import type { EmailMessage, EmailTransport } from "./types";

/**
 * Escolha do transporte, uma vez por processo:
 * - com `RESEND_API_KEY` → envia de verdade via Resend;
 * - sem a chave → imprime no console (padrão em dev).
 */
const transport: EmailTransport = env.RESEND_API_KEY
  ? createResendTransport(env.RESEND_API_KEY)
  : consoleTransport;

/** Envia um e-mail pelo transporte configurado. */
export function sendEmail(message: EmailMessage): Promise<void> {
  return transport.send(message);
}
