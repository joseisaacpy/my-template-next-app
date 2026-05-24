// componentes
import { Button } from "@/components/ui/button";
import Image from "next/image";

// constantes
const links = [
  {
    name: "Ver código no Github",
    href: "https://github.com/joseisaacpy/my-template-next-app",
  },
  {
    name: "Meu Github",
    href: "https://github.com/joseisaacpy",
  },
  {
    name: "Meu portfólio",
    href: "https://developer-portfolio-v3.vercel.app/",
  },
];

const stack = [
  {
    name: "Next.js",
    href: "https://nextjs.org/docs",
  },
  {
    name: "Prisma",
    href: "https://www.prisma.io/docs",
  },
  {
    name: "Neon",
    href: "https://www.neon.tech/docs/",
  },
  {
    name: "Better Auth",
    href: "https://better-auth.com",
  },
  {
    name: "Tailwind CSS",
    href: "https://tailwindcss.com/docs",
  },
  {
    name: "Motion",
    href: "https://motion.dev/docs",
  },
  {
    name: "shadcn/ui",
    href: "https://ui.shadcn.com/docs",
  },
];

const benefits = [
  "Sem setup inicial chato",
  "Autenticação pronta",
  "Banco já configurado",
  "Estrutura escalável",
];

const comand = `npx create-next-app -e https://github.com/joseisaacpy/my-template-next-app
cd seu-projeto
pnpm install
pnpm run dev`;

export default function Home() {
  return (
    <main className="relative flex flex-col items-center text-center px-6 py-20 gap-8">
      {/* DEV PROFILE */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Image
          src="https://avatars.githubusercontent.com/u/145298381?v=4"
          alt="Foto do desenvolvedor"
          width={40}
          height={40}
          className="rounded-full"
        />

        <a
          href={links[1].href}
          target="_blank"
          className="text-sm text-muted-foreground hover:underline"
        >
          @joseisaacpy
        </a>
      </div>

      {/* HERO */}
      <section className="max-w-4xl">
        <h1 className="text-4xl font-bold">Next.js Fullstack Starter</h1>

        <p className="text-lg text-muted-foreground">
          Template completo com autenticação, banco de dados e UI prontos.
          Comece projetos em minutos, não horas.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {links.map((link) => (
            <Button key={link.name} asChild>
              <a href={link.href} target="_blank">
                {link.name}
              </a>
            </Button>
          ))}
        </div>
      </section>

      {/* STACK */}
      <section className="mt-4 max-w-4xl w-full">
        <h2 className="text-2xl font-semibold mb-2">Stack</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {stack.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              className="p-4 border rounded-lg hover:bg-muted transition"
            >
              {item.name}
            </a>
          ))}
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="mt-4 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-2">Por que usar?</h2>

        <ul className="space-y-2 text-muted-foreground">
          {benefits.map((benefit) => (
            <li key={benefit}>✔ {benefit}</li>
          ))}
        </ul>
      </section>

      {/* GET STARTED */}
      <section className="mt-4 max-w-4xl w-full">
        <h2 className="text-2xl font-semibold mb-2">Comece em segundos</h2>

        <pre className="p-4 rounded-lg border text-left text-sm overflow-x-scroll">
          <code>{comand}</code>
        </pre>
      </section>
    </main>
  );
}
