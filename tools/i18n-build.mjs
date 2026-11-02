// npm run i18n: en-US.json (tools/i18n-us.mjs) then messages.gen.ts of every active namespace
// (src/<folder>/i18n, git-ignored, three '|' joined tables en-GB / en-US / nl). A namespace with an en-GB.json
// also gets keys.gen.ts (git-ignored): the types of its keys and their arguments. A namespace with a legal key
// gets the two generated `<ns>.legal.*` label keys in both files.
// Also the prebuild step and the vitest global setup. `npm run i18n -- --check` runs the drift check.
import { createRequire } from 'node:module';
import { run as writeUS } from './i18n-us.mjs';
const require = createRequire(import.meta.url);
const lib = require('./i18n/lib.cjs');
const keys = require('./i18n/keys.cjs');

/** Generate everything; throws on a D1 violation (a non-literal id). */
export function buildAll({ quiet = false } = {}) {
  keys.readLegalLabels(); // throws on an unreadable or malformed legal labels file
  writeUS();
  const { res, violations } = lib.buildAll();
  if (violations.length) {
    throw new Error('i18n: ' + violations.map((v) => `${v.file}:${v.line} ${v.fn}() ${v.reason}`).join('\n'));
  }
  if (!quiet) for (const r of res) console.log(`i18n ${r.ns}: ${r.count} messages${r.changed ? ' (messages.gen.ts written)' : ''}`);
  return res;
}

if (process.argv[1]?.endsWith('i18n-build.mjs')) {
  if (process.argv.includes('--check')) {
    const { main } = await import('./i18n-check.mjs');
    process.exit(await main(process.argv.slice(2)));
  }
  try {
    buildAll();
  } catch (e) {
    console.error(String(e.message ?? e));
    process.exit(1);
  }
}
