import {
  DefineStepFunction,
  StepsDefinitionCallbackOptions,
} from "jest-cucumber/dist/src/feature-definition-creation";

export interface IScope {
  feature?: string;
  scenario?: string;
  tag?: string;
}

export type ScopeFeatureType = {
  feature?: string;
  scenario?: string;
  tag?: never;
};

export type ScopeTagType = {
  feature?: never;
  scenario?: string;
  tag?: string;
};

export type StepMatcher = string | RegExp;

export type StepBlock = "given" | "when" | "then";

export type JestCallbackSelector = (
  jestStepCallbacks: StepsDefinitionCallbackOptions
) => DefineStepFunction;

export type StepCallback = (scenarioContext: any) => (...args: any[]) => any;

export type DefineStepCallback = (
  match: StepMatcher,
  callback: StepCallback,
  scopes?: ScopeFeatureType[] | ScopeTagType[]
) => void;
