"use client";

import * as React from "react";
import { Slot } from "radix-ui";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldContextValue = {
  fieldId: string;
  descriptionId: string;
  errorId: string;
  /** Valor pronto para `aria-describedby` (undefined quando não há texto auxiliar). */
  ariaDescribedBy?: string;
  hasError: boolean;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null,
);

/**
 * Acessa os ids e o estado de erro do `<FormField>` mais próximo.
 * Útil para ligar a acessibilidade em controles que não são um `<input>`
 * simples (ex.: o `SelectTrigger` do Select).
 */
function useFormField() {
  const ctx = React.useContext(FormFieldContext);
  if (!ctx) {
    throw new Error("useFormField deve ser usado dentro de <FormField>.");
  }
  return ctx;
}

/**
 * Injeta `id`, `aria-invalid` e `aria-describedby` no controle filho
 * (um único elemento). Use quando o campo não for o `<Input>` padrão.
 *
 * @example
 * <FormField label="Bio" error={errors.bio?.message}>
 *   <FormControl>
 *     <Textarea {...register("bio")} />
 *   </FormControl>
 * </FormField>
 */
function FormControl(props: React.ComponentProps<typeof Slot.Root>) {
  const { fieldId, ariaDescribedBy, hasError } = useFormField();

  return (
    <Slot.Root
      id={fieldId}
      aria-describedby={ariaDescribedBy}
      aria-invalid={hasError || undefined}
      {...props}
    />
  );
}

interface FormFieldProps extends Omit<
  React.ComponentProps<"div">,
  "children" | "id"
> {
  label?: React.ReactNode;
  /** Conteúdo à direita do label, ex.: link "Esqueci a senha". */
  labelAction?: React.ReactNode;
  /** Texto de ajuda abaixo do controle. */
  description?: React.ReactNode;
  /** Mensagem de erro do campo (ex.: `errors.email?.message`). */
  error?: React.ReactNode;
  /** Id do campo. Padrão: `inputProps.id` › `inputProps.name` › id gerado. */
  fieldId?: string;
  /**
   * Controle customizado (Select, Textarea, Checkbox...). Omita para
   * renderizar um `<Input>` e repassar `inputProps` (ex.: `{...register("email")}`).
   */
  children?: React.ReactNode;
  inputProps?: React.ComponentProps<typeof Input>;
}

/**
 * Label + controle + descrição + erro, com acessibilidade já ligada.
 *
 * @example
 * // Input simples (shorthand)
 * <FormField
 *   label="E-mail"
 *   error={errors.email?.message}
 *   inputProps={{ type: "email", ...register("email") }}
 * />
 *
 * @example
 * // Controle customizado
 * <FormField label="Plano" error={errors.plan?.message}>
 *   <FormControl>
 *     <select {...register("plan")}>...</select>
 *   </FormControl>
 * </FormField>
 */
function FormField({
  label,
  labelAction,
  description,
  error,
  fieldId,
  children,
  inputProps,
  className,
  ...props
}: FormFieldProps) {
  const generatedId = React.useId();
  const id = fieldId ?? inputProps?.id ?? inputProps?.name ?? generatedId;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  const ariaDescribedBy =
    [description ? descriptionId : null, hasError ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <FormFieldContext.Provider
      value={{ fieldId: id, descriptionId, errorId, ariaDescribedBy, hasError }}
    >
      <div
        data-slot="form-field"
        className={cn("space-y-1.5", className)}
        {...props}
      >
        {label ? (
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor={id}>{label}</Label>
            {labelAction}
          </div>
        ) : null}

        {children ?? (
          <FormControl>
            <Input {...inputProps} />
          </FormControl>
        )}

        {description ? (
          <p id={descriptionId} className="text-muted-foreground text-sm">
            {description}
          </p>
        ) : null}

        {hasError ? (
          <p id={errorId} role="alert" className="text-destructive text-sm">
            {error}
          </p>
        ) : null}
      </div>
    </FormFieldContext.Provider>
  );
}

export { FormField, FormControl, useFormField };
