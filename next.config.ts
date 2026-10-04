import type { NextConfig } from "next";

// Import relativo: o alias `@/` não é resolvido ao carregar o next.config.
import { securityHeaders } from "./lib/security/headers";

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
