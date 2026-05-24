"use client";

import { motion } from "motion/react";

import { pageTransition } from "@/components/animations/index";
import { usePathname } from "next/dist/client/components/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      variants={pageTransition}
      key={pathname}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}
