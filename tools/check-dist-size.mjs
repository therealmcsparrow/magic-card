// Fails when a built dist/*.js grows past its budget, or when an unlisted .js file appears.
// Budgets, set by the CEO on 2026-10-17 (sizes then in comments):
// - magic-card.js, which every dashboard loads: B1 + 8,192 B (B1 = 679,875 B, the 2026.10.04 baseline).
// - lazy chunks: the 2026.10.07 size + 5 %, rounded up to 1 KiB.
// Raise a budget only on purpose, in the same PR. A new chunk gets the same +5 % rule.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const B1 = 679_875;
const CAPS = {
  'magic-card.js': B1 + 8_192, // 683,958
  'magic-card-animation-studio.js': 902_144, // 858,558
  'magic-card-editor.js': 680_960, // 647,655
  'magic-card-icon-animator.js': 233_472, // 222,240
  'magic-card-icon-library.js': 180_224, // 171,507
  'magic-card-particles.js': 34_816, // 33,080
  'magic-card-preset-catalogue.js': 24_576, // 22,797
  'magic-card-theme-editor.js': 172_032, // 163,837
  'magic-card-theme-presets.js': 21_504, // 19,878
  'magic-card-anim-runtime.js': 40_960, // 38,672
  // path canvas for the SVG and shape editors (T4): 47,935 B measured + 5 %. The architect's ceiling was 40 KiB;
  // draw.ts (6.2 KB) is in this chunk by contract and is the main reason it is over. The chunk is only emitted
  // once an editor chunk imports src/path-canvas/loader.ts; until then this entry reports "missing from dist".
  'magic-card-path-canvas.js': 51_200, // 47,935
};

const dir = fileURLToPath(new URL('../dist/', import.meta.url));
const files = readdirSync(dir).filter((f) => f.endsWith('.js'));
let failed = false;

for (const f of files) {
  const size = statSync(join(dir, f)).size;
  const cap = CAPS[f];
  if (cap === undefined) {
    console.error(`FAIL ${f}: ${size} B, new file with no size cap. Add an entry for it to CAPS in tools/check-dist-size.mjs (its production size + 5 %, rounded up to 1 KiB) in the same PR`);
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
