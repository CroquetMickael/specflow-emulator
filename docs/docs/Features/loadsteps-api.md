---
sidebar_position: 6
---

# loadSteps API

`loadSteps` fills the step pool that `defineFeature` reads from. It is meant to
be called once, from your test runner setup file.

```javascript
import { loadSteps } from "specflow-emulator";

await loadSteps();
```

## Options

```typescript
loadSteps(options?: {
  runner?: IJestLike;   // custom { describe, test } for non-Vitest runners
  dir?: string;         // folder to scan, default "./src/__features__"
  files?: string[];     // pre-resolved list of step definition paths
  dossier?: string;     // @deprecated alias for `dir`
}): Promise<void>
```

- **`dir`** — where to look for `*.stepdefinitions.{js,jsx,ts,tsx}` files.
- **`files`** — skip the scan and use this list as-is (see `resolveStepFiles` below).
- **`dossier`** — old name for `dir`, kept for backward compatibility, deprecated.

Calling `loadSteps` again returns the same in-flight / resolved promise: it never
loads the pool twice. Use `resetSteps()` if you actually need to reload.

## `resolveStepFiles(dir?)`

Runs only the `glob` scan and returns the absolute paths, without importing
anything. Use it in a `globalSetup` so the scan happens once and every worker
reuses the result:

```javascript title="vitest.global-setup.js"
import { resolveStepFiles } from "specflow-emulator";

export const setup = ({ provide }) => {
  provide("stepFiles", resolveStepFiles());
};
```

```javascript title="setupTests.js"
import { inject } from "vitest";
import { loadSteps } from "specflow-emulator";

await loadSteps({ files: inject("stepFiles") });
```

For Jest, pass the list through an env variable instead:

```javascript title="jest.global-setup.js"
const { resolveStepFiles } = require("specflow-emulator");

module.exports = async () => {
  process.env.STEP_FILES = JSON.stringify(resolveStepFiles());
};
```

```javascript title="setupTests.js"
const { loadSteps } = require("specflow-emulator");

const files = process.env.STEP_FILES
  ? JSON.parse(process.env.STEP_FILES)
  : undefined;

await loadSteps({ files });
```

:::caution
A list captured in `globalSetup` is frozen for the whole run. In watch mode a
newly added `*.stepdefinitions` file is only seen after a restart. Plain
`loadSteps()` re-scans on every run.
:::

Only the scan is shared. Each worker still imports every step definition module
in its own context.

## `resetSteps()`

Empties the pool and releases the load lock so the next `loadSteps` call runs
again. Handy when several suites share a process and need isolation:

```javascript
import { resetSteps, loadSteps } from "specflow-emulator";

afterEach(() => {
  resetSteps();
});
```
