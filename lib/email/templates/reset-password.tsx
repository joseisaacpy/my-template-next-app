import { Button, Section, Text } from "@react-email/components";

import { EmailLayout, emailStyles } from "./_layout";

export interface ResetPasswordProps {
  url: string;
  name?: string;
}

/** E-mail com o link para redefinir a senha. */
export function ResetPassword({ url, name }: ResetPasswordProps) {
  return (
    <EmailLayout preview="Redefina sua senha">
      <Section>
        <Text style={emailStyles.heading}>Redefinir senha</Text>
        <Text style={emailStyles.text}>
          {name ? `Olá, ${name}. ` : ""}Recebemos um pedido para redefinir a
          senha da sua conta. O link expira em 1 hora.
        </Text>
        <Button href={url} style={emailStyles.button}>
          Criar nova senha
        </Button>
        <Text style={{ ...emailStyles.text, margin: "16px 0 4px" }}>
          Ou copie e cole este link no navegador:
        </Text>
        <Text style={emailStyles.link}>{url}</Text>
      </Section>
    </EmailLayout>
  );
}

ResetPassword.PreviewProps = {
  url: "https://exemplo.com/reset-password?token=abc123",
  name: "Ana",
} satisfies ResetPasswordProps;

export default ResetPassword;
