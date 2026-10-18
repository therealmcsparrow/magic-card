// release.yml entry for the i18n drift check (implementation: tools/i18n-check.mjs).
import { main } from './i18n-check.mjs';

process.exit(await main());
