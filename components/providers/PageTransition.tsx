"use client";

import { motion } from "motion/react";

import { pageTransition } from "@/components/animations/index";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible">
      {children}
    </motion.div>
  );
}
