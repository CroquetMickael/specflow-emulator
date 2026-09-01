# specflow-emulator

A [SpecFlow](https://specflow.org/)-style way to write Gherkin tests on top of
[`jest-cucumber`](https://github.com/bencompton/jest-cucumber). Works with **Jest**
and **Vitest** (Node and, in alpha, the Vitest browser mode).

Instead of wiring every scenario by hand, you declare your steps once in
`*.stepdefinitions` files. `specflow-emulator` keeps them in a pool and binds them
to your `.feature` files automatically — including shared steps, scoped steps and
tag-based sharing across features.

📖 **Full documentation: <https://croquetmickael.github.io/specflow-emulator/>**

## Install

```shell
npm i -D specflow-emulator
# or: yarn add -D specflow-emulator / pnpm add -D specflow-emulator
```

## Quick start

```javascript
// setupTests.js  (referenced from your runner's setup-files option)
import { loadSteps } from "specflow-emulator";

await loadSteps({});
```

```gherkin
# src/__features__/calculator.feature
@feature
Feature: Simple Calculator

  Scenario: Simple addition
    Given number "2"
    And number "1"
    When I add them
    Then the result should be "3"
```

```javascript
// src/__features__/calculator.steps.js
import { defineFeature } from "specflow-emulator";

defineFeature("./calculator.feature");
```

```javascript
// src/__features__/calculator.stepdefinitions.js
import { defineSteps } from "specflow-emulator";

export const stepDefinitions = defineSteps(
  [{ feature: "Simple Calculator", tag: "feature" }],
  ({ Given, When, Then }) => {
    Given(/^number "(.*)"$/, (ctx) => (n) => {
      ctx.numbers = [...(ctx.numbers ?? []), n];
    });

    When("I add them", (ctx) => () => {
      ctx.result = ctx.numbers.reduce((a, b) => a + +b, 0);
    });

    Then(/^the result should be "(.*)"$/, (ctx) => (expected) => {
      expect(ctx.result).toBe(+expected);
    });
  }
);
```

`loadSteps` scans `./src/__features__/**/*.stepdefinitions.{js,jsx,ts,tsx}` by
default; pass `{ dossier: "..." }` to change the root.

## Vitest browser mode (alpha)

Vitest [browser mode](https://vitest.dev/guide/browser/) runs in a real browser
where `fs` / `glob` are unavailable, so it needs the dedicated
`specflow-emulator/browser` entry point (plus the `specflow-emulator/vite` plugin
for `.feature` imports):

```javascript
// setupTests.js
import { loadSteps } from "specflow-emulator/browser";

await loadSteps({
  modules: import.meta.glob("./src/**/*.stepdefinitions.js", { eager: true }),
});
```

Install with `npm i -D specflow-emulator@alpha` and see the
[Vitest browser mode guide](https://croquetmickael.github.io/specflow-emulator/docs/next/Features/vitest-browser-mode).

## Examples

Runnable setups in [`examples/`](./examples):

- [`ecmascript-vitest`](./examples/ecmascript-vitest) — Vitest, Node
- [`ecmascript-react-vitest`](./examples/ecmascript-react-vitest) — Vitest + React (jsdom)
- [`ecmascript-browser-vitest`](./examples/ecmascript-browser-vitest) — Vitest browser mode (alpha)

## License

MIT
