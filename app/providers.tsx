"use client";

import * as React from "react";
import { ProgressProvider } from "@bprogress/next/app";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { PageTransition } from "@/components/providers/PageTransition";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ProgressProvider
        height="3px"
        color="var(--primary)"
        options={{ showSpinner: false }}
        shallowRouting
      >
        <PageTransition>{children}</PageTransition>
        <Toaster />
      </ProgressProvider>
    </ThemeProvider>
  );
}
