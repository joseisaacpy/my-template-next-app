/**
 * Textos da home que dependem do tipo de projeto (full / front / back).
 * Ficam fora do `home-view.tsx` para o `pnpm bootstrap` poder trocar só este
 * arquivo ao podar o template (ver `scripts/prune.ts`).
 */

export const hero = {
  title: "Next.js Front-end Starter",
  description:
    "Template de interface com Tailwind, shadcn/ui e animações prontos. Comece projetos em minutos, não horas.",
};

export const stack = [
  { name: "Next.js", href: "https://nextjs.org/docs" },
  { name: "Tailwind CSS", href: "https://tailwindcss.com/docs" },
  { name: "Motion", href: "https://motion.dev/docs" },
  { name: "shadcn/ui", href: "https://ui.shadcn.com/docs" },
];

export const benefits = [
  "Sem setup inicial chato",
  "Tema claro e escuro",
  "Animações prontas",
  "Estrutura escalável",
];
