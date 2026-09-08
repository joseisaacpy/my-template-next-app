import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

import { site } from "@/nav.config";

const styles = {
  body: {
    backgroundColor: "#f4f4f5",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    margin: 0,
    padding: "24px 0",
  },
  container: {
    backgroundColor: "#ffffff",
    border: "1px solid #e4e4e7",
    borderRadius: 12,
    margin: "0 auto",
    maxWidth: 480,
    padding: "32px",
  },
  brand: { fontSize: 18, fontWeight: 700, color: "#0a0a0a", margin: 0 },
  hr: { borderColor: "#e4e4e7", margin: "24px 0" },
  footer: { fontSize: 12, color: "#71717a", margin: 0 },
} as const;

/** Casca compartilhada dos e-mails: cabeçalho com o nome do site + rodapé. */
export function EmailLayout({
  preview,
  children,
}: {
  preview: string;
  children: ReactNode;
}) {
  return (
    <Html lang={site.locale}>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section>
            <Text style={styles.brand}>{site.name}</Text>
          </Section>
          {children}
          <Hr style={styles.hr} />
          <Section>
            <Text style={styles.footer}>
              Se você não solicitou este e-mail, pode ignorá-lo com segurança.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const emailStyles = {
  heading: { fontSize: 20, fontWeight: 600, color: "#0a0a0a", margin: "0 0 12px" },
  text: { fontSize: 14, lineHeight: "22px", color: "#3f3f46", margin: "0 0 16px" },
  button: {
    backgroundColor: "#0a0a0a",
    borderRadius: 8,
    color: "#fafafa",
    display: "inline-block",
    fontSize: 14,
    fontWeight: 600,
    padding: "10px 20px",
    textDecoration: "none",
  },
  link: { fontSize: 12, color: "#71717a", wordBreak: "break-all" as const },
} as const;
