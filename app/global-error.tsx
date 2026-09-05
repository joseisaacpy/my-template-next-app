"use client";

// Captura erros do root layout. Precisa incluir <html> e <body> próprios
// porque substitui o layout raiz. Mantido sem dependências de UI de propósito.
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.5rem" }}>Algo deu errado</h1>
          <p style={{ color: "#71717a" }}>
            A aplicação encontrou um erro inesperado.
            {error.digest ? ` Referência: ${error.digest}` : null}
          </p>
          <button
            onClick={() => unstable_retry()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid currentColor",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            Recarregar
          </button>
        </div>
      </body>
    </html>
  );
}
