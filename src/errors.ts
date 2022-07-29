import {
    ParsedFeature,
    ParsedScenario,
    ParsedScenarioOutline,
    ParsedStep,
  } from 'jest-cucumber/dist/src/models';
import kleur from 'kleur';
import { StepDefinition } from './stepDefinition';

const endOfLine = '\r\n';
const lineSeparator = endOfLine + ''.padEnd(50, '-') + endOfLine;

export const formatStepMatchingError = (
    fichierFeature: string,
    feature: ParsedFeature,
    scenario: ParsedScenario | ParsedScenarioOutline,
    step: ParsedStep,
    matchingStepDefinition: StepDefinition[],
  ) => {
    let error = `Impossible to bind a step in file : ${endOfLine}${kleur.red(
      fichierFeature,
    )}${lineSeparator}`;
    error += `${kleur.bold(kleur.yellow('feature'))} : ${feature.title}${endOfLine}`;
    error += `${kleur.bold(kleur.yellow('scenario'))}: ${scenario.title} (ligne ${
      scenario.lineNumber
    })${endOfLine}`;
    error += `${kleur.bold(kleur.yellow('step'))}    : ${step.stepText} (ligne ${
      step.lineNumber
    })${lineSeparator}`;

    if (!matchingStepDefinition.length) {
      error += `${endOfLine}${kleur.bold(
        kleur.red('No step definition have been found.'),
      )}${lineSeparator}${endOfLine}`;
      return error;
    }

    error += `${endOfLine}${kleur.bold(
      kleur.green(
        `${matchingStepDefinition.length} définitions of same step found:`,
      ),
    )}`;
    matchingStepDefinition.forEach(({ block, match, scopes, cheminFichier }) => {
      error += lineSeparator;
      error += `${kleur.bold(kleur.yellow('fichier'))}: ${cheminFichier}${endOfLine}`;
      error += `${kleur.bold(kleur.yellow('block'))}  : ${block}${endOfLine}`;
      error += `${kleur.bold(kleur.yellow('matcher'))}: ${match}${endOfLine}`;
      error += `${kleur.bold(kleur.yellow('scopes'))} : ${JSON.stringify(scopes)}`;
    });

    return error;
  };
