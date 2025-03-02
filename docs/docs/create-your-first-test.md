---
sidebar_position: 2
---

# Create your first test

## Setup your test file

If you didn't change the base folder in your setup test file, do as follow :

```javascript
import { loadSteps } from "specflow-emulator";

await loadSteps({});
```


That's means, you will have to create a folder `__features__` inside `src`. Then you can create subfolders for your tests in it or directly create test files.

`specflow-emulator` provide a new way to use `cucumber` and `jest-cucumber`. First you will have to create a test file name like: `nameOfYourFile.steps.js`.

```javascript
// nameOfYourFile.steps.js
import { defineFeature } from "specflow-emulator";

// Here you can change the path to your .feature file
defineFeature("./nameOfYourFile.feature");
```

## Creating the feature file

Then create your scenario inside your `.feature`, like this basic scenario:

```shell
Feature: Simple Calculator

    Scenario: Simple addition
        Given Number "2"
        And Number "1"
        When I add them
        Then The result should be "3"

    Scenario: Simple multiplication
        Given Number "5"
        And Number "2"
        When I multiple them
        Then The result should be "10"
```

## Creating the step definitions file

Create a file named `YourFileName.stepdefinitions.js` that will contains your steps. You will have to import `defineSteps` from `specflow-emulator`:

```javascript
import { defineSteps } from "specflow-emulator";

export const stepDefinitions = defineSteps();
```

:::danger Exporting
Don't forget to export this `const` named `stepDefinitions` in order to provide the steps to `specflow-emulator`. If you don't do that it will never be possible to provide your steps to the pool.
:::

### Usage

You will need to provide two arguments to the `defineSteps` function.
The first one is an array of objects. You must provide inside it the feature key wich is the real name of your scenario.
The second argument is a callback that gives you Given | When | Then functions. Use them to bind those function with the feature file.

With our example, the feature implementation would start to look like this:

```javascript
export const stepDefinitions = defineSteps(
  [{ feature: "Simple Calculator" }, { tag: "feature" }],
  ({ Given, When, Then }) => {

  }
```

`Given`, `When`, `Then` functions take two callbacks. The first one is generated by `specflow-emulator` that gave you a `scenarioContext` in order to share between step datas. The second one is your variables coming from the scenario itself. If you got 2 variables, you will need to provide two argument to the function.

In our example case, it would be like this:

```javascript
import { defineSteps } from "specflow-emulator";

export const stepDefinitions = defineSteps(
  [{ feature: "Simple Calculator" }, { tag: "feature" }],
  ({ Given, When, Then }) => {
    Given(/^Number "(.*)"$/, (scenarioContext) => (number) => {
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

    Then(/^The result should be "(.*)"$/, (scenarioContext) => (number) => {
      expect(scenarioContext.result).toBe(+number);
    });
  }
);
```
