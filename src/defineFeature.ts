import { IJestLike, Options, defineFeature as getFeature } from "jest-cucumber";
import callsites from "callsites";
import { glob } from "glob";
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

const stepNotExportedString = (filePath: string) =>
  `Le fichier ${filePath} n'exporte pas de variable stepDefinitions`;

const stepPool: StepDefinition[] = [];
let isLoaded = false;
let internalRunner: IJestLike = undefined;

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

export const loadSteps = async ({
  runner = undefined,
  dossier = "./src/__features__",
}: {
  runner?: IJestLike;
  dossier?: string;
}) => {
  if (isLoaded) {
    return;
  }

  stepPool.length = 0;
  const patternFichier = `${dossier}/**/*.stepdefinitions.{js,jsx,ts,tsx}`;
  const fichiers = glob.sync(patternFichier);

  for (let i = 0; i < fichiers.length; i++) {
    const cheminFichier = fichiers[i];
    const { stepDefinitions } = (await import(path.resolve(cheminFichier))) as {
      stepDefinitions: StepDefinition[];
    };

    if (!stepDefinitions) {
      console.error(stepNotExportedString(cheminFichier));
      return;
    }
    stepDefinitions.forEach((stepDefinition) => {
      stepDefinition.cheminFichier = cheminFichier;
      stepPool.push(stepDefinition);
    });
  }
  if (runner && Object.keys(runner).length > 0) {
    internalRunner = runner;
  }

  isLoaded = true;
};
