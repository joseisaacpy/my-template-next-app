import { describe, expect, it } from "vitest";

import { hasRole, isAdminEmail } from "./roles";

describe("hasRole", () => {
  it("aceita quando o papel confere", () => {
    expect(hasRole({ role: "admin" }, "admin")).toBe(true);
  });

  it("aceita se ao menos um dos papéis confere", () => {
    expect(hasRole({ role: "user" }, "admin", "user")).toBe(true);
  });

  it("recusa papel diferente", () => {
    expect(hasRole({ role: "user" }, "admin")).toBe(false);
  });

  it("trata conta sem role como user", () => {
    expect(hasRole({ role: null }, "user")).toBe(true);
    expect(hasRole({}, "admin")).toBe(false);
  });

  it("entende vários papéis separados por vírgula", () => {
    expect(hasRole({ role: "user,admin" }, "admin")).toBe(true);
  });
});

describe("isAdminEmail", () => {
  it("ignora maiúsculas e espaços", () => {
    expect(isAdminEmail("Ana@Site.com", " ana@site.com , bob@site.com")).toBe(
      true,
    );
  });

  it("recusa e-mail fora da lista", () => {
    expect(isAdminEmail("eve@site.com", "ana@site.com")).toBe(false);
  });

  it("recusa quando a env está vazia ou ausente", () => {
    expect(isAdminEmail("ana@site.com")).toBe(false);
    expect(isAdminEmail("ana@site.com", "")).toBe(false);
    expect(isAdminEmail("ana@site.com", " , ")).toBe(false);
  });
});
