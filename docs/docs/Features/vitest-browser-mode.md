---
sidebar_position: 6
sidebar_label: Vitest browser mode
---

# Vitest browser mode

:::caution Alpha
This entry point ships only in the alpha releases: `npm i -D specflow-emulator@alpha`.
:::

`specflow-emulator` ships a dedicated entry point, `specflow-emulator/browser`, for
[Vitest browser mode](https://vitest.dev/guide/browser/). Tests then run inside a
real browser, where `fs` / `glob` are not available, so two things change compared
to the Node setup:

- step definition files are discovered with Vite's `import.meta.glob` instead of `glob`;
- `.feature` files are passed to `defineFeature` as **text** instead of a path.

Nothing else changes: `defineSteps`, the scenario context, scopes, tags and shared
steps all behave exactly like in the Node setup.

## Install

```shell
npm i -D specflow-emulator@alpha @vitest/browser @vitest/browser-playwright playwright
npx playwright install chromium
```

Swap `@vitest/browser-playwright` / `playwright` for `@vitest/browser-webdriverio` /
`webdriverio` if you prefer the WebdriverIO provider (see
[below](#webdriverio-provider)).

## Configuration

```javascript
// vitest.config.js
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { specflowFeatures } from "specflow-emulator/vite";

export default defineConfig({
  // Lets you `import feature from "./x.feature"` (see "Feature files" below).
  plugins: [specflowFeatures()],

  // Pre-bundle the parser deps so Vitest does not reload the page mid-run.
  optimizeDeps: {
    include: [
      "@cucumber/gherkin",
      "jest-cucumber/dist/src/configuration",
      "jest-cucumber/dist/src/feature-definition-creation",
    ],
  },

  test: {
    globals: true,
    include: [
      "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "**/*.steps.js",
    ],
    setupFiles: ["./setupTests.js"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
```

`globals: true` is not mandatory, but without it `expect` (and `describe` / `test`)
are not on the global scope — you then have to `import { expect } from "vitest"` in
your step definitions, or pass a `runner` to `loadSteps` (see below).

### `optimizeDeps.include`

The browser entry pulls in `@cucumber/gherkin` and two `jest-cucumber` sub-modules
to parse `.feature` text. If they are not listed in `optimizeDeps.include`, Vite
discovers them on first import and re-optimizes, which makes Vitest print:

```
[vite] optimized dependencies changed. reloading
[vitest] Vite unexpectedly reloaded a test.
```

Tests still pass, but the reload is noisy and occasionally flaky. Listing the three
modules removes it.

## Setup file

`import.meta.glob` is resolved by Vite at build time and replaces `glob` +
filesystem access. Pass its result to `loadSteps`:

```javascript
// setupTests.js
import { loadSteps } from "specflow-emulator/browser";

await loadSteps({
  modules: import.meta.glob("./src/**/*.stepdefinitions.js", { eager: true }),
});
```

Notes:

- `import.meta.glob` **must** be written in your own code with a literal pattern —
  Vite reads it statically and it cannot be moved inside the library.
- The pattern is resolved **relative to the setup file**, not to the project root.
- `{ eager: true }` returns the modules directly. Without it you get lazy loaders;
  `loadSteps` handles both.
- Match your step definition extension: `*.stepdefinitions.{js,ts}` for a
  TypeScript project.

### Other test runners

`loadSteps` auto-detects Vitest. For anything else, pass the runner explicitly:

```javascript
import { loadSteps } from "specflow-emulator/browser";
import { describe, test } from "my-test-runner";

await loadSteps({
  runner: { describe, test },
  modules: import.meta.glob("./src/**/*.stepdefinitions.js", { eager: true }),
});
```

## Feature files

### With the Vite plugin

With `specflowFeatures()` registered, import the `.feature` file directly — the
default export is its raw Gherkin text:

```javascript
// calculator.steps.js
import { defineFeature } from "specflow-emulator/browser";
import feature from "./calculator.feature";

defineFeature(feature);
```

### Without the plugin

Vite handles the `?raw` suffix natively, so the plugin is optional:

```javascript
import { defineFeature } from "specflow-emulator/browser";
import feature from "./calculator.feature?raw";

defineFeature(feature);
```

Either way, `defineFeature` receives a **string**. There is no path-based form in
the browser — `defineFeature("./calculator.feature")` cannot work without `fs`.

## Step definitions

`defineSteps` is unchanged — import it from `specflow-emulator/browser` (it is the
same function re-exported, so `specflow-emulator` also works):

```javascript
import { defineSteps } from "specflow-emulator/browser";

export const stepDefinitions = defineSteps(
  [{ feature: "Simple Calculator", tag: "feature" }],
  ({ Given, When, Then }) => {
    Given(/^number "(.*)"$/, (scenarioContext) => (number) => {
      scenarioContext.numbers = [...(scenarioContext.numbers ?? []), number];
    });

    // No capture group -> the inner callback takes NO argument.
    When("I add them", (scenarioContext) => () => {
      scenarioContext.result = scenarioContext.numbers.reduce((a, b) => a + +b, 0);
    });

    Then(/^the result should be "(.*)"$/, (scenarioContext) => (expected) => {
      expect(scenarioContext.result).toBe(+expected);
    });
  }
);
```

## TypeScript

Step definitions and `.steps` files can be `.ts` — adjust the glob and the
`include` pattern accordingly.

To type `.feature` imports, pull in the shipped ambient declarations, either with a
triple-slash reference in a `.d.ts` that your project already picks up (e.g.
`vite-env.d.ts`):

```ts
/// <reference types="specflow-emulator/feature" />
```

…or via `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vite/client", "specflow-emulator/feature"]
  }
}
```

`vite/client` alone already covers the `?raw` form (`import x from "./y.feature?raw"`).

## WebdriverIO provider

The provider is the only thing that changes:

```javascript
// vitest.config.js
import { webdriverio } from "@vitest/browser-webdriverio";

export default defineConfig({
  // ...same plugins / optimizeDeps / test.include ...
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: webdriverio(),
      instances: [{ browser: "chrome" }],
    },
  },
});
```

See the [Vitest browser config](https://vitest.dev/guide/browser/) for the exact
provider options of your Vitest version.

## Troubleshooting

**`Cannot read properties of undefined (reading 'native')`** (from `path-scurry` /
`glob` while loading a module) — you imported `defineFeature` / `loadSteps` from
`specflow-emulator` instead of `specflow-emulator/browser`. The Node entry pulls in
`glob`, which cannot be evaluated in the browser.

**`Module "fs" has been externalized for browser compatibility`** — a harmless
warning. A transitive dependency references `fs` at module scope; the browser code
path never calls it. Tests are unaffected.

**A step times out after 5 s without any assertion running** — jest-cucumber treats
the step callback as taking a `done` callback whenever it declares more parameters
than the step provides. If the step text has no capture group, the inner callback
must take **no** argument:

```javascript
// ❌ hangs: `value` is read as a done() callback
When("I submit", (ctx) => (value) => { /* ... */ });
// ✅
When("I submit", (ctx) => () => { /* ... */ });
```

**`Error parsing feature Gherkin` on a `?raw` import** — make sure the file really
ends in `.feature`. The `specflowFeatures()` plugin deliberately ignores
`?raw` / `?url` / `?inline` so Vite can handle them; if both the plugin and `?raw`
fire you would double-wrap the text.

**No scenarios run / "No step definition has been found"** — the `import.meta.glob`
pattern did not match. It is relative to the setup file; check the path and the
extension list.

## Full example

A runnable project (Playwright + Chromium, both the plugin and the `?raw` form)
lives in
[`examples/ecmascript-browser-vitest`](https://github.com/CroquetMickael/specflow-emulator/tree/main/examples/ecmascript-browser-vitest).
