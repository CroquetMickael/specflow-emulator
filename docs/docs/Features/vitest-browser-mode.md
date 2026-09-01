---
sidebar_position: 6
---

# Vitest browser mode

:::caution Alpha
This entry point is only in the alpha releases: `npm i -D specflow-emulator@alpha`.
:::

`specflow-emulator` ships a dedicated entry point, `specflow-emulator/browser`, for
[Vitest browser mode](https://vitest.dev/guide/browser/). Tests then run inside a
real browser, where `fs` / `glob` are not available, so two things change compared
to the Node setup:

- step definition files are discovered with Vite's `import.meta.glob` instead of `glob`;
- `.feature` files are passed to `defineFeature` as **text** instead of a path.

## Configuration

```javascript
// vitest.config.js
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { specflowFeatures } from "specflow-emulator/vite";

export default defineConfig({
  // Lets you `import feature from "./x.feature"` (see below).
  plugins: [specflowFeatures()],
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

`import.meta.glob` **must** be written in your own code with a literal pattern —
it cannot be moved inside the library.

Other test runners still work by passing a `runner`:

```javascript
import { loadSteps } from "specflow-emulator/browser";
import { describe, test } from "MyTestRunner";

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

## TypeScript

To type `.feature` imports, reference the shipped ambient declarations from any
`.d.ts` picked up by your project (e.g. `vite-env.d.ts`):

```ts
/// <reference types="specflow-emulator/feature" />
```

(`vite/client` already covers the `?raw` form.)

## Step definitions

`defineSteps` is unchanged — import it from `specflow-emulator/browser` (or still
from `specflow-emulator`, it is the same function):

```javascript
import { defineSteps } from "specflow-emulator/browser";

export const stepDefinitions = defineSteps(
  [{ feature: "Simple Calculator", tag: "feature" }],
  ({ Given, When, Then }) => {
    // ...
  }
);
```

A full example lives in
[`examples/ecmascript-browser-vitest`](https://github.com/CroquetMickael/specflow-emulator/tree/main/examples/ecmascript-browser-vitest).
