import { IJestLike } from "jest-cucumber";
import callsites from "callsites";
import { glob } from "glob";
import path from "path";

import { loadFeature } from "jest-cucumber/dist/src/parsed-feature-loading";
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

  const feature = loadFeature(cheminAbsolu, buildConfig());
  bindFeature(feature, cheminAbsolu);
};

export const loadSteps = async ({
  runner = undefined,
  dossier = "./src/__features__",
}: {
  runner?: IJestLike;
  dossier?: string;
}) => {
  if (stepsLoaded()) {
    return;
  }

  resetStepPool();
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
    registerSteps(stepDefinitions, cheminFichier);
  }

  setRunner(runner);
  markStepsLoaded();
};
