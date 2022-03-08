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

### Vitest

Using vitest, you have to had some configuration on `vite.config.js`:

```javascript
export default defineConfig({
  test: {
    global: true,
    include: [
      "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "**/*.steps.js",
    ],
    environment: "choose your environnement here",
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

### Jest

Using jest, you have to had some configuration on your `package.json` or your `jest.config.js`:

```json
"jest": {
"transformIgnorePatterns": [
      "node_modules/(?!specflow-emulator)/)"
    ],
    "testMatch": [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test|steps).[jt]s?(x)"
    ],
}
```

Then setup your setup test file like this :

```javascript
import { loadStepsJest } from "specflow-emulator";

loadStepsJest();
```

## Does this work with Vue/React

Yes, nothing is related with `Vue.js` or `React.js`, you can do some test with them.

Examples here : [React / Javascript Examples](https://github.com/CroquetMickael/specflow-emulator/tree/main/examples)

## Other test framework

Currently, we are using `jest-cucumber` behind the door, that's mean we can't provide more test framework like `mocha` or anything else.
