import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  unstable_rethrow: vi.fn(),
}));
vi.mock("@/lib/auth/session", () => ({ requireUser: vi.fn() }));

const { requireUser } = await import("@/lib/auth/session");
const { createAction } = await import("./create-action");

const schema = z.object({ name: z.string() });
const form = new FormData();
form.set("name", "x");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createAction roles", () => {
  it("bloqueia usuário sem o papel com FORBIDDEN, sem rodar o handler", async () => {
    vi.mocked(requireUser).mockResolvedValue({
      id: "u1",
      role: "user",
    } as never);
    const handler = vi.fn();
    const action = createAction({ schema, roles: ["admin"], handler });

    const result = await action(undefined, form);

    expect(result).toMatchObject({ ok: false, code: "FORBIDDEN" });
    expect(handler).not.toHaveBeenCalled();
  });

  it("deixa passar quem tem o papel", async () => {
    vi.mocked(requireUser).mockResolvedValue({
      id: "u1",
      role: "admin",
    } as never);
    const action = createAction({
      schema,
      roles: ["admin"],
      handler: async () => "ok",
    });

    expect(await action(undefined, form)).toEqual({ ok: true, data: "ok" });
  });

  it("sem `roles`, qualquer usuário logado passa", async () => {
    vi.mocked(requireUser).mockResolvedValue({ id: "u1", role: null } as never);
    const action = createAction({ schema, handler: async () => 1 });

    expect(await action(undefined, form)).toEqual({ ok: true, data: 1 });
  });
});
