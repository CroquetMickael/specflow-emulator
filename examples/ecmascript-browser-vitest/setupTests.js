import { loadSteps } from "specflow-emulator/browser";

// `import.meta.glob` is resolved by Vite at build time: it replaces `glob` +
// filesystem access, which are unavailable in the browser.
await loadSteps({
  modules: import.meta.glob("./src/**/*.stepdefinitions.js", { eager: true }),
});
