/**
 * Setup do primeiro uso: `pnpm bootstrap`.
 *
 * 1. cria o `.env` a partir do `.env.example` (se não existir);
 * 2. gera o `BETTER_AUTH_SECRET` e aponta o banco para o Postgres do Docker,
 *    mas só onde o valor está **em branco** — nunca sobrescreve o que você já
 *    preencheu (pode rodar de novo sem medo);
 * 3. sobe o banco (`docker compose up -d --wait db`) e aplica as migrações.
 *
 * Quem usa o Neon: preencha `DATABASE_URL` no `.env` antes — o script então não
 * mexe no banco nem no Docker, só aplica as migrações.
 *
 * Roda direto no Node 24 (`node scripts/setup.ts`), sem dependências: só `node:*`.
 */
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const ENV_FILE = ".env";
const ENV_EXAMPLE = ".env.example";
const isWindows = process.platform === "win32";

/** Valor de `KEY=valor` (sem aspas), ou `undefined` se a linha não existe. */
function getValue(content: string, key: string): string | undefined {
  const match = content.match(new RegExp(`^${key}=(.*)$`, "m"));
  return match?.[1].trim().replace(/^["']|["']$/g, "");
}

/** Troca a linha `KEY=...` (ou acrescenta no fim, se não existir). */
function setValue(content: string, key: string, value: string): string {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (pattern.test(content)) return content.replace(pattern, line);
  return `${content.replace(/\n*$/, "\n")}${line}\n`;
}

function run(command: string, args: string[]): boolean {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: isWindows,
  });
  return result.status === 0;
}

function hasCommand(command: string): boolean {
  return (
    spawnSync(command, ["--version"], { stdio: "ignore", shell: isWindows })
      .status === 0
  );
}

function fail(message: string): never {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

// ── 1. .env ───────────────────────────────────────────────────────────────────
console.log("1/3  Configurando o .env");

if (!existsSync(ENV_FILE)) {
  if (!existsSync(ENV_EXAMPLE)) fail(`${ENV_EXAMPLE} não encontrado.`);
  copyFileSync(ENV_EXAMPLE, ENV_FILE);
  console.log(`     criado ${ENV_FILE} a partir de ${ENV_EXAMPLE}`);
} else {
  console.log(
    `     ${ENV_FILE} já existe: só preencho o que estiver em branco`,
  );
}

let env = readFileSync(ENV_FILE, "utf8");

if (!getValue(env, "BETTER_AUTH_SECRET")) {
  env = setValue(env, "BETTER_AUTH_SECRET", randomBytes(32).toString("base64"));
  console.log("     BETTER_AUTH_SECRET gerado");
}

// Banco em branco (ou com a URL que este script já gerou) = Postgres do
// docker-compose. Qualquer outra URL (ex.: Neon) é respeitada e não toca o Docker.
const GENERATED_URL = /^postgresql:\/\/postgres:postgres@localhost:\d+\/app$/;
const currentUrl = getValue(env, "DATABASE_URL");
const useDockerDb = !currentUrl || GENERATED_URL.test(currentUrl);

if (useDockerDb) {
  // `DB_PORT` (lido também pelo docker-compose) permite fugir de uma porta ocupada.
  const port = getValue(env, "DB_PORT") || "5432";
  const dockerUrl = `postgresql://postgres:postgres@localhost:${port}/app`;

  if (currentUrl !== dockerUrl) {
    env = setValue(env, "DATABASE_URL", dockerUrl);
    console.log(
      `     DATABASE_URL apontando para o Postgres do Docker (:${port})`,
    );
  }
  if (getValue(env, "DATABASE_DRIVER") !== "pg") {
    env = setValue(env, "DATABASE_DRIVER", "pg");
  }
} else {
  console.log("     DATABASE_URL já definido: mantido como está");
}

writeFileSync(ENV_FILE, env);

// ── 2. Banco ──────────────────────────────────────────────────────────────────
console.log("2/3  Banco de dados");

if (useDockerDb) {
  if (!hasCommand("docker")) {
    fail(
      "Docker não encontrado. Instale o Docker ou preencha DATABASE_URL no " +
        ".env com a URL de um Postgres (ex.: Neon) e rode `pnpm bootstrap` de novo.",
    );
  }
  if (!run("docker", ["compose", "up", "-d", "--wait", "db"])) {
    fail(
      "Não consegui subir o banco. Veja o erro acima (porta 5432 ocupada? defina DB_PORT no .env).",
    );
  }
} else {
  console.log("     usando o banco já configurado (Docker não é necessário)");
}

// ── 3. Migrações ──────────────────────────────────────────────────────────────
console.log("3/3  Aplicando as migrações");

if (!run("pnpm", ["db:deploy"])) {
  fail("As migrações falharam. Confira o DATABASE_URL no .env.");
}

console.log(`
✔ Pronto! Próximos passos:

  pnpm db:seed   # (opcional) admin de demonstração: admin@example.com / Admin@12345
  pnpm dev       # http://localhost:3000

Guia completo: docs/getting-started.md`);
