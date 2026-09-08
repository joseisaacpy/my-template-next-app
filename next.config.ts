import type { NextConfig } from "next";

/**
 * Headers de segurança aplicados a toda resposta. Conjunto conservador que
 * não quebra o app fora da caixa.
 *
 * Um `Content-Security-Policy` mais rígido depende de nonce por request
 * (middleware) por causa dos scripts inline do Next — deixado como próximo
 * passo, não ligado aqui para não travar o template.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
