import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { describe, expect, it } from "vitest";

import { createAdapter } from "./adapter";

// Criar o adapter não abre conexão — só guarda a connection string.
const url = "postgresql://user:pass@localhost:5432/db";

describe("createAdapter", () => {
  it("usa o driver do Neon quando driver é neon", () => {
    expect(createAdapter(url, "neon")).toBeInstanceOf(PrismaNeon);
  });

  it("usa o driver comum do Postgres quando driver é pg", () => {
    expect(createAdapter(url, "pg")).toBeInstanceOf(PrismaPg);
  });
});
