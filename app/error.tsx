"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Substitua por um serviço de log (Sentry, etc.)
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Algo deu errado</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        {error.digest
          ? `Ocorreu um erro inesperado. Referência: ${error.digest}`
          : "Ocorreu um erro inesperado. Tente novamente em instantes."}
      </p>
      <Button onClick={() => unstable_retry()}>Tentar de novo</Button>
    </div>
  );
}
