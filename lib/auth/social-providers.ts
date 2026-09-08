import "server-only";

import { env } from "@/env";
import type { SocialProviderId } from "@/features/auth/constants/social-providers";

/**
 * Provedores sociais realmente configurados (credenciais no ambiente).
 * As credenciais OAuth são server-only, então esta checagem tem de acontecer
 * no servidor — as pages `login`/`register` passam a lista para os forms.
 * Sem env OAuth, os botões somem sozinhos.
 */
export function enabledSocialProviders(): SocialProviderId[] {
  const providers: SocialProviderId[] = [];

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.push("google");
  }
  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    providers.push("github");
  }

  return providers;
}
