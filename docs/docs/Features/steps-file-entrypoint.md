---
sidebar_position: 5
---

# Multiple feature for one entry point

You can declare multiple `defineFeature` in the same `steps.js`, that permit you to split your feature in multiple files.

:::caution Performance
This could lead to a low performance for this type of `steps.js` file.
:::

## How to do it

```javascript
import { defineFeature } from "__features__/specflowEmulator";

defineFeature("./feature1.feature");
defineFeature("./feature2.feature");
defineFeature("./feature3.feature");
```

When launching this `steps.js` file in your test runner, it will automaticly run all scenario from all the feature file declared.
