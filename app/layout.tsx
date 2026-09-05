import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { rootMetadata } from "@/lib/metadata";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// Base de metadata do site: `metadataBase` + template de `<title>`.
// Cada página define a sua com `createMetadata()` — ver `lib/metadata.ts`.
export const metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
