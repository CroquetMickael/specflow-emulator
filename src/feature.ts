/**
 * Ambient declarations for importing `.feature` files as raw Gherkin text.
 *
 * Enable them in your app by adding a reference in any `.d.ts` picked up by
 * TypeScript (e.g. `vite-env.d.ts`):
 *
 * ```ts
 * /// <reference types="specflow-emulator/feature" />
 * ```
 */

declare module "*.feature" {
  const content: string;
  export default content;
}

declare module "*.feature?raw" {
  const content: string;
  export default content;
}
