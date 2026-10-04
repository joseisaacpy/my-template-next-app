import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // No servidor use `logger` (lib/logger.ts), não `console`. Exceções: o próprio
  // logger, o seed (script de CLI) e os arquivos que usam `console` de propósito.
  { rules: { "no-console": "error" } },
  {
    files: [
      "lib/logger.ts",
      "lib/email/transports/console.ts",
      "lib/observability/capture-error.ts",
      "prisma/seed.ts",
    ],
    rules: { "no-console": "off" },
  },
  // Desliga regras de estilo que o Prettier já cuida. Sempre por último.
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Client Prisma gerado — código de build, não fonte.
    "lib/generated/**",
  ]),
]);

export default eslintConfig;
