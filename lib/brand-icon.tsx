import { ImageResponse } from "next/og";

import { site } from "@/nav.config";

/**
 * Ícone-marca gerado em tempo de build (sem nenhum asset binário no repo).
 * Usado por `app/icon.tsx` (favicon/aba) e `app/apple-icon.tsx` (iOS).
 *
 * É um placeholder: renderiza a inicial do `site.name` sobre um quadrado escuro.
 *
 * Para trocar por uma imagem real:
 *   1. adicione `app/icon.png` (512×512) e `app/apple-icon.png` (180×180);
 *   2. (opcional) `app/favicon.ico` na raiz de `app/`;
 *   3. apague `app/icon.tsx`, `app/apple-icon.tsx` e este arquivo.
 */
export const brandIconContentType = "image/png";

const initial = site.name.trim().charAt(0).toUpperCase() || "A";

export function renderBrandIcon(size: number, radiusRatio = 0.22) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: Math.round(size * 0.62),
          fontWeight: 700,
          fontFamily: "sans-serif",
          // Ajuste para as cores da sua marca.
          color: "#fafafa",
          background: "#0a0a0a",
          borderRadius: Math.round(size * radiusRatio),
        }}
      >
        {initial}
      </div>
    ),
    { width: size, height: size },
  );
}
