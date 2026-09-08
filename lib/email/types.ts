import type { ReactElement } from "react";

/** Uma mensagem de e-mail pronta para envio. O corpo é um componente React Email. */
export interface EmailMessage {
  to: string;
  subject: string;
  react: ReactElement;
}

/**
 * Contrato de um transporte de e-mail. Trocar de provedor = implementar isto.
 * Ver `transports/console.ts` (dev) e `transports/resend.ts` (produção).
 */
export interface EmailTransport {
  readonly name: string;
  send(message: EmailMessage): Promise<void>;
}
