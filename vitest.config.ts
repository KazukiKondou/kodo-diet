import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**"],
      reporter: ["text", "html"],
    },
  },
})
