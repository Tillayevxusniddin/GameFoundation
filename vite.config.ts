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
    rollupOptions: {
      output: {
        // docs/12_MVP_ROADMAP.md — Phaser va CodeMirror alohida vendor
        // chunk'larga ajratiladi; asosiy bundle yengil qoladi.
        manualChunks(id: string): string | undefined {
          if (!id.includes("node_modules")) {
            return undefined;
          }
          if (id.includes("phaser")) {
            return "vendor-phaser";
          }
          if (
            id.includes("@codemirror") ||
            id.includes("/codemirror/") ||
            id.includes("@lezer")
          ) {
            return "vendor-codemirror";
          }
          return undefined;
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
});
