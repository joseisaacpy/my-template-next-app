import { describe, expect, it } from "vitest";

import { privatePathPrefixes, routes, sitemapRoutes } from "./nav.config";

describe("sitemapRoutes", () => {
  const paths = sitemapRoutes().map((r) => r.path);

  it("inclui a home com priority 1", () => {
    const home = sitemapRoutes().find((r) => r.path === "/");
    expect(home?.priority).toBe(1);
  });

  it("exclui rotas auth: true", () => {
    expect(paths).not.toContain("/dashboard");
    expect(paths).not.toContain("/notes");
  });

  it("exclui rotas marcadas com sitemap: false", () => {
    expect(paths).not.toContain("/forgot-password");
    expect(paths).not.toContain("/reset-password");
  });

  it("dá priority 0.7 e monthly para as demais", () => {
    const login = sitemapRoutes().find((r) => r.path === "/login");
    expect(login).toMatchObject({ priority: 0.7, changeFrequency: "monthly" });
  });
});

describe("privatePathPrefixes", () => {
  it("lista exatamente as rotas auth: true", () => {
    const expected = Object.values(routes)
      .filter((r) => r.auth)
      .map((r) => r.path)
      .sort();
    expect([...privatePathPrefixes()].sort()).toEqual(expected);
  });
});
