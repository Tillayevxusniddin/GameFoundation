import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Vitest alohida configi vite.config.ts bilan bir xil test qoidasini takrorlaydi.
// Bitta manba yetarli bo'lsa ham, talab bo'yicha alohida fayl saqlanadi.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
});
