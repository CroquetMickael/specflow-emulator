import { inject } from "vitest";
import { loadSteps } from "specflow-emulator";

// `inject('stepFiles')` receives the pre-resolved list from vitest.global-setup.js.
// The glob scan is skipped in each fork — only the dynamic imports happen here.
const stepFiles = inject("stepFiles");
await loadSteps({ files: stepFiles });