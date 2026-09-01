import { resolveStepFiles } from "specflow-emulator";

/**
 * Global setup — runs ONCE in the main Vitest process (before any fork/worker).
 *
 * The glob scan is done here so that each worker fork can skip it and call
 * `loadSteps({ files: inject('stepFiles') })` directly.
 *
 * The `provide` function serialises the string array and makes it available
 * in every worker via Vitest's `inject()`.
 */
export const setup = ({ provide }) => {
  const stepFiles = resolveStepFiles("./src/__features__");
  provide("stepFiles", stepFiles);
};
