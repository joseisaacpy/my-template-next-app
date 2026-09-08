import { brandIconContentType, renderBrandIcon } from "@/lib/brand-icon";

// Ícone da tela inicial no iOS. Placeholder gerado — ver `lib/brand-icon.tsx`.
export const size = { width: 180, height: 180 };
export const contentType = brandIconContentType;

// iOS aplica a própria máscara de cantos — ícone quadrado, sem borderRadius.
export default function AppleIcon() {
  return renderBrandIcon(size.width, 0);
}
