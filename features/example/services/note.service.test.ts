import { beforeEach, describe, expect, it, vi } from "vitest";

import { NotFoundError } from "@/lib/errors";

vi.mock("../repositories/note.repository", () => ({
  noteRepository: {
    listByUser: vi.fn(),
    findByIdForUser: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const { noteRepository } = await import("../repositories/note.repository");
const { noteService } = await import("./note.service");

const row = {
  id: "n1",
  title: "t",
  content: "c",
  userId: "u1",
  createdAt: new Date("2026-01-02T03:04:05Z"),
  updatedAt: new Date("2026-01-02T03:04:05Z"),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("noteService.list", () => {
  it("devolve DTOs sem userId", async () => {
    vi.mocked(noteRepository.listByUser).mockResolvedValue([row]);
    const [dto] = await noteService.list("u1");
    expect(dto).toEqual({
      id: "n1",
      title: "t",
      content: "c",
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
    expect(dto).not.toHaveProperty("userId");
  });
});

describe("noteService.update", () => {
  it("lança NotFoundError quando nada foi atualizado", async () => {
    vi.mocked(noteRepository.update).mockResolvedValue({ count: 0 });
    await expect(
      noteService.update("n1", "u1", { title: "t", content: "c" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("recarrega o DTO quando atualiza", async () => {
    vi.mocked(noteRepository.update).mockResolvedValue({ count: 1 });
    vi.mocked(noteRepository.findByIdForUser).mockResolvedValue(row);
    const dto = await noteService.update("n1", "u1", {
      title: "t",
      content: "c",
    });
    expect(dto.id).toBe("n1");
  });
});

describe("noteService.remove", () => {
  it("lança NotFoundError quando nada foi apagado", async () => {
    vi.mocked(noteRepository.delete).mockResolvedValue({ count: 0 });
    await expect(noteService.remove("n1", "u1")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
