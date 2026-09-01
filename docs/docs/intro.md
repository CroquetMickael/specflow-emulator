---
sidebar_position: 1
---

# Getting started

## Adding specflow-emulator on your project

```shell
// with npm
$ npm install -D specflow-emulator

// or with yarn
$ yarn add -D specflow-emulator

// or with pnpm
$ pnpm add -D specflow-emulator
```

## Configuration

:::info Under the hood
To make specflow-emulator work, we use `jest-cucumber` under the hood;
:::

### Vitest

Using vitest, you have to add some configuration on `vite.config.js`:

```javascript
export default defineConfig({
  test: {
    globals: true,
    include: [
      "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "**/*.steps.js",
    ],
    environment: "choose your environnement here" // see: https://vitest.dev/guide/environment.html,
    setupFiles: ["./setupTests.js"],
    watch: true,
    deps: {
      inline: ["specflow-emulator"],
    },
  },
});
```

Then setup your setup test file like this :

```javascript
import { loadSteps } from "specflow-emulator";

await loadSteps({});
```

`loadSteps` scans `./src/__features__` for `*.stepdefinitions.{js,jsx,ts,tsx}` files.
If your step definitions live somewhere else, pass `dir`:

```javascript
await loadSteps({ dir: "./tests/features" });
```

:::note
`dossier` still works as an alias for `dir` but is deprecated and will be removed in a future major.
:::

### Large projects — scan once, share with every worker

`loadSteps({})` runs the file-system scan (`glob`) again in every worker /
every test file. On a big `__features__` tree this adds up.

You can run the scan **once** in a `globalSetup` file and hand the resolved
list to each worker, so `loadSteps` skips the scan entirely:

```javascript title="vitest.global-setup.js"
import { resolveStepFiles } from "specflow-emulator";

// Runs once in the main process, before any worker is forked.
export const setup = ({ provide }) => {
  provide("stepFiles", resolveStepFiles("./src/__features__"));
};
```

```javascript title="vite.config.js"
export default defineConfig({
  test: {
    globalSetup: ["./vitest.global-setup.js"],
    setupFiles: ["./setupTests.js"],
    // ...
  },
});
```

```javascript title="setupTests.js"
import { inject } from "vitest";
import { loadSteps } from "specflow-emulator";

// `files` is already resolved: no glob happens here.
await loadSteps({ files: inject("stepFiles") });
```

:::caution
The list is frozen for the lifetime of the Vitest process. In watch mode,
adding or removing a `*.stepdefinitions` file is only picked up after a restart.
Stick to `loadSteps({})` if that matters more to you than the scan cost.
:::

This only saves the `glob` scan — each worker still imports every step
definition module, that part cannot be shared.

## Any other test runner

```javascript
import { loadSteps } from "specflow-emulator";
import { describe, test } from "MyTestRunner";

await loadSteps({
  runner: {
    describe,
    test,
  },
});
```


## Does this work with Vue/React

Yes, nothing is related with `Vue.js` or `React.js`, you can do some test with them.

Examples here : [React / Javascript Examples](https://github.com/CroquetMickael/specflow-emulator/tree/main/examples)
