import { IJestLike } from "jest-cucumber/dist/src/feature-definition-creation";

import { parseFeature } from "./parseFeature";
import { StepDefinition } from "./stepDefinition";
import {
  bindFeature,
  buildConfig,
  markStepsLoaded,
  registerSteps,
  resetStepPool,
  setRunner,
  stepNotExportedString,
  stepsLoaded,
} from "./engine";

export { defineSteps } from "./defineSteps";

/**
 * Browser-mode variant of `defineFeature`.
 *
 * `fs` is not available inside a browser, so the `.feature` file cannot be read
 * from a path. Pass the raw Gherkin text instead, obtained either through Vite's
 * `?raw` suffix (`import feature from "./x.feature?raw"`) or through the
 * `specflowFeatures()` plugin from `specflow-emulator/vite`
 * (`import feature from "./x.feature"`).
 */
export const defineFeature = (feature: string) => {
  bindFeature(parseFeature(feature, buildConfig()), "");
};

type StepModule = { stepDefinitions?: StepDefinition[] };

/**
 * Result of `import.meta.glob("...stepdefinitions...")`, eager or lazy.
 */
export type StepModules = Record<
  string,
  StepModule | (() => Promise<StepModule>)
>;

/**
 * Browser-mode variant of `loadSteps`.
 *
 * `glob` and filesystem access are not available inside a browser, so the caller
 * discovers the step definition files with Vite's `import.meta.glob` and passes
 * the result:
 *
 * ```js
 * await loadSteps({
 *   modules: import.meta.glob("./src/**\/*.stepdefinitions.js", { eager: true }),
 * });
 * ```
 */
export const loadSteps = async ({
  runner = undefined,
  modules,
}: {
  runner?: IJestLike;
  modules: StepModules;
}) => {
  if (stepsLoaded()) {
    return;
  }

  resetStepPool();

  for (const [source, entry] of Object.entries(modules)) {
    const stepModule = typeof entry === "function" ? await entry() : entry;

    if (!stepModule || !stepModule.stepDefinitions) {
      console.error(stepNotExportedString(source));
      return;
    }
    registerSteps(stepModule.stepDefinitions, source);
  }

  setRunner(runner);
  markStepsLoaded();
};
