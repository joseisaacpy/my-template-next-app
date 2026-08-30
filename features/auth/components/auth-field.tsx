import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFieldProps extends React.ComponentProps<typeof Input> {
  /** Omita para renderizar só o input (útil quando o label fica ao lado de um link). */
  label?: React.ReactNode;
  error?: string;
}

/** Label + Input + mensagem de erro, com `id` ligado ao label. */
export function AuthField({ label, error, id, ...props }: AuthFieldProps) {
  const inputId = id ?? props.name;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-1.5">
      {label ? <Label htmlFor={inputId}>{label}</Label> : null}
      <Input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
