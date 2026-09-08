import { Button, Section, Text } from "@react-email/components";

import { EmailLayout, emailStyles } from "./_layout";

export interface VerifyEmailProps {
  url: string;
  name?: string;
}

/** E-mail de confirmação de conta enviado no cadastro. */
export function VerifyEmail({ url, name }: VerifyEmailProps) {
  return (
    <EmailLayout preview="Confirme seu endereço de e-mail">
      <Section>
        <Text style={emailStyles.heading}>Confirme seu e-mail</Text>
        <Text style={emailStyles.text}>
          {name ? `Olá, ${name}. ` : ""}Falta um passo para ativar sua conta.
          Clique no botão abaixo para confirmar este endereço.
        </Text>
        <Button href={url} style={emailStyles.button}>
          Confirmar e-mail
        </Button>
        <Text style={{ ...emailStyles.text, margin: "16px 0 4px" }}>
          Ou copie e cole este link no navegador:
        </Text>
        <Text style={emailStyles.link}>{url}</Text>
      </Section>
    </EmailLayout>
  );
}

VerifyEmail.PreviewProps = {
  url: "https://exemplo.com/api/auth/verify-email?token=abc123",
  name: "Ana",
} satisfies VerifyEmailProps;

export default VerifyEmail;
