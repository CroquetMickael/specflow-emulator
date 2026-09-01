import { defineFeature } from "specflow-emulator/browser";
// `?raw` import: handled natively by Vite, no plugin needed.
import feature from "./basic-scenarios.feature?raw";

defineFeature(feature);
