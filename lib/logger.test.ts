import { describe, expect, it } from "vitest";

import { createLogger, type LogLevel } from "./logger";

function setup(
  options: {
    level?: "debug" | "info" | "warn" | "error" | "silent";
    json?: boolean;
  } = {},
) {
  const lines: Array<{ level: LogLevel; line: string }> = [];
  const log = createLogger({
    level: options.level ?? "debug",
    json: options.json ?? true,
    sink: (level, line) => lines.push({ level, line }),
  });
  return { log, lines };
}

describe("createLogger", () => {
  it("filtra pelo nível mínimo", () => {
    const { log, lines } = setup({ level: "warn" });
    log.debug("a");
    log.info("b");
    log.warn("c");
    log.error("d");

    expect(lines.map((l) => l.level)).toEqual(["warn", "error"]);
  });

  it("silent não escreve nada", () => {
    const { log, lines } = setup({ level: "silent" });
    log.error("x");

    expect(lines).toHaveLength(0);
  });

  it("escreve uma linha JSON com level, time, msg e contexto", () => {
    const { log, lines } = setup();
    log.info("nota criada", { noteId: "n1" });

    expect(JSON.parse(lines[0].line)).toEqual({
      level: "info",
      time: expect.any(String),
      msg: "nota criada",
      noteId: "n1",
    });
  });

  it("não deixa o contexto sobrescrever level, time e msg", () => {
    const { log, lines } = setup();
    log.info("real", { level: "fake", msg: "fake", time: "fake" });
    const out = JSON.parse(lines[0].line);

    expect(out.level).toBe("info");
    expect(out.msg).toBe("real");
    expect(out.time).not.toBe("fake");
  });

  it("serializa Error com name, message, stack, digest e cause", () => {
    const { log, lines } = setup();
    const error = Object.assign(
      new Error("falhou", { cause: new Error("raiz") }),
      {
        digest: "123",
      },
    );
    log.error("erro", { err: error });
    const { err } = JSON.parse(lines[0].line);

    expect(err).toMatchObject({
      name: "Error",
      message: "falhou",
      digest: "123",
    });
    expect(err.stack).toContain("falhou");
    expect(err.cause).toMatchObject({ message: "raiz" });
  });

  it("troca valores de chaves sensíveis por [redacted], inclusive aninhadas", () => {
    const { log, lines } = setup();
    log.info("login", {
      email: "a@b.com",
      password: "senha123",
      user: { Authorization: "Bearer x", name: "Ana" },
    });
    const out = JSON.parse(lines[0].line);

    expect(out.email).toBe("a@b.com");
    expect(out.password).toBe("[redacted]");
    expect(out.user).toEqual({ Authorization: "[redacted]", name: "Ana" });
  });

  it("child herda os bindings do pai", () => {
    const { log, lines } = setup();
    log.child({ feature: "notes" }).child({ userId: "u1" }).info("ok");

    expect(JSON.parse(lines[0].line)).toMatchObject({
      feature: "notes",
      userId: "u1",
    });
  });

  it("não quebra com referência circular", () => {
    const { log, lines } = setup();
    const loop: Record<string, unknown> = { a: 1 };
    loop.self = loop;
    log.info("ciclo", { loop });

    expect(() => JSON.parse(lines[0].line)).not.toThrow();
  });

  it("no formato de dev mostra o nível, a mensagem e a stack", () => {
    const { log, lines } = setup({ json: false });
    log.error("deu ruim", { err: new Error("boom"), userId: "u1" });

    expect(lines[0].line).toContain("ERROR");
    expect(lines[0].line).toContain("deu ruim");
    expect(lines[0].line).toContain("userId");
    expect(lines[0].line).toContain("Error: boom");
  });
});
