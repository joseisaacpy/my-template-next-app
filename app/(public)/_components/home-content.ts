/**
 * Textos da home que dependem do tipo de projeto (full / front / back).
 * Ficam fora do `home-view.tsx` para o `pnpm bootstrap` poder trocar só este
 * arquivo ao podar o template (ver `scripts/prune.ts`).
 */

export const hero = {
  title: "Next.js Fullstack Starter",
  description:
    "Template completo com autenticação, banco de dados e UI prontos. Comece projetos em minutos, não horas.",
};

export const stack = [
  { name: "Next.js", href: "https://nextjs.org/docs" },
  { name: "Prisma", href: "https://www.prisma.io/docs" },
  { name: "Neon", href: "https://www.neon.tech/docs/" },
  { name: "Better Auth", href: "https://better-auth.com" },
  { name: "Tailwind CSS", href: "https://tailwindcss.com/docs" },
  { name: "Motion", href: "https://motion.dev/docs" },
  { name: "shadcn/ui", href: "https://ui.shadcn.com/docs" },
];

export const benefits = [
  "Sem setup inicial chato",
  "Autenticação pronta",
  "Banco já configurado",
  "Estrutura escalável",
];
