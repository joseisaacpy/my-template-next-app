"use client";

import { cn } from "@/lib/utils";

import {
  DEFAULT_SOCIAL_PROVIDERS,
  type SocialProviderId,
} from "../constants/social-providers";
import {
  SocialAuthButton,
  type SocialAuthButtonProps,
} from "./social-auth-button";

export interface SocialAuthButtonsProps
  extends Omit<SocialAuthButtonProps, "provider" | "label"> {
  /** Lista de provedores a renderizar. Padrão: `DEFAULT_SOCIAL_PROVIDERS`. */
  providers?: SocialProviderId[];
}

/**
 * Renderiza uma pilha de botões de login social.
 *
 * @example
 * <SocialAuthButtons />
 * <SocialAuthButtons providers={["google", "github", "discord"]} callbackURL="/app" />
 */
export function SocialAuthButtons({
  providers = DEFAULT_SOCIAL_PROVIDERS,
  className,
  ...props
}: SocialAuthButtonsProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {providers.map((provider) => (
        <SocialAuthButton key={provider} provider={provider} {...props} />
      ))}
    </div>
  );
}
