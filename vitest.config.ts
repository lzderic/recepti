import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/__tests__/**/*.test.ts", "src/__tests__/**/*.test.tsx"],
    setupFiles: ["./vitest.setup.ts"],
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.d.ts",
        "**/*.test.*",
        "src/test-utils/**",
        "src/types/**",
        "src/styles/**",
        "src/store/**",
        // Barrel / wiring-only modules
        "src/lib/api.ts",
        "src/lib/server/db.ts",
        // App routes/pages/components are mostly wiring; unit testing them is optional.
        "src/app/**",
        "src/components/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "server-only": path.resolve(__dirname, "src", "test-utils", "server-only.ts"),
    },
  },
});
