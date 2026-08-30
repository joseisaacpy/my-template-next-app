import type { ComponentProps, ReactNode } from "react";

/**
 * Provedores sociais suportados pelo Better Auth e habilitados neste template.
 * Para adicionar um novo: registre aqui + configure em `lib/auth/auth.ts`
 * + adicione as credenciais no `.env`.
 */
export type SocialProviderId =
  | "google"
  | "github"
  | "gitlab"
  | "discord"
  | "microsoft"
  | "apple"
  | "facebook";

export interface SocialProviderConfig {
  id: SocialProviderId;
  /** Rótulo exibido depois de "Continuar com". */
  label: string;
  /** Ícone da marca (SVG inline, herda `currentColor` quando `mono`). */
  icon: ReactNode;
  /** Ícone é monocromático e deve seguir a cor do texto do botão. */
  mono?: boolean;
}

type IconProps = ComponentProps<"svg">;

function GoogleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.85 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.67-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.67 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function GithubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 1C5.92 1 1 5.92 1 12c0 4.86 3.15 8.98 7.52 10.44.55.1.75-.24.75-.53v-1.86c-3.06.67-3.71-1.47-3.71-1.47-.5-1.28-1.22-1.62-1.22-1.62-1-.68.08-.67.08-.67 1.1.08 1.68 1.14 1.68 1.14.98 1.68 2.58 1.2 3.21.92.1-.71.38-1.2.7-1.47-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.14-2.95-.11-.28-.5-1.4.11-2.92 0 0 .93-.3 3.05 1.13a10.6 10.6 0 0 1 5.56 0c2.12-1.43 3.05-1.13 3.05-1.13.61 1.52.22 2.64.11 2.92.71.77 1.14 1.75 1.14 2.95 0 4.23-2.58 5.16-5.03 5.43.4.34.75 1.01.75 2.04v3.03c0 .29.2.64.76.53A11.01 11.01 0 0 0 23 12c0-6.08-4.92-11-11-11Z" />
    </svg>
  );
}

function GitlabIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="#E24329" d="m12 21.42 3.68-11.33H8.32L12 21.42Z" />
      <path fill="#FC6D26" d="M12 21.42 8.32 10.09H3.16L12 21.42Z" />
      <path fill="#FCA326" d="M3.16 10.09 2.04 13.53a.76.76 0 0 0 .28.85L12 21.42 3.16 10.09Z" />
      <path fill="#E24329" d="M3.16 10.09h5.16L6.1 3.26a.38.38 0 0 0-.72 0l-2.22 6.83Z" />
      <path fill="#FC6D26" d="m12 21.42 3.68-11.33h5.16L12 21.42Z" />
      <path fill="#FCA326" d="m20.84 10.09 1.12 3.44a.76.76 0 0 1-.28.85L12 21.42l8.84-11.33Z" />
      <path fill="#E24329" d="M20.84 10.09h-5.16l2.22-6.83a.38.38 0 0 1 .72 0l2.22 6.83Z" />
    </svg>
  );
}

function DiscordIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#5865F2" aria-hidden="true" {...props}>
      <path d="M19.27 5.33A16.7 16.7 0 0 0 15.05 4l-.24.5a15.4 15.4 0 0 0-5.62 0L8.95 4a16.7 16.7 0 0 0-4.22 1.33C2.05 9.36 1.32 13.28 1.68 17.14a16.8 16.8 0 0 0 5.15 2.6l.62-.98c-.5-.19-.99-.42-1.45-.7l.36-.28a12 12 0 0 0 10.28 0l.36.28c-.46.28-.95.51-1.45.7l.62.98a16.8 16.8 0 0 0 5.15-2.6c.42-4.48-.72-8.36-3.05-11.81ZM8.55 14.6c-1.01 0-1.84-.93-1.84-2.07 0-1.14.81-2.07 1.84-2.07s1.86.93 1.84 2.07c0 1.14-.81 2.07-1.84 2.07Zm6.9 0c-1.01 0-1.84-.93-1.84-2.07 0-1.14.81-2.07 1.84-2.07s1.86.93 1.84 2.07c0 1.14-.81 2.07-1.84 2.07Z" />
    </svg>
  );
}

function MicrosoftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="#F25022" d="M3 3h8.5v8.5H3z" />
      <path fill="#7FBA00" d="M12.5 3H21v8.5h-8.5z" />
      <path fill="#00A4EF" d="M3 12.5h8.5V21H3z" />
      <path fill="#FFB900" d="M12.5 12.5H21V21h-8.5z" />
    </svg>
  );
}

function AppleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.37 12.6c.03 3.03 2.66 4.04 2.69 4.05-.02.07-.42 1.44-1.38 2.85-.83 1.22-1.7 2.44-3.06 2.46-1.34.03-1.77-.79-3.3-.79s-2.01.77-3.28.82c-1.32.05-2.32-1.32-3.16-2.53-1.71-2.49-3.02-7.03-1.26-10.1a4.9 4.9 0 0 1 4.13-2.52c1.29-.02 2.51.87 3.3.87.79 0 2.27-1.08 3.83-.92.65.03 2.48.27 3.66 1.98-.1.06-2.18 1.28-2.16 3.8ZM14.06 3.6c.7-.85 1.17-2.03 1.04-3.2-1.01.04-2.22.67-2.94 1.51-.65.75-1.21 1.95-1.06 3.1 1.12.09 2.27-.57 2.96-1.41Z" />
    </svg>
  );
}

function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true" {...props}>
      <path d="M23 12a11 11 0 1 0-12.72 10.87v-7.69H7.5V12h2.78V9.59c0-2.74 1.63-4.26 4.13-4.26 1.2 0 2.45.21 2.45.21v2.7h-1.38c-1.36 0-1.78.84-1.78 1.71V12h3.03l-.48 3.18h-2.55v7.69A11 11 0 0 0 23 12Z" />
    </svg>
  );
}

export const SOCIAL_PROVIDERS: Record<SocialProviderId, SocialProviderConfig> = {
  google: { id: "google", label: "Google", icon: <GoogleIcon /> },
  github: { id: "github", label: "GitHub", icon: <GithubIcon />, mono: true },
  gitlab: { id: "gitlab", label: "GitLab", icon: <GitlabIcon /> },
  discord: { id: "discord", label: "Discord", icon: <DiscordIcon /> },
  microsoft: { id: "microsoft", label: "Microsoft", icon: <MicrosoftIcon /> },
  apple: { id: "apple", label: "Apple", icon: <AppleIcon />, mono: true },
  facebook: { id: "facebook", label: "Facebook", icon: <FacebookIcon /> },
};

/** Provedores que aparecem por padrão quando nenhum é informado. */
export const DEFAULT_SOCIAL_PROVIDERS: SocialProviderId[] = ["google", "github"];
