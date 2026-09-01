import { Options } from "jest-cucumber/dist/src/configuration";
import {
  ParsedFeature,
  ParsedScenario,
  ParsedScenarioOutline,
} from "jest-cucumber/dist/src/models";
import {
  DefineScenarioFunction,
  IJestLike,
  createDefineFeature,
} from "jest-cucumber/dist/src/feature-definition-creation";
import { StepBlock } from "./common.types";
import { formatStepMatchingError } from "./errors";
import { StepDefinition } from "./stepDefinition";

// Imported from the deep path (not the package root) so that this module — and
// therefore `specflow-emulator/browser` — never pulls in
// `jest-cucumber/dist/src/parsed-feature-loading`, which needs `fs`/`glob`.
const getFeature = createDefineFeature();

export const stepNotExportedString = (filePath: string) =>
  `Le fichier ${filePath} n'exporte pas de variable stepDefinitions`;

const stepPool: StepDefinition[] = [];
let isLoaded = false;
let internalRunner: IJestLike = undefined;

export const stepsLoaded = () => isLoaded;

export const markStepsLoaded = () => {
  isLoaded = true;
};

export const resetStepPool = () => {
  stepPool.length = 0;
};

export const setRunner = (runner?: IJestLike) => {
  if (runner && Object.keys(runner).length > 0) {
    internalRunner = runner;
  }
};

export const registerSteps = (
  stepDefinitions: StepDefinition[],
  source: string
) => {
  stepDefinitions.forEach((stepDefinition) => {
    stepDefinition.cheminFichier = source;
    stepPool.push(stepDefinition);
  });
};

export const buildConfig = (): Options => {
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

  return config;
};

const getNewBlock = (
  stepKeyword: string,
  currentBlock: StepBlock
): StepBlock =>
  ["given", "when", "then"].includes(stepKeyword)
    ? (stepKeyword as StepBlock)
    : currentBlock;

export const bindFeature = (feature: ParsedFeature, sourceLabel: string) => {
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
                feature.title || sourceLabel,
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
