/**
 * Poda do template por tipo de projeto: `pnpm bootstrap` chama este script, ou
 * rode direto: `node scripts/prune.ts [--mode=full|front|back] [--yes] [--force]`.
 *
 * - `full`  mantém tudo (só apaga este script e `scripts/variants/`);
 * - `front` só interface: remove banco, auth, e-mail, Docker e as telas de login;
 * - `back`  só API: remove a interface (pages, componentes, Tailwind, shadcn...).
 *
 * Como funciona: apaga os caminhos de `remove`, tira de `package.json` as deps
 * e scripts que sobram sem uso e copia por cima os arquivos de
 * `scripts/variants/<modo>/` (mesmo caminho relativo, a partir da raiz). Os
 * overlays existem porque alguns arquivos (`nav.config.ts`, `Header.tsx`...)
 * misturam as duas metades; editar por regex quebraria em silêncio.
 *
 * Segurança: só roda com a árvore git limpa e ao menos um commit, assim
 * `git restore . && git clean -fd` desfaz tudo. Sem isso, exige `--force`.
 *
 * Roda direto no Node 24, sem dependências: só `node:*`.
 */
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, relative } from "node:path";
import { createInterface } from "node:readline/promises";

type Mode = "full" | "front" | "back";

interface Variant {
  label: string;
  /** Arquivos e pastas a apagar (relativos à raiz). */
  remove: string[];
  /** Pacotes a tirar de `dependencies` / `devDependencies`. */
  removeDeps: string[];
  /** Scripts a tirar do `package.json`. */
  removeScripts: string[];
}

const VARIANTS_DIR = "scripts/variants";
const isWindows = process.platform === "win32";

const variants: Record<Mode, Variant> = {
  full: {
    label: "Full stack — tudo: interface, auth, banco, e-mail e Docker",
    remove: [],
    removeDeps: [],
    removeScripts: [],
  },
  front: {
    label:
      "Só front — interface (Tailwind, shadcn, Motion, tema), sem banco/auth",
    remove: [
      // banco, auth, e-mail e a camada de actions (ela depende da sessão)
      "prisma",
      "prisma.config.ts",
      "lib/db",
      "lib/auth",
      "lib/email",
      "lib/errors",
      "lib/actions",
      "env.ts",
      // features que dependem de tudo isso
      "features",
      "app/api",
      "app/(private)",
      "app/(public)/login",
      "app/(public)/register",
      "app/(public)/forgot-password",
      "app/(public)/reset-password",
      "proxy.ts",
      // Docker e setup de banco
      "Dockerfile",
      "docker-compose.yml",
      ".dockerignore",
      "docs/docker.md",
      "scripts/setup.ts",
    ],
    removeDeps: [
      "@prisma/adapter-neon",
      "@prisma/adapter-pg",
      "@prisma/client",
      "@react-email/components",
      "@react-email/render",
      "better-auth",
      "pg",
      "prisma",
      "react-email",
      "resend",
      "dotenv",
      "tsx",
    ],
    removeScripts: [
      "bootstrap",
      "postinstall",
      "db:migrate",
      "db:deploy",
      "db:push",
      "db:studio",
      "db:seed",
      "email:dev",
    ],
  },
  back: {
    label: "Só back — API (route handlers), banco, auth, e-mail e Docker",
    remove: [],
    removeDeps: [],
    removeScripts: [],
  },
};

function fail(message: string): never {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

function run(command: string, args: string[]): boolean {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: isWindows,
  });
  return result.status === 0;
}

function capture(command: string, args: string[]): string | undefined {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: isWindows,
  });
  return result.status === 0 ? result.stdout : undefined;
}

/** Valor de `--nome=valor` / flag booleana `--nome` em `process.argv`. */
function getFlag(name: string): string | boolean | undefined {
  for (const arg of process.argv.slice(2)) {
    if (arg === `--${name}`) return true;
    if (arg.startsWith(`--${name}=`)) return arg.slice(name.length + 3);
  }
  return undefined;
}

function isMode(value: unknown): value is Mode {
  return value === "full" || value === "front" || value === "back";
}

/** Arquivos de uma pasta, recursivo, como caminhos relativos a ela. */
function listFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => relative(dir, join(entry.parentPath, entry.name)));
}

async function askMode(): Promise<Mode> {
  const modes = Object.keys(variants) as Mode[];
  console.log("Que tipo de projeto você vai criar?\n");
  modes.forEach((mode, index) =>
    console.log(`  ${index + 1}) ${variants[mode].label}`),
  );

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    for (;;) {
      const answer = (await rl.question("\nEscolha [1-3]: ")).trim();
      const mode = modes[Number(answer) - 1] ?? answer;
      if (isMode(mode)) return mode;
      console.log("Opção inválida. Digite 1, 2 ou 3 (ou full, front, back).");
    }
  } finally {
    rl.close();
  }
}

async function confirm(question: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(`${question} [y/N] `);
    return /^(y|s)/i.test(answer.trim());
  } finally {
    rl.close();
  }
}

/** Remove os artefatos da poda: depois da escolha eles viram peso morto. */
function cleanUp(): void {
  rmSync("scripts/prune.ts", { force: true });
  rmSync(VARIANTS_DIR, { recursive: true, force: true });
}

/** `git restore` só salva se o estado atual estiver commitado e limpo. */
function assertSafeToDelete(): void {
  if (getFlag("force")) return;

  const status = capture("git", ["status", "--porcelain"]);
  const hasCommit = capture("git", ["rev-parse", "--verify", "HEAD"]);

  if (status === undefined || !hasCommit) {
    fail(
      "Não há commit para voltar atrás. Rode `git init && git add -A && git commit -m 'chore: initial commit'` " +
        "antes (assim dá para desfazer a poda) ou use --force.",
    );
  }
  if (status.trim() !== "") {
    fail(
      "Há mudanças não commitadas. Faça commit ou stash antes (assim dá para desfazer a poda) ou use --force.",
    );
  }
}

function patchPackageJson(variant: Variant): void {
  const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  for (const name of variant.removeDeps) {
    delete pkg.dependencies?.[name];
    delete pkg.devDependencies?.[name];
  }
  for (const name of variant.removeScripts) delete pkg.scripts?.[name];

  writeFileSync("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
}

// ── 1. modo ───────────────────────────────────────────────────────────────────
const flagMode = getFlag("mode");
if (flagMode !== undefined && !isMode(flagMode)) {
  fail(`--mode inválido: "${String(flagMode)}". Use full, front ou back.`);
}

if (!existsSync(VARIANTS_DIR)) {
  fail("scripts/variants não existe: o template já foi podado.");
}

// Sem terminal interativo (CI, pipe) e sem --mode, não há quem responda:
// não decide por você e deixa o template como está.
if (!isMode(flagMode) && !process.stdin.isTTY) {
  console.log("Sem terminal interativo e sem --mode: mantendo o template.");
  process.exit(0);
}

const mode: Mode = isMode(flagMode) ? flagMode : await askMode();
const variant = variants[mode];

if (mode === "full") {
  cleanUp();
  console.log("\n✔ Full stack: nada removido.");
  process.exit(0);
}

// ── 2. plano e confirmação ────────────────────────────────────────────────────
assertSafeToDelete();

const overlayDir = join(VARIANTS_DIR, mode);
const overlays = existsSync(overlayDir) ? listFiles(overlayDir) : [];
const toRemove = variant.remove.filter((path) => existsSync(path));

console.log(`\nModo: ${variant.label}\n`);
console.log("Vai apagar:");
toRemove.forEach((path) => console.log(`  - ${path}`));
console.log("\nVai substituir:");
overlays.forEach((path) => console.log(`  ~ ${path}`));
console.log("\nVai tirar do package.json:");
console.log(`  deps:    ${variant.removeDeps.join(", ") || "(nenhuma)"}`);
console.log(`  scripts: ${variant.removeScripts.join(", ") || "(nenhum)"}`);

if (!getFlag("yes") && !(await confirm("\nPodar o projeto agora?"))) {
  console.log("Nada foi alterado.");
  process.exit(0);
}

// ── 3. poda ───────────────────────────────────────────────────────────────────
console.log("\nPodando...");
for (const path of toRemove) rmSync(path, { recursive: true, force: true });
// `cpSync` cria as pastas que faltam no destino.
for (const path of overlays)
  cpSync(join(overlayDir, path), path, { force: true });
patchPackageJson(variant);
cleanUp();

// ── 4. instala e confere ──────────────────────────────────────────────────────
// `--no-frozen-lockfile`: o package.json mudou, então o lockfile precisa mudar
// também (em CI o pnpm assume frozen por padrão).
console.log("\nAtualizando dependências (pnpm install)");
if (!run("pnpm", ["install", "--no-frozen-lockfile"])) {
  fail("O pnpm install falhou. A poda já foi aplicada: veja o erro acima.");
}

if (!getFlag("skip-checks")) {
  console.log("\nConferindo o resultado");
  for (const script of ["typecheck", "lint", "test"]) {
    if (!run("pnpm", [script])) {
      fail(`\`pnpm ${script}\` falhou depois da poda. Veja o erro acima.`);
    }
  }
}

console.log(`
✔ Poda concluída (${mode}). Revise com \`git status\` e desfaça, se quiser, com
  git restore . && git clean -fd

Atenção: os arquivos em docs/ e o README ainda citam partes que podem ter sido removidas.`);
