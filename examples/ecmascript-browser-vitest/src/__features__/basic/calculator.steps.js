import { defineFeature } from "specflow-emulator/browser";
// Bare `.feature` import: handled by the `specflowFeatures()` Vite plugin.
import feature from "./calculator.feature";

defineFeature(feature);
