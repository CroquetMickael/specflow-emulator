import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { specflowFeatures } from "specflow-emulator/vite";

export default defineConfig({
  plugins: [specflowFeatures()],
  optimizeDeps: {
    include: [
      "@cucumber/gherkin",
      "jest-cucumber/dist/src/configuration",
      "jest-cucumber/dist/src/feature-definition-creation",
    ],
  },
  test: {
    globals: true,
    include: [
      "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "**/*.steps.js",
    ],
    setupFiles: ["./setupTests.js"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
