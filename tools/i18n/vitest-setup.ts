// vitest setupFile: the table-chunk namespaces ('labels', 'icon-library') are loaded before a test file runs, as
// the editor chunk, the studio and the icon loaders do before they render (contract i18n r3, Rule 3).
import { ready as labelsReady } from '../../src/i18n/labels';
import { ready as iconNamesReady } from '../../src/icon-anim/library/i18n';

await Promise.all([labelsReady(), iconNamesReady()]);
