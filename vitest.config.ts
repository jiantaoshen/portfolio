import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    alias: {
      "server-only": fileURLToPath(
        new URL(
          "./test/server-only.ts",
          import.meta.url,
        ),
      ),
    },
  },
});