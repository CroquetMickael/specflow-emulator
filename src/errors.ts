import {
    ParsedFeature,
    ParsedScenario,
    ParsedScenarioOutline,
    ParsedStep,
  } from 'jest-cucumber/dist/src/models';
import { bold, green, red, yellow } from 'kleur';
import { StepDefinition } from './StepDefinition';

const endOfLine = '\r\n';
const lineSeparator = endOfLine + ''.padEnd(50, '-') + endOfLine;

export const formatStepMatchingError = (
    fichierFeature: string,
    feature: ParsedFeature,
    scenario: ParsedScenario | ParsedScenarioOutline,
    step: ParsedStep,
    matchingStepDefinition: StepDefinition[],
  ) => {
    let error = `Impossible to bind a step in file : ${endOfLine}${red(
      fichierFeature,
    )}${lineSeparator}`;
    error += `${bold(yellow('feature'))} : ${feature.title}${endOfLine}`;
    error += `${bold(yellow('scenario'))}: ${scenario.title} (ligne ${
      scenario.lineNumber
    })${endOfLine}`;
    error += `${bold(yellow('step'))}    : ${step.stepText} (ligne ${
      step.lineNumber
    })${lineSeparator}`;

    if (!matchingStepDefinition.length) {
      error += `${endOfLine}${bold(
        red('No step definition have been found.'),
      )}${lineSeparator}${endOfLine}`;
      return error;
    }

    error += `${endOfLine}${bold(
      green(
        `${matchingStepDefinition.length} définitions of same step found:`,
      ),
    )}`;
    matchingStepDefinition.forEach(({ block, match, scopes, cheminFichier }) => {
      error += lineSeparator;
      error += `${bold(yellow('fichier'))}: ${cheminFichier}${endOfLine}`;
      error += `${bold(yellow('block'))}  : ${block}${endOfLine}`;
      error += `${bold(yellow('matcher'))}: ${match}${endOfLine}`;
      error += `${bold(yellow('scopes'))} : ${JSON.stringify(scopes)}`;
    });

    return error;
  };
