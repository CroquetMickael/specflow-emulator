/**
 * Vite plugin that turns `.feature` files into modules exporting their raw
 * Gherkin text as the default export:
 *
 * ```js
 * import feature from "./calculator.feature";
 * // feature === "Feature: ...\n  Scenario: ..."
 * ```
 *
 * This lets `defineFeature` from `specflow-emulator/browser` receive the feature
 * text without the `?raw` suffix. Register it in your Vite / Vitest config:
 *
 * ```js
 * import { specflowFeatures } from "specflow-emulator/vite";
 *
 * export default defineConfig({
 *   plugins: [specflowFeatures()],
 * });
 * ```
 */
export interface SpecflowFeaturesPlugin {
  name: string;
  enforce: "pre";
  transform(
    code: string,
    id: string
  ): { code: string; map: null } | null;
}

// Queries handled natively by Vite (`?raw`, `?url`, `?inline`) must be left
// alone, otherwise this plugin would wrap their already-transformed output.
const PASS_THROUGH_QUERY = /[?&](raw|url|inline)(?:&|$)/;

export const specflowFeatures = (): SpecflowFeaturesPlugin => ({
  name: "specflow-emulator:features",
  enforce: "pre",
  transform(code, id) {
    const [path, query] = id.split("?");
    if (
      !path.endsWith(".feature") ||
      PASS_THROUGH_QUERY.test(`?${query || ""}`)
    ) {
      return null;
    }
    return {
      code: `export default ${JSON.stringify(code)};`,
      map: null,
    };
  },
});

export default specflowFeatures;
