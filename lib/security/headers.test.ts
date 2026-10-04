import { describe, expect, it } from "vitest";

import { buildCsp, securityHeaders } from "./headers";

describe("buildCsp", () => {
  it("bloqueia iframes, plugins e <base> externo", () => {
    const csp = buildCsp(false, true);
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
  });

  it("só permite unsafe-eval em dev", () => {
    expect(buildCsp(true, true)).toContain("'unsafe-eval'");
    expect(buildCsp(false, true)).not.toContain("'unsafe-eval'");
  });
});

describe("buildCsp upgrade-insecure-requests", () => {
  it("liga só quando a URL do site é https", () => {
    expect(buildCsp(false, true)).toContain("upgrade-insecure-requests");
    expect(buildCsp(false, false)).not.toContain("upgrade-insecure-requests");
  });
});

describe("securityHeaders", () => {
  it("inclui a CSP e os headers clássicos", () => {
    const keys = securityHeaders.map((h) => h.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        "Content-Security-Policy",
        "X-Content-Type-Options",
        "X-Frame-Options",
        "Referrer-Policy",
        "Permissions-Policy",
        "Strict-Transport-Security",
      ]),
    );
  });
});
