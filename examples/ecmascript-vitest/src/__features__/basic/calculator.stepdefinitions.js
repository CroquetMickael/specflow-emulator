import { defineSteps } from "specflow-emulator";

export const stepDefinitions = defineSteps(
  [{ feature: "Simple Calculator", tag: "feature" }],
  ({ Given, Then, When }) => {
    Given(/^number "(.*)"$/, (scenarioContext) => (number) => {
      if (scenarioContext.number) {
        scenarioContext.number.push(number);
      } else {
        scenarioContext.number = [number];
      }
    });

    When("I add them", (scenarioContext) => (number) => {
      scenarioContext.result =
        +scenarioContext.number[0] + +scenarioContext.number[1];
    });

    When("I multiple them", (scenarioContext) => (number) => {
      scenarioContext.result =
        +scenarioContext.number[0] * +scenarioContext.number[1];
    });

    Then(
      /^the result should be "(.*)"$/,
      (scenarioContext) => (number) => {
        expect(scenarioContext.result).toBe(+number);
      }
    );
  }
);