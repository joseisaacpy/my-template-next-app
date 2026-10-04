import "./globals.css";
import type { Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { rootMetadata } from "@/lib/metadata";
import { site } from "@/nav.config";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// Fonte de destaque para títulos (classe `font-display`). Para trocar, mude só
// o import e esta chamada — ex.: Space_Grotesk, Sora, Instrument_Serif.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  // `opsz`: em títulos grandes o desenho fica mais expressivo automaticamente.
  axes: ["opsz"],
});

// Base de metadata do site: `metadataBase` + template de `<title>`.
// Cada página define a sua com `createMetadata()` — ver `lib/metadata.ts`.
export const metadata = rootMetadata;

// `<meta name="theme-color">` — cor da barra do navegador (mobile) e PWA.
// Valores em `site.themeColor` (nav.config.ts).
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: site.themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: site.themeColor.dark },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable, display.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
