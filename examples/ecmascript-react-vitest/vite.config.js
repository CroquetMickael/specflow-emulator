import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    include: [
      "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "**/*.steps.js",
    ],
    environment: 'jsdom',
    globalSetup: ['./vitest.global-setup.js'],
    setupFiles: ["./setupTests.js"],
  },
  plugins: [react()],
});
