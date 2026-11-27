// Vite plugin for vitest: a source file that calls a message goes through the build's i18n loader
// (tools/i18n-loader.cjs), so t('controls.light-view.light') becomes its table index in a test run exactly as it
// does in the shipped chunk. A call whose first argument is not a key fails the transform, as it fails the build.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const loader = require('../i18n-loader.cjs');
const lib = require('./lib.cjs');

const loaderFiles = [
  join(import.meta.dirname, '..', 'i18n-loader.cjs'),
  join(import.meta.dirname, 'lib.cjs'),
  join(import.meta.dirname, 'keys.cjs'),
  join(import.meta.dirname, 'config.json'),
];

// What a rewritten key depends on besides its own source file: the loader and the catalogues that map keys to indices.
export function catalogueDigest(read = readFileSync) {
  const hash = createHash('sha1');
  const files = [...loaderFiles];
  for (const { dir } of lib.activeNamespaces()) {
    for (const name of ['en-GB.json', 'en-US.json', 'nl.json']) files.push(join(dir, name));
  }
  for (const file of files) hash.update(file).update(existsSync(file) ? read(file) : '-');
  return hash.digest('hex');
}

export default function i18nKeys() {
  return {
    name: 'mc-i18n',
    enforce: 'pre',
    configureVitest({ defineCacheKeyGenerator }) {
      const digest = catalogueDigest();
      defineCacheKeyGenerator(({ id, sourceCode }) => {
        const file = id.split('?')[0];
        return /\.ts$/.test(file) && sourceCode.includes('i18n') && lib.isScanned(file) ? digest : '';
      });
    },
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
