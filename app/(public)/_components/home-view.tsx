"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ThemeButton } from "@/components/theme/ThemeButton";
import { motion } from "motion/react";
import {
  fadeIn,
  slideUp,
  staggerContainer,
} from "@/components/animations/index";

const MotionImage = motion.create(Image);

// constantes
const MY_GITHUB_URL = "https://github.com/joseisaacpy";

const links = [
  {
    name: "Ver código no Github",
    href: "https://github.com/joseisaacpy/my-template-next-app",
  },
  {
    name: "Meu Github",
    href: MY_GITHUB_URL,
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

const command = `npx create-next-app -e https://github.com/joseisaacpy/my-template-next-app
cd seu-projeto
pnpm install
pnpm run dev`;

export function HomeView() {
  return (
    <main className="relative flex flex-col items-center text-center px-6 py-5 gap-8">
      {/* DEV PROFILE */}
      <div className="flex w-full border-muted-foreground rounded-lg justify-between items-center">
        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ThemeButton />
        </motion.div>
        <div>
          <a
            href={MY_GITHUB_URL}
            target="_blank"
            className="flex items-center gap-2"
          >
            <MotionImage
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              src="https://avatars.githubusercontent.com/u/145298381?v=4"
              alt="Foto do desenvolvedor"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-sm text-muted-foreground hover:underline hidden md:block">
              @joseisaacpy
            </span>
          </a>
        </div>
      </div>

      {/* HERO */}
      <motion.section
        className="max-w-4xl"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={slideUp} className="text-4xl font-bold">
          Next.js Fullstack Starter
        </motion.h1>

        <motion.p variants={fadeIn} className="text-lg text-muted-foreground">
          Template completo com autenticação, banco de dados e UI prontos.
          Comece projetos em minutos, não horas.
        </motion.p>

        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {links.map((link) => (
            <motion.div
              key={link.name}
              variants={slideUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild>
                <a href={link.href} target="_blank">
                  {link.name}
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* STACK */}
      <section className="mt-4 max-w-4xl w-full">
        <h2 className="text-2xl font-semibold mb-2">Stack</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {stack.map((item) => (
            <motion.a
              whileHover={{
                y: -4,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                staggerChildren: 0.12,
                delayChildren: 0.15,
              }}
              key={item.name}
              href={item.href}
              target="_blank"
              className="p-4 border rounded-lg hover:bg-muted transition"
            >
              {item.name}
            </motion.a>
          ))}
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="mt-4 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-2">Por que usar?</h2>

        <ul className="space-y-2 text-muted-foreground">
          {benefits.map((benefit) => (
            <motion.li key={benefit} variants={slideUp}>
              ✔ {benefit}
            </motion.li>
          ))}
        </ul>
      </section>

      {/* GET STARTED */}
      <section className="mt-4 max-w-4xl w-full">
        <h2 className="text-2xl font-semibold mb-2">Comece em segundos</h2>

        <motion.pre
          variants={fadeIn}
          whileHover={{
            scale: 1.02,
          }}
          className="p-4 rounded-lg border text-left text-sm overflow-x-scroll"
        >
          <code>{command}</code>
        </motion.pre>
      </section>
    </main>
  );
}
