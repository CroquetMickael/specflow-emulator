import { IJestLike, Options, defineFeature as getFeature } from "jest-cucumber";
import callsites from "callsites";
import { globSync } from "glob";
import path from "path";

import {
  ParsedScenario,
  ParsedScenarioOutline,
} from "jest-cucumber/dist/src/models";
import { DefineScenarioFunction } from "jest-cucumber/dist/src/feature-definition-creation";
import { StepBlock } from "./common.types";
import { formatStepMatchingError } from "./errors";
import { StepDefinition } from "./stepDefinition";
import { loadFeature } from "jest-cucumber/dist/src/parsed-feature-loading";

const STEP_DEFINITIONS_GLOB = "**/*.stepdefinitions.{js,jsx,ts,tsx}";

const stepNotExportedString = (filePath: string) =>
  `File ${filePath} does not export a stepDefinitions variable`;

const stepPool: StepDefinition[] = [];
/** Promise lock: prevents concurrent calls to loadSteps from creating duplicates */
let loadingPromise: Promise<void> | null = null;
let internalRunner: IJestLike | undefined = undefined;

/**
 * Resolves the list of step definition file paths matching the given directory.
 * This is a pure I/O operation (glob scan) that returns serializable strings.
 * Designed to be called once in a globalSetup file and its result shared with
 * worker processes via Vitest's `provide`/`inject` or an environment variable.
 *
 * @param dir - Directory to scan (default: `"./src/__features__"`)
 * @returns Absolute paths of all matching step definition files
 */
export const resolveStepFiles = (dir = "./src/__features__"): string[] => {
  const pattern = `${dir}/${STEP_DEFINITIONS_GLOB}`;
  return globSync(pattern).map((f) => path.resolve(f));
};

export const defineFeature = (
  cheminFichier: string,
  isCheminRelatif = true
) => {
  const infoAppelant = callsites()[1];
  const fichierAppelant = (infoAppelant && infoAppelant.getFileName()) || "";
  const dossierAppelant = path.dirname(fichierAppelant);
  const cheminAbsolu = isCheminRelatif
    ? `${dossierAppelant}/${cheminFichier}`
    : cheminFichier;

  const config: Options = {
    loadRelativePath: false,
    errors: {
      allowScenariosNotInFeatureFile: false,
      scenariosMustMatchFeatureFile: true,
      stepsMustMatchFeatureFile: true,
    },
  };

  if (internalRunner && Object.keys(internalRunner).length > 0) {
    config.runner = internalRunner;
  }

  const feature = loadFeature(cheminAbsolu, config);

  const getNewBlock = (
    stepKeyword: string,
    currentBlock: StepBlock
  ): StepBlock =>
    ["given", "when", "then"].includes(stepKeyword)
      ? (stepKeyword as StepBlock)
      : currentBlock;

  getFeature(feature, (defineScenarioJest) => {
    const defineScenarios = (
      scenarios: ParsedScenario[] | ParsedScenarioOutline[]
    ) => {
      scenarios.forEach((scenario) => {
        const tags = feature.tags.concat(scenario.tags);
        const availableSteps = stepPool.filter((step) =>
          step.hasMatchingScopes(feature.title, scenario.title, tags)
        );
        const scenarioContext = {};

        let defineScenario: DefineScenarioFunction = defineScenarioJest;
        if (scenario.tags.includes("@only")) {
          defineScenario = defineScenarioJest.only;
        }
        if (
          scenario.tags.includes("@ignore") ||
          scenario.tags.includes("@skip")
        ) {
          defineScenario = defineScenarioJest.skip;
        }

        let currentBlock: StepBlock = "given";
        defineScenario(scenario.title, (stepsDefinitionCallBack) => {
          scenario.steps.forEach((step) => {
            currentBlock = getNewBlock(step.keyword, currentBlock);
            const stepDefinitions = availableSteps.filter((stepDefinition) => {
              if (stepDefinition.block !== currentBlock) {
                return false;
              }
              const matchResult = step.stepText.match(stepDefinition.match);
              return matchResult && matchResult[0] === step.stepText;
            });

            if (stepDefinitions.length !== 1) {
              const matchingError = formatStepMatchingError(
                cheminAbsolu,
                feature,
                scenario,
                step,
                stepDefinitions
              );
              throw new Error(matchingError);
            }

            const { selectJestCallback, match, callback } = stepDefinitions[0];
            const defineStepJest = selectJestCallback(stepsDefinitionCallBack);
            defineStepJest(match, callback(scenarioContext));
          });
        });
      });
    };

    defineScenarios(feature.scenarios);
    defineScenarios(feature.scenarioOutlines);
  });
};

/**
 * Loads all step definitions into the step pool.
 *
 * @param options.runner   - Custom test runner (e.g. `{ describe, test }` for non-Vitest runners)
 * @param options.dir      - Directory to scan when `files` is not provided (default: `"./src/__features__"`)
 * @param options.files    - Pre-resolved list of absolute file paths produced by `resolveStepFiles()`.
 *                           When provided, the glob scan is **skipped entirely** — useful in fork/worker
 *                           mode where the glob was already done once in `globalSetup`.
 *
 * @example Vitest — globalSetup + provide/inject (recommended for fork mode)
 * ```js
 * // vitest.global-setup.js  (runs once in the main process)
 * import { resolveStepFiles } from 'specflow-emulator';
 * export const setup = ({ provide }) => { provide('stepFiles', resolveStepFiles()); };
 *
 * // setupTests.js  (runs once per worker/fork)
 * import { inject } from 'vitest';
 * import { loadSteps } from 'specflow-emulator';
 * await loadSteps({ files: inject('stepFiles') });
 * ```
 *
 * @example Jest — globalSetup + env variable
 * ```js
 * // jest.global-setup.js
 * const { resolveStepFiles } = require('specflow-emulator');
 * module.exports = async () => { process.env.STEP_FILES = JSON.stringify(resolveStepFiles()); };
 *
 * // setupTests.js
 * const { loadSteps } = require('specflow-emulator');
 * const files = process.env.STEP_FILES ? JSON.parse(process.env.STEP_FILES) : undefined;
 * await loadSteps({ files });
 * ```
 */
export const loadSteps = ({
  runner = undefined,
  dir = "./src/__features__",
  files = undefined,
}: {
  runner?: IJestLike;
  /** @deprecated Use `dir` instead */
  dossier?: string;
  dir?: string;
  files?: string[];
} = {}): Promise<void> => {
  // Promise lock: if a load is already in progress (or done), return the same promise.
  // This fixes the race condition where two concurrent callers both pass a boolean guard.
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    stepPool.length = 0;

    const resolvedFiles = files ?? resolveStepFiles(dir);

    for (const filePath of resolvedFiles) {
      const { stepDefinitions } = (await import(filePath)) as {
        stepDefinitions: StepDefinition[];
      };

      if (!stepDefinitions) {
        console.error(stepNotExportedString(filePath));
        return;
      }
      stepDefinitions.forEach((stepDefinition) => {
        stepDefinition.cheminFichier = filePath;
        stepPool.push(stepDefinition);
      });
    }

    if (runner && Object.keys(runner).length > 0) {
      internalRunner = runner;
    }
  })();

  return loadingPromise;
};

/**
 * Resets the step pool and allows `loadSteps` to be called again.
 * Useful for test isolation when running multiple suites in the same process.
 */
export const resetSteps = (): void => {
  stepPool.length = 0;
  loadingPromise = null;
  internalRunner = undefined;
};
