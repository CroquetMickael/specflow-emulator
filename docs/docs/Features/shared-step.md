---
sidebar_position: 4
---

# Shared step

## Shared step in the same feature file

Let's imagine this feature file :

```
Feature: A simple feature file

    Scenario: First scenario
        Given given step
        When when step shared
        Then then step

    Scenario: Second scenario
        Given given step 2
        When when step shared
        Then then step 2
```

`specflow-emulator` provide a new way to create shared step in the same feature file, using `jest-cucumber` would require to create multiple function like this :

```javascript
  const aSharedStep = (when) => {
      when("when step shared", () => {
        // do something
      })
    }

 test("A scenario", ({
    given,
    when,
    then,
  }) => {
  given("given step",
      () => {
        // this do something
      },
    );

    aSharedStep(when);

    then("then step",
      () => {
        // do something else
      },
    );
  }

  test("A scenario 2", ({
    given,
    when,
    then,
  }) => {

  given("given step 2",
      () => {
        // this do something
      },
    );

    aSharedStep(when);

    then("then step 2",
      () => {
        // do something else
      },
    );
  }
```

Sometimes, you will have a lot more scenario case, using this method, it's painfull for the readibility, finding the function, where it have been declared etc...

With `specflow-emulator`, you will just have to declare one time your steps, like this :

```javascript
import { defineSteps } from "specflow-emulator"

export const stepDefinitions = defineSteps(
  [{ feature: "A simple feature file "}],
  ({ Given, Then, When }) => {

      Given("given step", (scenarioContext) => (data) => {
         // do something
      })

      When("When Step", () => () => {
        // do something
      })

      Then("Then step", (scenarioContext) => () => {
          // do something else
      })
  }
```

You don't need to do anything else, the pool will automaticly bind your step.


## Shared step between feature file

`specflow-emulator` permit to share steps between multiple feature file, based on a tag system, let's imagine two feature file:

```
Feature: A simple feature file

    Scenario: First scenario
        Given given step
        When when step shared
        Then then step

    Scenario: Second scenario
        Given given step 2
        When when step shared
        Then then step 2

```

```
Feature: A simple feature file 2

    Scenario: First scenario
        Given given step
        When when step shared
        Then then step

    Scenario: Second scenario
        Given given step 2
        When when step shared
        Then then step 2
```

Here we got the same `When` step shared between those two feature, in `jest-cucumber` you will need to create a file and the export the function of the step in order to reuse it.
In `specflow-emulator`, you can create a `shared.common.stepdefinitions.js` and then just declare it like this :

```javascript
import { defineSteps } from "__features__/specflowEmulator";

export const stepDefinitions = defineSteps([{ tag: "tagName" }], ({ When }) => {
  When("when step shared", (scenarioContext) => () => {
    // do something
  });
});
```

:::danger Same tag name
Don't create the same tag in multiple stepdefinitions file, the library won't know which step to use
:::

And then just use it like this in your feature files:

```
@tagName
Feature: A simple feature file

    Scenario: First scenario
        Given given step
        When when step shared
        Then then step

    Scenario: Second scenario
        Given given step 2
        When when step shared
        Then then step 2

```

```
@tagName
Feature: A simple feature file 2

    Scenario: First scenario
        Given given step
        When when step shared
        Then then step

    Scenario: Second scenario
        Given given step 2
        When when step shared
        Then then step 2
```

That's all, you've just shared step between your feature files 😀 !

:::tip Multiple tags
You can add multiple tag for the same file !
:::

:::tip Share step from any stepdefinitions file
You can also share step from any stepdefinitions, just add a tag like above
:::
