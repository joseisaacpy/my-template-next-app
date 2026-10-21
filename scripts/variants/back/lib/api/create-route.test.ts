import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

vi.mock("@/lib/auth/auth", () => ({
  auth: { api: { getSession: vi.fn() } },
}));
vi.mock("@/lib/logger", () => ({ logger: { error: vi.fn() } }));

const { auth } = await import("@/lib/auth/auth");
const { NotFoundError } = await import("@/lib/errors");
const { createRoute } = await import("./create-route");

const schema = z.object({ name: z.string().min(1, "Informe o nome") });

function jsonRequest(body: unknown, contentType = "application/json") {
  return new Request("http://localhost/api/x", {
    method: "POST",
    headers: { "content-type": contentType },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function loginAs(role: string | null) {
  vi.mocked(auth.api.getSession).mockResolvedValue({
    user: { id: "u1", role },
  } as never);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createRoute", () => {
  it("responde 401 sem sessão e não roda o handler", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);
    const handler = vi.fn();

    const res = await createRoute({ handler })(new Request("http://x/api"));

    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ ok: false, code: "UNAUTHORIZED" });
    expect(handler).not.toHaveBeenCalled();
  });

  it("responde 403 a quem não tem o papel", async () => {
    loginAs("user");
    const handler = vi.fn();

    const res = await createRoute({ roles: ["admin"], handler })(
      new Request("http://x/api"),
    );

    expect(res.status).toBe(403);
    expect(handler).not.toHaveBeenCalled();
  });

  it("entrega input validado, params e usuário ao handler", async () => {
    loginAs("admin");
    const handler = vi.fn(async () => "feito");

    const res = await createRoute({
      schema,
      roles: ["admin"],
      status: 201,
      handler,
    })(jsonRequest({ name: "a" }), {
      params: Promise.resolve({ id: "42" }),
    });

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true, data: "feito" });
    expect(handler).toHaveBeenCalledWith({
      input: { name: "a" },
      params: { id: "42" },
      user: { id: "u1", role: "admin" },
    });
  });

  it("responde 400 com fieldErrors quando o corpo não passa no schema", async () => {
    loginAs(null);

    const res = await createRoute({ schema, handler: vi.fn() })(
      jsonRequest({ name: "" }),
    );

    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({
      code: "VALIDATION_ERROR",
      fieldErrors: { name: ["Informe o nome"] },
    });
  });

  it("responde 400 para JSON malformado", async () => {
    loginAs(null);

    const res = await createRoute({ schema, handler: vi.fn() })(
      jsonRequest("{nao-e-json"),
    );

    expect(res.status).toBe(400);
  });

  it("responde 415 quando o Content-Type não é JSON", async () => {
    loginAs(null);

    const res = await createRoute({ schema, handler: vi.fn() })(
      jsonRequest({ name: "a" }, "text/plain"),
    );

    expect(res.status).toBe(415);
  });

  it("converte AppError no status do próprio erro", async () => {
    loginAs(null);

    const res = await createRoute({
      handler: async () => {
        throw new NotFoundError("Nota não encontrada.");
      },
    })(new Request("http://x/api"));

    expect(res.status).toBe(404);
    expect(await res.json()).toMatchObject({
      error: "Nota não encontrada.",
      code: "NOT_FOUND",
    });
  });

  it("esconde o detalhe de erros inesperados (500 genérico)", async () => {
    loginAs(null);

    const res = await createRoute({
      handler: async () => {
        throw new Error("senha do banco vazou");
      },
    })(new Request("http://x/api"));

    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("senha do banco");
  });
});
