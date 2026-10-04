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
    expect(paths).not.toContain("/admin/users");
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
  it("lista o 1º segmento das rotas auth: true, sem repetir", () => {
    expect([...privatePathPrefixes()].sort()).toEqual([
      "/admin",
      "/dashboard",
      "/notes",
    ]);
  });
});

describe("rota admin", () => {
  it("exige sessão e o papel admin", () => {
    expect(routes.admin).toMatchObject({ auth: true, roles: ["admin"] });
  });
});
