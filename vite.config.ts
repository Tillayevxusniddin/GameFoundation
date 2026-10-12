import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Birlashgan config: Vite + Vitest.
// docs/06_TECHNICAL_ARCHITECTURE.md: TypeScript strict, React overlay,
// Phaser keyin ulanadi.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
});
