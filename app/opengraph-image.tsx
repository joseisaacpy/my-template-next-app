import { ImageResponse } from "next/og";

import { site } from "@/nav.config";

// Imagem Open Graph padrão do site (compartilhamento em redes/Slack/etc.).
// Gerada em build a partir de `site` — sem asset binário no repo. Para uma arte
// própria: adicione `public/og.png`, aponte `site.ogImage` e apague este arquivo.
export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 24,
        padding: 96,
        background: "#0a0a0a",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 700, opacity: 0.7 }}>
        {site.name}
      </div>
      <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
        {site.description}
      </div>
    </div>,
    { ...size },
  );
}
