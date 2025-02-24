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
    setupFiles: ["./setupTests.js"],
    watch: true,
    deps: {
      inline: ['specflow-emulator'],
    },
  },
  plugins: [react()],
});
