---
sidebar_position: 3
---

# Same step with different keyword

Sometimes, we have the same step but without the same keyword like this :

```
Feature: A simple feature file

    Scenario: First scenario
        Given given step
        And given step
        When when step shared
        And given step
        Then then step
```

You will certainly doing something like this :

```javascript
import { defineSteps } from "specflow-emulator";

export const stepDefinitions = defineSteps(
  [{ feature: "A simple feature file " }],
  ({ Given, Then, When }) => {
    Given("given step", scenarioContext => (data) => {
      // do something
    });

    When("when step shared", () => () => {
      // do something
    });

    When("given step", () => () => {
      // do something for when / given
    });

    Then("then step", scenarioContext => () => {
      // do something else
    });
  }
);
```

But in this scenario, you can just tweak a little your stepDefinitions in order to accept a list of step function like this :

```javascript
import { defineSteps } from "specflow-emulator";

export const stepDefinitions = defineSteps(
  [{ feature: "A simple feature file " }],
  ({ Given, Then, When }) => {
    [Given, When].forEach(stepMethod =>
      stepMethod("given step", () => () => {
        // do something for when / given
      })
    );

    When("when Step", () => () => {
      // do something
    });

    Then("Then step", scenarioContext => () => {
      // do something else
    });
  }
);
```

And now when you will use the same step for `Given` or `When`. The library will automatically bind it properly itself : you don't need to recreate functions for each keywords your steps are used with.

:::tip Shared step
This tweak work also with shared steps.
:::
