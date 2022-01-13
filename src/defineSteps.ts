import {
    DefineStepCallback,
    IScope,
    StepBlock,
    StepCallback,
    StepMatcher,
  } from './common.types';
import { StepDefinition } from './StepDefinition';

interface IDefineStepCallbacks {
    Given: DefineStepCallback;
    defineGiven: DefineStepCallback;
    When: DefineStepCallback;
    defineWhen: DefineStepCallback;
    Then: DefineStepCallback;
    defineThen: DefineStepCallback;
  }

declare type DefineStepsCallback = (
    defineStepCallbacks: IDefineStepCallbacks,
  ) => void;

export const defineSteps = (globalScopes: IScope[], defineStepsCallback: DefineStepsCallback) => {
    const stepDefinitions: StepDefinition[] = [];

    const defineStep = (scopes: IScope[], match: StepMatcher, block: StepBlock, callback: StepCallback) => {
      stepDefinitions.push(new StepDefinition(scopes.concat(globalScopes), match, block, callback));
    };

    const defineStepCallbacks: IDefineStepCallbacks = {
      Given: (match, callback, scopes = []) => defineStep(scopes, match, 'given', callback),
      defineGiven: (match, callback, scopes = []) => defineStep(scopes, match, 'given', callback),
      When: (match, callback, scopes = []) => defineStep(scopes, match, 'when', callback),
      defineWhen: (match, callback, scopes = []) => defineStep(scopes, match, 'when', callback),
      Then: (match, callback, scopes = []) => defineStep(scopes, match, 'then', callback),
      defineThen: (match, callback, scopes = []) => defineStep(scopes, match, 'then', callback),
    };

    defineStepsCallback(defineStepCallbacks);
    return stepDefinitions;
  };
