// Vite plugin for vitest: a source file that calls a message goes through the build's i18n loader
// (tools/i18n-loader.cjs), so t('controls.light-view.light') becomes its table index in a test run exactly as it
// does in the shipped chunk. A call whose first argument is not a key fails the transform, as it fails the build.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const loader = require('../i18n-loader.cjs');
const lib = require('./lib.cjs');

export default function i18nKeys() {
  return {
    name: 'mc-i18n',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0];
      if (!/\.ts$/.test(file) || !code.includes('i18n') || !lib.isScanned(file)) return null;
      if (!lib.scanSource(file, code, lib.activeNamespaces()).calls.length) return null;
      const errors = [];
      const out = loader.call({ resourcePath: file, addDependency() {}, emitError: (e) => errors.push(e) }, code);
      if (errors.length) throw errors[0];
      return out === code ? null : { code: out, map: null };
    },
  };
}
