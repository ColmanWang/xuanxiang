import { fileURLToPath } from "node:url";
import { loadEnvFile } from "node:process";
import { defineConfig } from "vitest/config";

loadEnvFile();

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],
  },
});
