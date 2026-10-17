// Fails when a built dist/*.js grows past its cap, or when an unlisted .js file appears.
// Caps = byte sizes of the 2026.10.07 production build (the three git-tracked files match HEAD). Raise a cap only on purpose, in the same PR.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CAPS = {
  'magic-card.js': 683958,
  'magic-card-animation-studio.js': 858558,
  'magic-card-editor.js': 647655,
  'magic-card-icon-animator.js': 222240,
  'magic-card-icon-library.js': 171507,
  'magic-card-particles.js': 33080,
  'magic-card-preset-catalogue.js': 22797,
  'magic-card-theme-editor.js': 163837,
  'magic-card-theme-presets.js': 19878,
  'magic-card-anim-runtime.js': 38672,
};

const dir = fileURLToPath(new URL('../dist/', import.meta.url));
const files = readdirSync(dir).filter((f) => f.endsWith('.js'));
let failed = false;

for (const f of files) {
  const size = statSync(join(dir, f)).size;
  const cap = CAPS[f];
  if (cap === undefined) {
    console.error(`FAIL ${f}: ${size} B, new file with no size cap. Add an entry for it to CAPS in tools/check-dist-size.mjs (its byte size from a production build) in the same PR`);
    failed = true;
  } else if (size > cap) {
    console.error(`FAIL ${f}: ${size} B > cap ${cap} B (+${size - cap} B)`);
    failed = true;
  } else {
    console.log(`ok   ${f}: ${size} B <= ${cap} B (headroom ${cap - size} B)`);
  }
}
for (const f of Object.keys(CAPS)) {
  if (!files.includes(f)) {
    console.error(`FAIL ${f}: missing from dist/`);
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
