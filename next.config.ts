import type { NextConfig } from "next";

// Import relativo: o alias `@/` não é resolvido ao carregar o next.config.
import { securityHeaders } from "./lib/security/headers";

const nextConfig: NextConfig = {
  // Só o Dockerfile liga (NEXT_OUTPUT=standalone): gera uma pasta mínima com
  // `server.js`. Na Vercel e no `pnpm build` normal fica desligado.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
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
