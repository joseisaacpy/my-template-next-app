"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { captureError } from "@/lib/observability/capture-error";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    captureError(error, { source: "error-boundary", digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Algo deu errado</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        {error.digest
          ? `Ocorreu um erro inesperado. Referência: ${error.digest}`
          : "Ocorreu um erro inesperado. Tente novamente em instantes."}
      </p>
      <Button onClick={() => unstable_retry()}>Tentar de novo</Button>
    </div>
  );
}
