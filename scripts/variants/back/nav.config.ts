/**
 * Identidade do projeto. Na variante só-API não há menu nem rotas de página,
 * então sobra apenas o que os e-mails (`lib/email/templates`) consomem.
 */
export const site = {
  name: "Meu Template",
  /** Nome curto do produto. */
  shortName: "Template",
  description: "Template Next.js back-end com API, auth e banco prontos.",
  /** URL pública, sem barra no final. */
  url: (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  locale: "pt-BR",
} as const;
