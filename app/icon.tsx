import { brandIconContentType, renderBrandIcon } from "@/lib/brand-icon";

// Ícone de aba / favicon. Placeholder gerado — ver `lib/brand-icon.tsx`.
export const size = { width: 512, height: 512 };
export const contentType = brandIconContentType;

export default function Icon() {
  return renderBrandIcon(size.width);
}
