---
sidebar_position: 1
---

# Scenario Context

`specflow-emulator` give you access to a scenario context, a new way to share data between steps. By default in `cucumber` or `jest-cucumber` you would create a variable at the start of the test file in order to provide it anywhere else in the test file.

```javascript
const { defineFeature, loadFeature } = require('jest-cucumber');

const sharedData;
const feature = loadFeature('./myScenario.feature', {
  loadRelativePath: true,
});

test("My scenario", ({
    given,
    when,
    then,
  }) => {

    given("do something", (data) => {
           sharedData = data
    });

    then("Use shared data", () => {
      expect(sharedData).toBe(data)
    });
  }
```

With `specflow-emulator`, you just have to use in your step the `scenarioContext` object. It will automaticly share data between your steps. Let's take the previous example and convert it to use `specflow-emulator` and `scenarioContext`.

```javascript
import { defineSteps } from "specflow-emulator"

export const stepDefinitions = defineSteps(
  [{ feature: "My feature"}],
  ({ Given, Then, When }) => {

      Given("do something", (scenarioContext) => (data) => {
          // Here you can create variable inside the scenario context
          // It's an object, do what you want with it
          scenarioContext.sharedData = data
      })

      Then("Use shared data", (scenarioContext) => () => {
        // You will be able to access the object values in the other steps
          expect(scenarioContext.sharedData).toBe(data)
      })
  }
```

#### Information
:::caution  Exporting
Scenario context is bound to the current scenario, you can't share data between scenarios.
:::

:::danger Spreading
Never spread the scenario context inside the first callback, it could permit some bug.
:::