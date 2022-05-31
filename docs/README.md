# specflow-emulator

**specflow-emulator** makes your cucumber gherkin tests more readable, maintanable and flexible by giving you a set of functionalities to improve the way of how you write your gherkin steps. You can compare it with the specflow ability to share steps between scenarios or feature and to make your tests DRY.

 💡 **Find all the documentation [on the Docusaurus](https://croquetmickael.github.io/specflow-emulator/docs/intro) !**

## Installation

```shell
// npm
$ npm install -D specflow-emulator

// yarn
$ yarn add -D specflow-emulator

// pnpm
$ pnpm add -D specflow-emulator
```

## Examples

### Gherkin scenario

```gherkin
Feature: Calculator

    Scenario: Adding two numbers
        Given A number "1"
        And A number "2"
        And A number "3"
        When I add all the numbers
        Then I get "6"
```

### Implementation without specflow-emulator

```javascript
  import { loadFeature, defineFeature } from "jest-cucumber";
  
  const feature = loadFeature(`pathToTheFeatureFile`);
  
  defineFeature(feature, test => {
  
    const aNumberStep = (step, numbers) => step(/^A number "(*)"/, number => {
      numbers.push(+number);
    });
  
    test("Adding two numbers", ({ given, when, then, and }) => {
      // these are shared variables in the test suite
      const numbers = [];
      let result = 0;
 
      // these are a code duplication
      aNumberStep(given, numbers);
      aNumberStep(and, numbers);
      aNumberStep(and, numbers);
      
      when(/^I add all the numbers$/, {
        result = numbers.reduce((acc, curr) => acc + curr, 0);
      });
      
      then(/^I get "(.*)"$/, expectedResult => {
        expect(result).toEqual(expectedResult);
      });
    });
  });
```

### Implementation with specflow-emulator

```javascript
import { defineSteps } from "specflow-emulator";

export const stepDefinitions = defineSteps(
  [{ feature: "Calculator" }],
  ({ Given, Then, When }) => {
    Given(
      /^A number "(.*)"$/,
      // scenarioContext allows you to easily share data between steps
      scenarioContext => number => {
        scenarioContext.numbers = [...scenarioContext?.numbers, +number];
      }
    );

    When("I add all the numbers", scenarioContext => () => {
      scenarioContext.result = scenarioContext.numbers.reduce((acc, curr) => acc + curr, 0);
    });

    Then(/^I get "(.*"$/, scenarioContext => expectedResult => {
      expect(scenarioContext.result).toEqual(expectedResult);
    });
  }
);
```
