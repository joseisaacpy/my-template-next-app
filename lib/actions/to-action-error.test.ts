import { z } from "zod";
import { describe, expect, it, vi } from "vitest";

import { ConflictError } from "@/lib/errors";

import { toActionError } from "./to-action-error";

describe("toActionError", () => {
  it("mapeia ZodError para fieldErrors", () => {
    const schema = z.object({ title: z.string().min(1) });
    const parsed = schema.safeParse({ title: "" });
    const result = toActionError(parsed.success ? null : parsed.error);

    expect(result.ok).toBe(false);
    expect(result.code).toBe("VALIDATION_ERROR");
    expect(result.fieldErrors?.title?.length).toBeGreaterThan(0);
  });

  it("mapeia AppError para message + code", () => {
    const result = toActionError(new ConflictError("já existe"));
    expect(result).toMatchObject({
      ok: false,
      error: "já existe",
      code: "CONFLICT",
    });
  });

  it("esconde erro desconhecido atrás de mensagem genérica", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = toActionError(new Error("stack interno secreto"));

    expect(result).toMatchObject({ ok: false, code: "INTERNAL_ERROR" });
    expect(result.error).not.toContain("secreto");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
