"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { toast } from "sonner";

import {
  fadeIn,
  slideUp,
  staggerContainer,
} from "@/components/animations/index";
import { ThemeButton } from "@/components/theme/ThemeButton";
import { Button } from "@/components/ui/button";
import { site } from "@/nav.config";

const MotionImage = motion.create(Image);

const links = [
  { name: "Ver código no GitHub", href: site.repoUrl },
  { name: "Meu GitHub", href: site.author.url },
  { name: "Meu portfólio", href: site.author.portfolio },
];

const stack = [
  { name: "Next.js", href: "https://nextjs.org/docs" },
  { name: "Prisma", href: "https://www.prisma.io/docs" },
  { name: "Neon", href: "https://www.neon.tech/docs/" },
  { name: "Better Auth", href: "https://better-auth.com" },
  { name: "Tailwind CSS", href: "https://tailwindcss.com/docs" },
  { name: "Motion", href: "https://motion.dev/docs" },
  { name: "shadcn/ui", href: "https://ui.shadcn.com/docs" },
];

const benefits = [
  "Sem setup inicial chato",
  "Autenticação pronta",
  "Banco já configurado",
  "Estrutura escalável",
];

const command = `npx create-next-app -e ${site.repoUrl}
cd seu-projeto
pnpm install
pnpm dev`;

export function HomeView() {
  return (
    <main className="relative flex flex-col items-center gap-8 px-6 py-5 text-center">
      {/* DEV PROFILE */}
      <div className="border-muted-foreground flex w-full items-center justify-between rounded-lg">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ThemeButton />
        </motion.div>
        <div>
          <a
            href={site.author.url}
            target="_blank"
            className="flex items-center gap-2"
          >
            <MotionImage
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              src={site.author.avatar}
              alt={`Foto de ${site.author.name}`}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-muted-foreground hidden text-sm hover:underline md:block">
              @{site.author.handle}
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
        <motion.h1
          variants={slideUp}
          className="text-4xl font-bold"
          onClick={() => toast.success("Quem que clica em um título? 🤔")}
        >
          Next.js Fullstack Starter
        </motion.h1>

        <motion.p variants={fadeIn} className="text-muted-foreground text-lg">
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
      <section className="mt-4 w-full max-w-4xl">
        <h2 className="mb-2 text-2xl font-semibold">Stack</h2>

        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          {stack.map((item) => (
            <motion.a
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 300,
                staggerChildren: 0.12,
                delayChildren: 0.15,
              }}
              key={item.name}
              href={item.href}
              target="_blank"
              className="hover:bg-muted rounded-lg border p-4 transition"
            >
              {item.name}
            </motion.a>
          ))}
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="mt-4 max-w-4xl">
        <h2 className="mb-2 text-2xl font-semibold">Por que usar?</h2>

        <ul className="text-muted-foreground space-y-2">
          {benefits.map((benefit) => (
            <motion.li key={benefit} variants={slideUp}>
              ✔ {benefit}
            </motion.li>
          ))}
        </ul>
      </section>

      {/* GET STARTED */}
      <section className="mt-4 w-full max-w-4xl">
        <h2 className="mb-2 text-2xl font-semibold">Comece em segundos</h2>

        <motion.pre
          variants={fadeIn}
          whileHover={{ scale: 1.02 }}
          className="overflow-x-auto rounded-lg border p-4 text-left text-sm"
        >
          <code>{command}</code>
        </motion.pre>
      </section>
    </main>
  );
}
