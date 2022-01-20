---
sidebar_position: 3
---

# Same step with different keyword

Sometimes, we got the same step but without the same keyword like this :

```
Feature: A simple feature file

    Scenario: First scenario
        Given given step
        And another given step
        When when step shared
        And another when/given step
        Then then step
```

You will certainly doing something like this :

```javascript
import { defineSteps } from "specflow-emulator"

export const stepDefinitions = defineSteps(
  [{ feature: "A simple feature file "}],
  ({ Given, Then, When }) => {

      Given("given step", (scenarioContext) => (data) => {
         // do something
      })

      Given("another given step", (scenarioContext) => (data) => {
         // do something
      })

      Given("another when/given step", () => () => {
        // do something for when / given
      }))

      When("When Step", () => () => {
        // do something
      });

      When("another when/given step", () => () => {
        // do something for when / given
      }))

      Then("Then step", (scenarioContext) => () => {
          // do something else
      })
  }
```

But in this scenario, you can just tweak a little your stepDefinitions in order to accept a list of step function like this :

```javascript
import { defineSteps } from "specflow-emulator"

export const stepDefinitions = defineSteps(
  [{ feature: "A simple feature file "}],
  ({ Given, Then, When }) => {

      Given("given step", (scenarioContext) => (data) => {
         // do something
      })

      Given("another given step", (scenarioContext) => (data) => {
         // do something
      })

      When("When Step", () => () => {
        // do something
      });

    [Given, When].forEach(stepMethod => stepMethod("another when/given step", () => () => {
        // do something for when / given
      }))


      Then("Then step", (scenarioContext) => () => {
          // do something else
      })
  }
```

And now when you will use the same step for `Given` or `When`, the library will just bind it properly, no need to recreate another functions.

:::tip Shared step
This tweak work also with shared steps.
:::
