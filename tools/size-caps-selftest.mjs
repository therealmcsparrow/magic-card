// Self-test of tools/check-dist-size.mjs on synthetic dists and caps files.
// Covers: equal gzip lengths and body digests on two runs, a raised cap with no approved_raises entry fails,
// an unlisted dist file fails, another zlib or brotli is non-authoritative locally and a failure in CI.
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const checker = join(root, 'tools', 'check-dist-size.mjs');
const real = JSON.parse(readFileSync(join(root, 'tools', 'size-caps.json'), 'utf8'));
const tmp = mkdtempSync(join(tmpdir(), 'size-caps-'));
let bad = 0;
let n = 0;

const clone = (o) => JSON.parse(JSON.stringify(o));
function run(extra, env = {}) {
  const e = { ...process.env, GITHUB_ACTIONS: '', CI: '', ...env };
  const p = spawnSync(process.execPath, [checker, ...extra], { env: e, encoding: 'utf8' });
  return { code: p.status, out: `${p.stdout}${p.stderr}` };
}
function expect(name, cond, detail = '') {
  if (cond) console.log(`ok   selftest: ${name}`);
  else {
    console.error(`FAIL selftest: ${name}\n${detail}`);
    bad++;
  }
}
/** Writes a fixture dist and caps file; returns the checker arguments for it. */
function fixture(caps, dist, siblings = true) {
  const d = join(tmp, `f${n++}`);
  mkdirSync(join(d, 'dist'), { recursive: true });
  for (const [f, content] of Object.entries(dist)) writeFileSync(join(d, 'dist', f), content);
  writeFileSync(join(d, 'caps.json'), JSON.stringify(caps));
  if (siblings) spawnSync(process.execPath, [join(root, 'tools', 'compress-dist.mjs'), '--dist', join(d, 'dist')], { stdio: 'ignore' });
  return ['--caps', join(d, 'caps.json'), '--dist', join(d, 'dist')];
}

// a small caps file whose zlib and brotli are the running ones, so the verdicts here are authoritative
const here = clone(real);
here.gzip.zlib = process.versions.zlib;
here.gzip.brotli = process.versions.brotli;
here.files = { 'magic-card-a.js': { raw: 2048, ceiling: 4096, note: 'fixture' } };
here.entry.base.gzip = 3000;
// fixtures start from an open ladder: no stage caps, no br cap
here.entry.current_stage = 'stage-1';
for (const st of here.entry.stages) {
  st.cap = null;
  st.landed_commit = null;
  delete st.measured;
  delete st.trace_ms;
}
here.entry.br.cap = null;
here.entry.br.measured = null;
// hex of a hash chain: it does not compress below about 55 %, so the gzip figure sits near 2 KB
let h = 'seed';
let hex = '';
while (hex.length < 4000) hex += h = createHash('sha256').update(h).digest('hex');
const body = `export const a = ${JSON.stringify(hex)};\n`;
const dist = { 'magic-card.js': body, 'magic-card-a.0a1b2c3d.js': 'export {};\n' };

// 1. a clean fixture passes and strips the content hash
let r = run([...fixture(here, dist), '--caps-only']);
expect('caps-only passes on a clean file', r.code === 0, r.out);
r = run(fixture(here, dist));
expect('clean dist passes (hash stripped from magic-card-a.0a1b2c3d.js)', r.code === 0, r.out);

// 2. two runs, same gzip length and same bytes after the 10-byte header
const digestRe = /(\d+) B gzip.*sha256\(after header\) (\w+)/;
const a = run([...fixture(here, dist), '--digest']).out.match(digestRe);
const b = run([...fixture(here, dist), '--digest']).out.match(digestRe);
expect('two runs give equal gzip length and body digest', !!a && !!b && a[1] === b[1] && a[2] === b[2], `${a}\n${b}`);

// 3. over the gzip cap fails
const tight = clone(here);
tight.entry.base.gzip = 1000;
r = run(fixture(tight, dist));
expect('entry over its gzip cap fails', r.code === 1 && /gzip > cap/.test(r.out), r.out);

// 4. unlisted file fails; a listed file missing fails; over raw cap fails
r = run(fixture(here, { ...dist, 'magic-card-new.js': 'export {};\n' }));
expect('unlisted dist file fails', r.code === 1 && /magic-card-new\.js.*no entry/.test(r.out), r.out);
r = run(fixture(here, { 'magic-card.js': body }));
expect('listed file missing from dist fails', r.code === 1 && /magic-card-a\.js: missing/.test(r.out), r.out);
r = run(fixture(here, { ...dist, 'magic-card-a.0a1b2c3d.js': 'x'.repeat(3000) }));
expect('file over its raw cap fails', r.code === 1 && /> cap 2048/.test(r.out), r.out);

// 5. raises against a base file
const baseFile = join(tmp, 'base.json');
writeFileSync(baseFile, JSON.stringify(here));
const raise = (mut) => {
  const c = clone(here);
  mut(c);
  return [...fixture(c, dist), '--caps-only', '--base-file', baseFile];
};
const decision = (field, from, to) => ({ id: 'test-raise', field, from, to });
r = run(raise((c) => { c.entry.base.gzip = 3500; }));
expect('raised entry cap with no entry fails', r.code === 1 && /\/entry\/base\/gzip was raised from 3000 to 3500/.test(r.out), r.out);
r = run(raise((c) => { c.files['magic-card-a.js'].ceiling = 8192; }));
expect('raised ceiling with no entry fails', r.code === 1 && /ceiling was raised from 4096 to 8192/.test(r.out), r.out);
r = run(raise((c) => { c.entry.stages[0].cap = 3500; }));
expect('a stage cap set above the first-stage base fails', r.code === 1, r.out);
r = run(raise((c) => { c.entry.br.cap = 90000; }));
expect('br cap null -> number is not a raise', r.code === 0, r.out);
r = run(raise((c) => { c.files['magic-card-a.js'].raw = 3000; }));
expect('a raw cap raise under the ceiling needs no entry', r.code === 0, r.out);
r = run(raise((c) => { c.files['magic-card-a.js'].raw = 5000; }));
expect('a raw cap above its ceiling fails', r.code === 1 && /above its ceiling/.test(r.out), r.out);
r = run(raise((c) => {
  c.entry.base.gzip = 3500;
  c.approved_raises.push(decision('/entry/base/gzip', 3000, 3500));
}));
expect('a raise with a matching approved_raises entry passes', r.code === 0, r.out);
r = run(raise((c) => {
  c.entry.base.gzip = 3500;
  c.approved_raises.push(decision('/entry/base/gzip', 3000, 3400));
}));
expect('an entry with another "to" does not cover the raise', r.code === 1, r.out);
r = run(raise((c) => { c.entry.base.gzip = 2900; c.files['magic-card-a.js'].ceiling = 3000; }));
expect('lowering a cap and a ceiling passes', r.code === 0, r.out);
// a base entry cannot be edited or removed
const withDecision = clone(here);
withDecision.approved_raises.push(decision('/entry/base/gzip', 2900, 3000));
writeFileSync(baseFile, JSON.stringify(withDecision));
r = run(raise((c) => { c.approved_raises = []; }));
expect('removing an approved_raises entry fails (append-only)', r.code === 1 && /append-only/.test(r.out), r.out);
// carried approvals compare by field, from and to; the base file's list may sit under another key and carry more keys
const carried = clone(here);
carried.approved_raises = [decision('/entry/base/gzip', 2900, 3000)];
const legacy = clone(here);
delete legacy.approved_raises;
legacy.old_list = [{ id: 'old-name', date: '2026-01-01', source: 'chat', quote: 'yes', field: '/entry/base/gzip', from: 2900, to: 3000 }];
writeFileSync(baseFile, JSON.stringify(legacy));
r = run([...fixture(carried, dist), '--caps-only', '--base-file', baseFile]);
expect('a base list under another key, with extra keys, passes when field, from and to match', r.code === 0, r.out);
const edited = clone(carried);
edited.approved_raises[0].to = 3001;
r = run([...fixture(edited, dist), '--caps-only', '--base-file', baseFile]);
expect('changing a carried field, from or to fails (append-only)', r.code === 1 && /append-only/.test(r.out), r.out);
const extra = clone(here);
extra.approved_raises.push({ ...decision('/entry/base/gzip', 2900, 3000), quote: 'yes' });
r = run([...fixture(extra, dist), '--caps-only']);
expect('an approved_raises entry with an extra key fails the shape check', r.code === 1 && /unknown key "quote"/.test(r.out), r.out);
const laterStage = clone(here);
laterStage.entry.current_stage = 'stage-2';
writeFileSync(baseFile, JSON.stringify(laterStage));
r = run([...fixture(here, dist), '--caps-only', '--base-file', baseFile]);
expect('current_stage moving back fails', r.code === 1 && /moved back/.test(r.out), r.out);
const renamed = clone(laterStage);
renamed.entry.stages.forEach((s, i) => { s.id = `s${i}`; });
renamed.entry.current_stage = 's1';
writeFileSync(baseFile, JSON.stringify(renamed));
r = run([...fixture(here, dist), '--caps-only', '--base-file', baseFile]);
expect('current_stage moving back fails across different stage ids', r.code === 1 && /moved back/.test(r.out), r.out);
// first run: no base file; an unresolvable ref
r = run([...fixture(here, dist), '--caps-only', '--base-file', join(tmp, 'nothing.json')]);
expect('first run (no base file) means no raises', r.code === 0 && /first run/.test(r.out), r.out);
r = run([...fixture(here, dist), '--caps-only', '--base-ref', 'no-such-ref-xyz', '--require-base']);
expect('an unresolvable base ref fails with --require-base', r.code === 1, r.out);

// 6. another zlib or brotli
for (const key of ['zlib', 'brotli']) {
  const other = clone(here);
  other.gzip[key] = '0.0.0-other';
  r = run(fixture(other, dist));
  expect(`different ${key} is reported as not authoritative locally`, r.code === 0 && /NOT AUTHORITATIVE/.test(r.out) && /not authoritative\)/.test(r.out), r.out);
  r = run(fixture(other, dist), { GITHUB_ACTIONS: 'true' });
  expect(`different ${key} fails in CI`, r.code === 1 && /another compressor/.test(r.out), r.out);
}

// 7. ladder and final cap
const ladder = clone(here);
ladder.entry.stages[1].cap = 999999;
r = run([...fixture(ladder, dist), '--caps-only']);
expect('a stage cap above the stage before it fails', r.code === 1 && /only steps down/.test(r.out), r.out);
const fin = clone(here);
fin.entry.final_cap = 70000;
r = run([...fixture(fin, dist), '--caps-only']);
expect('editing final_cap fails (constant 61,440)', r.code === 1, r.out);

// 7a. the last stage cap above the final cap needs the latest approved_raises entry for /entry/stages/3/cap to name it
const overFinal = clone(here);
// the real file may already carry the entry; each case below adds its own
overFinal.approved_raises = overFinal.approved_raises.filter((e) => e.field !== '/entry/stages/3/cap');
overFinal.entry.current_stage = 'stage-4';
overFinal.entry.base.gzip = 70000;
overFinal.entry.stages[0].cap = 70000;
overFinal.entry.stages[3].cap = 61441;
r = run([...fixture(overFinal, dist), '--caps-only']);
expect('a last-stage cap over 61,440 with no entry fails', r.code === 1 && /above the final cap 61440/.test(r.out), r.out);
const exempt = clone(overFinal);
exempt.approved_raises.push({ id: 's2-final-cap-measured', field: '/entry/stages/3/cap', from: null, to: 61441 });
r = run([...fixture(exempt, dist), '--caps-only']);
expect('a last-stage cap over 61,440 with the entry passes and warns', r.code === 0 && /WARN.*above the final cap 61440/.test(r.out), r.out);
const wrongTo = clone(exempt);
wrongTo.approved_raises.at(-1).to = 61000;
r = run([...fixture(wrongTo, dist), '--caps-only']);
expect('the entry must name the cap it allows', r.code === 1, r.out);
const wrongId = clone(exempt);
wrongId.approved_raises.at(-1).id = 'another-id';
r = run([...fixture(wrongId, dist), '--caps-only']);
expect('another id with the same field and to still allows a cap over 61,440', r.code === 0, r.out);
const laterEntry = clone(exempt);
laterEntry.entry.stages[3].cap = 61500;
laterEntry.approved_raises.push({ id: 'later-raise', field: '/entry/stages/3/cap', from: 61441, to: 61500 });
r = run([...fixture(laterEntry, dist), '--caps-only']);
expect('a later entry for the same field allows the raised cap', r.code === 0 && /WARN.*above the final cap 61440/.test(r.out), r.out);
const noMatch = clone(laterEntry);
noMatch.entry.stages[3].cap = 61600;
r = run([...fixture(noMatch, dist), '--caps-only']);
expect('a cap that no latest entry names fails', r.code === 1 && /above the final cap 61440/.test(r.out), r.out);
const otherField = clone(overFinal);
otherField.approved_raises.push({ id: 'other-field', field: '/entry/stages/2/cap', from: null, to: 61441 });
r = run([...fixture(otherField, dist), '--caps-only']);
expect('an entry for another field does not allow a cap over 61,440', r.code === 1, r.out);

// 7b. a closed first stage (cap = base figure, landed commit, measured) passes; a later stage cap above it fails
const closed = clone(here);
Object.assign(closed.entry.stages[0], { cap: 3000, landed_commit: 'ad04a81', measured: 3000 });
r = run([...fixture(closed, dist), '--caps-only']);
expect('a closed first stage (cap equal to the base figure) passes', r.code === 0, r.out);
const above = clone(closed);
above.entry.stages[1].cap = 3001;
r = run([...fixture(above, dist), '--caps-only']);
expect('a stage cap above a closed first stage fails', r.code === 1 && /only steps down/.test(r.out), r.out);
const s0high = clone(closed);
s0high.entry.stages[0].cap = 3001;
r = run([...fixture(s0high, dist), '--caps-only']);
expect('a first-stage cap above the base figure fails', r.code === 1 && /above the base figure/.test(r.out), r.out);

// 8. siblings: missing, stale, orphan, corrupt and the br gate
r = run(fixture(here, dist, false));
expect('dist with no .br/.gz fails', r.code === 1 && /.js.br: missing/.test(r.out) && /.js.gz: missing/.test(r.out), r.out);
{
  const args = fixture(here, dist);
  const dd = args[3];
  writeFileSync(join(dd, 'magic-card.js.br'), readFileSync(join(dd, 'magic-card-a.0a1b2c3d.js.br')));
  r = run(args);
  expect('a stale .br (another build) fails', r.code === 1 && /magic-card.js.br: unpacks to/.test(r.out), r.out);
}
{
  const args = fixture(here, dist);
  writeFileSync(join(args[3], 'magic-card-gone.js.gz'), 'x');
  r = run(args);
  expect('an orphan .gz fails', r.code === 1 && /magic-card-gone.js.gz: orphan/.test(r.out), r.out);
}
{
  const args = fixture(here, dist);
  writeFileSync(join(args[3], 'magic-card.js.gz'), 'not gzip');
  r = run(args);
  expect('a corrupt .gz fails', r.code === 1 && /magic-card.js.gz: does not unpack/.test(r.out), r.out);
}
{
  const capped = clone(here);
  capped.entry.br.cap = 100;
  r = run(fixture(capped, dist));
  expect('magic-card.js.br over entry.br.cap fails', r.code === 1 && /br cap 100 B/.test(r.out), r.out);
  const loose = clone(here);
  loose.entry.br.cap = 100000;
  r = run(fixture(loose, dist));
  expect('magic-card.js.br under entry.br.cap passes', r.code === 0 && /br cap 100000/.test(r.out), r.out);
}

rmSync(tmp, { recursive: true, force: true });
if (bad) {
  console.error(`${bad} self-test(s) failed`);
  process.exit(1);
}
console.log('size-caps self-test passed');
