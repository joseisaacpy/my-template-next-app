/**
 * Content-Security-Policy estática (sem nonce). Cada diretiva numa linha pra
 * facilitar ler e editar.
 *
 * `'unsafe-inline'` é necessário porque o Next injeta scripts/estilos inline.
 * Para tirá-lo é preciso nonce por request via `proxy.ts`, o que força
 * renderização dinâmica em todas as páginas — por isso não está ligado aqui.
 * Veja `docs/decisions.md`.
 *
 * Usa uma nova origem externa (analytics, imagens, fontes, API)? Adicione-a
 * na diretiva correspondente abaixo, senão o navegador bloqueia.
 */
export function buildCsp(isDev: boolean, https: boolean): string {
  const directives = [
    "default-src 'self'",
    // React usa `eval` em dev (stacks de erro do servidor); em produção não.
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    // Mesmas origens de `images.remotePatterns` no next.config.ts.
    "img-src 'self' data: blob: https://avatars.githubusercontent.com",
    // `next/font/google` hospeda as fontes no próprio domínio.
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  // Só com HTTPS: em `http://localhost` (ex.: Docker) essa diretiva faz o
  // Safari tentar carregar os assets por https e a página quebra.
  if (https) directives.push("upgrade-insecure-requests");

  return directives.join("; ");
}

/**
 * Headers de segurança aplicados a toda resposta (ver `next.config.ts`).
 */
export const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: buildCsp(
      process.env.NODE_ENV !== "production",
      Boolean(process.env.NEXT_PUBLIC_BASE_URL?.startsWith("https://")),
    ),
  },
  // Impede o navegador de "adivinhar" o tipo do arquivo.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Bloqueia o site dentro de iframes (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Só envia a origem (sem path/query) para outros sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desliga APIs do navegador que o app não usa.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Força HTTPS por 2 anos, inclusive em subdomínios.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];
