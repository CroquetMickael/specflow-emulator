import { resolveStepFiles } from "specflow-emulator";

/**
 * Global setup — runs ONCE in the main Vitest process (before any fork/worker).
 *
 * The glob scan is done here so that each worker fork can skip it and call
 * `loadSteps({ files: inject('stepFiles') })` directly.
 */
export const setup = ({ provide }) => {
  const stepFiles = resolveStepFiles("./src/__features__");
  provide("stepFiles", stepFiles);
};

