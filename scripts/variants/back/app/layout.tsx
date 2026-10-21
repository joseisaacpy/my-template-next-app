/**
 * Layout raiz mínimo. O Next exige um `app/layout`, mesmo num projeto só de API
 * (route handlers). Não há páginas, então ele quase nunca é renderizado.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
