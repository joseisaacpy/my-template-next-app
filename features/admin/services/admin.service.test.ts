import { beforeEach, describe, expect, it, vi } from "vitest";

import { ForbiddenError } from "@/lib/errors";

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@/lib/auth/auth", () => ({
  auth: { api: { listUsers: vi.fn(), setRole: vi.fn() } },
}));

const { auth } = await import("@/lib/auth/auth");
const { adminService } = await import("./admin.service");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("adminService.setRole", () => {
  it("impede o admin de alterar o próprio papel", async () => {
    await expect(
      adminService.setRole("u1", { userId: "u1", role: "user" }),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(auth.api.setRole).not.toHaveBeenCalled();
  });

  it("repassa a troca de papel de outro usuário ao plugin", async () => {
    await adminService.setRole("u1", { userId: "u2", role: "admin" });

    expect(auth.api.setRole).toHaveBeenCalledWith(
      expect.objectContaining({ body: { userId: "u2", role: "admin" } }),
    );
  });
});

describe("adminService.listUsers", () => {
  it("devolve DTOs com papel normalizado (null vira user)", async () => {
    const createdAt = new Date("2026-01-02T03:04:05Z");
    vi.mocked(auth.api.listUsers).mockResolvedValue({
      users: [
        { id: "a", name: "A", email: "a@x.com", role: "admin", createdAt },
        { id: "b", name: "B", email: "b@x.com", role: null, createdAt },
      ],
      total: 2,
    } as never);

    const users = await adminService.listUsers();

    expect(users).toEqual([
      { id: "a", name: "A", email: "a@x.com", role: "admin", createdAt },
      { id: "b", name: "B", email: "b@x.com", role: "user", createdAt },
    ]);
  });
});
