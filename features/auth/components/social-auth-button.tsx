"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

import {
  SOCIAL_PROVIDERS,
  type SocialProviderId,
} from "../constants/social-providers";

type ButtonProps = React.ComponentProps<typeof Button>;

export interface SocialAuthButtonProps
  extends Omit<ButtonProps, "children" | "onClick"> {
  /** Provedor social (google, github, gitlab, discord, microsoft, apple, facebook). */
  provider: SocialProviderId;
  /** Para onde redirecionar após o login. Padrão: `/dashboard`. */
  callbackURL?: string;
  /** Para onde redirecionar se o OAuth falhar. Padrão: `/login`. */
  errorCallbackURL?: string;
  /** Texto do botão. Padrão: `Continuar com <Provedor>`. */
  label?: React.ReactNode;
  /** Notificado quando o fluxo de login falha antes do redirect. */
  onError?: (error: unknown) => void;
}

/**
 * Botão de login social reutilizável e dinâmico.
 *
 * @example
 * <SocialAuthButton provider="google" />
 * <SocialAuthButton provider="github" callbackURL="/app" variant="default" />
 */
export function SocialAuthButton({
  provider,
  callbackURL = "/dashboard",
  errorCallbackURL = "/login",
  label,
  onError,
  variant = "outline",
  size = "lg",
  className,
  disabled,
  ...props
}: SocialAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const config = SOCIAL_PROVIDERS[provider];

  async function handleSignIn() {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL,
        errorCallbackURL,
      });
    } catch (error) {
      setIsLoading(false);
      onError?.(error);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("w-full", className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      onClick={handleSignIn}
      {...props}
    >
      <span
        data-icon="inline-start"
        className={cn("flex items-center", config.mono && "text-foreground")}
        aria-hidden="true"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : config.icon}
      </span>
      {label ?? `Continuar com ${config.label}`}
    </Button>
  );
}
