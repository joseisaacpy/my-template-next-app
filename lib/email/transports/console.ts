import "server-only";

import { render } from "@react-email/render";

import type { EmailTransport } from "../types";

/**
 * Transporte padrão em desenvolvimento: não envia nada, só imprime o e-mail
 * (em texto) no terminal. Assim o fluxo de verificação/reset funciona sem
 * nenhuma chave de API — o link aparece no console.
 */
export const consoleTransport: EmailTransport = {
  name: "console",
  async send({ to, subject, react }) {
    const text = await render(react, { plainText: true });

    console.info(
      [
        "",
        "──────────────  ✉  e-mail (transporte: console)  ──────────────",
        `para:    ${to}`,
        `assunto: ${subject}`,
        "",
        text.trim(),
        "───────────────────────────────────────────────────────────────",
        "",
      ].join("\n"),
    );
  },
};
