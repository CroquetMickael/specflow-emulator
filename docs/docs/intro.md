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

:::info  Under the hood
To make specflow-emulator work, we use `jest-cucumber` under the hood, we only provide support for `Vitest`
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

await loadSteps();
```

## Does this work with Vue/React

Yes, nothing is related with `Vue.js` or `React.js`, you can do some test with them.

Examples here : [React / Javascript Examples](https://github.com/CroquetMickael/specflow-emulator/tree/main/examples)
