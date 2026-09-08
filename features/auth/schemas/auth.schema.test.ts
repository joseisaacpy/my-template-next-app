import { describe, expect, it } from "vitest";

import { passwordSchema, registerSchema } from "./auth.schema";

describe("passwordSchema", () => {
  it("aceita uma senha forte", () => {
    expect(passwordSchema.safeParse("Abcdef1!").success).toBe(true);
  });

  it.each([
    ["curta demais", "Ab1!"],
    ["sem maiúscula", "abcdef1!"],
    ["sem minúscula", "ABCDEF1!"],
    ["sem dígito", "Abcdefg!"],
    ["sem caractere especial", "Abcdefg1"],
  ])("rejeita %s", (_label, value) => {
    expect(passwordSchema.safeParse(value).success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("exige que as senhas confiram", () => {
    const result = registerSchema.safeParse({
      name: "Ana",
      email: "ana@example.com",
      password: "Abcdef1!",
      confirmPassword: "Abcdef1?",
    });
    expect(result.success).toBe(false);
  });
});
