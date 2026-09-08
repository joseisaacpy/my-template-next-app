import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next", "lib/generated"],
  },
  resolve: {
    alias: [
      // `server-only` lança fora do bundler do Next — stub nos testes.
      {
        find: /^server-only$/,
        replacement: `${root}vitest/stubs/server-only.ts`,
      },
      // Mesmo alias do tsconfig: `@/x` → `<root>/x`.
      { find: /^@\/(.*)$/, replacement: `${root}$1` },
    ],
  },
});
