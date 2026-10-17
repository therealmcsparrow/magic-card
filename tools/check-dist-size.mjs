// Fails when a built dist/*.js grows past its cap, or when an unlisted .js file appears.
// Caps = byte sizes of the 2026.10.06 production build (the three git-tracked files match HEAD). Raise a cap only on purpose, in the same PR.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const CAPS = {
  'magic-card.js': 683958,
  'magic-card-animation-studio.js': 858558,
  'magic-card-editor.js': 647655,
  'magic-card-icon-animator.js': 222240,
  'magic-card-icon-library.js': 171507,
  'magic-card-particles.js': 33080,
  'magic-card-preset-catalogue.js': 22797,
  'magic-card-theme-editor.js': 163632,
  'magic-card-anim-runtime.js': 38672,
};

const dir = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const files = readdirSync(dir).filter((f) => f.endsWith('.js'));
let failed = false;

for (const f of files) {
  const size = statSync(join(dir, f)).size;
  const cap = CAPS[f];
  if (cap === undefined) {
    console.error(`FAIL ${f}: ${size} B, no cap defined (add it to tools/check-dist-size.mjs)`);
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
