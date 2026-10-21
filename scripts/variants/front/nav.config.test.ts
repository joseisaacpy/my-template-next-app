import { describe, expect, it } from "vitest";

import { privatePathPrefixes, sitemapRoutes } from "./nav.config";

describe("sitemapRoutes", () => {
  it("inclui a home com priority 1", () => {
    const home = sitemapRoutes().find((r) => r.path === "/");
    expect(home).toMatchObject({ priority: 1, changeFrequency: "monthly" });
  });
});

describe("privatePathPrefixes", () => {
  it("é vazio enquanto nenhuma rota tiver auth: true", () => {
    expect(privatePathPrefixes()).toEqual([]);
  });
});
