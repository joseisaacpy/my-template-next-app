import { describe, expect, it } from "vitest";

import { NOTE_TITLE_MAX } from "../constants/note.constants";
import { noteInputSchema, updateNoteSchema } from "./note.schema";

describe("noteInputSchema", () => {
  it("faz trim e aceita conteúdo válido", () => {
    const result = noteInputSchema.parse({
      title: "  Título  ",
      content: "  corpo  ",
    });
    expect(result).toEqual({ title: "Título", content: "corpo" });
  });

  it("rejeita título vazio", () => {
    expect(noteInputSchema.safeParse({ title: "  ", content: "x" }).success).toBe(
      false,
    );
  });

  it("rejeita título acima do limite", () => {
    const result = noteInputSchema.safeParse({
      title: "a".repeat(NOTE_TITLE_MAX + 1),
      content: "x",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateNoteSchema", () => {
  it("exige id", () => {
    expect(
      updateNoteSchema.safeParse({ title: "t", content: "c" }).success,
    ).toBe(false);
    expect(
      updateNoteSchema.safeParse({ id: "abc", title: "t", content: "c" })
        .success,
    ).toBe(true);
  });
});
