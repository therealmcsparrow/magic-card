// vitest globalSetup: the messages.gen.ts files the i18n modules import exist before a test file runs.
import { buildAll } from '../i18n-build.mjs';

export default function setup() {
  buildAll({ quiet: true });
}
