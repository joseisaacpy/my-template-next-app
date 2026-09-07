import * as React from "react";

import { FormField } from "@/components/ui/form-field";
import type { Input } from "@/components/ui/input";

interface AuthFieldProps extends React.ComponentProps<typeof Input> {
  /** Omita para renderizar só o input (útil quando o label fica ao lado de um link). */
  label?: React.ReactNode;
  error?: string;
}

/**
 * Atalho das telas de autenticação: `FormField` com o `<Input>` já embutido.
 * Para outros controles ou telas, use `FormField` diretamente.
 */
export function AuthField({ label, error, id, ...props }: AuthFieldProps) {
  return (
    <FormField
      label={label}
      error={error}
      fieldId={id ?? props.name}
      inputProps={props}
    />
  );
}
