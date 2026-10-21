// Manifest check: dist/magic-card-manifest.js (written by tools/manifest-plugin.cjs) must agree with the files in dist/.
// - the manifest is `export default { build, chunks }`; build is the version in package.json (or --build)
// - every chunks entry maps magic-card-<name>.js to an existing magic-card-<name>.<hash8>.js, and the names agree
// - every hashed .js in dist/ is listed (an unlisted one is a leftover of an older build)
// - the entries (magic-card.js, magic-card-animation-studio.js, magic-card-theme-editor.js) keep fixed names and are not listed
// Only .js names are compared: the .js.br and .js.gz copies next to them are checked by tools/check-dist-size.mjs.
// Usage: node tools/check-manifest.mjs [--dist <dir>] [--build <version>] | --self-test
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const MANIFEST = 'magic-card-manifest.js';
const ENTRIES = ['magic-card.js', 'magic-card-animation-studio.js', 'magic-card-theme-editor.js', MANIFEST];
const HASHED = /^(magic-card-.+)\.[0-9a-f]{8}\.js$/;

/** Problems found for one dist directory (a list of strings; empty = consistent). */
export function check(dist, build) {
  const problems = [];
  let text;
  try {
    text = readFileSync(join(dist, MANIFEST), 'utf8');
  } catch {
    return [`${MANIFEST} is missing from ${dist}`];
  }
  const m = /^export default\s*(\{.*\});?\s*$/s.exec(text);
  let doc;
  try {
    // the build minifies the file: `build` and `chunks` may be bare keys, the chunk names stay quoted
    doc = JSON.parse((m?.[1] ?? '').replace(/([{,])(build|chunks):/g, '$1"$2":'));
  } catch {
    return [`${MANIFEST} is not "export default { build, chunks }" with JSON values`];
  }
  if (doc.build !== build) problems.push(`manifest build "${doc.build}" differs from the release "${build}"`);
  const chunks = doc.chunks ?? {};
  const files = readdirSync(dist).filter((f) => f.endsWith('.js'));
  const listed = new Set();
  for (const [logical, emitted] of Object.entries(chunks)) {
    const hashed = HASHED.exec(emitted);
    if (!hashed) problems.push(`${logical}: "${emitted}" is not magic-card-<name>.<hash8>.js`);
    else if (`${hashed[1]}.js` !== logical) problems.push(`${logical}: maps to ${emitted}, another chunk`);
    if (ENTRIES.includes(logical) || ENTRIES.includes(emitted)) problems.push(`${logical}: an entry is listed (entries keep fixed names)`);
    if (!files.includes(emitted)) problems.push(`${logical}: ${emitted} is not in dist/`);
    listed.add(emitted);
  }
  for (const f of files) {
    if (HASHED.test(f) && !listed.has(f)) problems.push(`${f}: in dist/ but not in the manifest (leftover of an older build?)`);
    if (!HASHED.test(f) && !ENTRIES.includes(f)) problems.push(`${f}: a dist .js with neither a hash nor an entry name`);
  }
  return problems;
}

function selfTest() {
  const tmp = mkdtempSync(join(tmpdir(), 'mc-manifest-check-'));
  let bad = 0;
  let n = 0;
  const run = (name, { files = [], manifest, build = '1.0.0' }, expectProblem) => {
    const dir = join(tmp, `c${n++}`);
    mkdirSync(dir);
    for (const f of ['magic-card.js', ...files]) writeFileSync(join(dir, f), '');
    if (manifest !== undefined) writeFileSync(join(dir, MANIFEST), manifest);
    const found = check(dir, build);
    const good = expectProblem === null ? found.length === 0 : found.some((p) => p.includes(expectProblem));
    console.log(`${good ? 'ok  ' : 'FAIL'} selftest: ${name}${good ? '' : ' -> ' + JSON.stringify(found)}`);
    if (!good) bad++;
  };
  const doc = (chunks, build = '1.0.0') => `export default ${JSON.stringify({ build, chunks })};\n`;
  const a = 'magic-card-a.0123abcd.js';
  const ok = { files: [a], manifest: doc({ 'magic-card-a.js': a }) };
  run('a consistent dist passes', ok, null);
  run('the minified form passes', { ...ok, manifest: `export default{build:"1.0.0",chunks:{"magic-card-a.js":"${a}"}};` }, null);
  run('the .br and .gz copies are ignored', { ...ok, files: [a, `${a}.br`, `${a}.gz`] }, null);
  run('no manifest fails', { files: [a] }, 'is missing');
  run('a manifest that is not an export fails', { files: [a], manifest: 'nope' }, 'is not');
  run('another build fails', { ...ok, build: '2.0.0' }, 'differs from the release');
  run('a listed file that is not in dist fails', { files: [], manifest: doc({ 'magic-card-a.js': a }) }, 'not in dist');
  run('a hashed file the manifest lacks fails', { files: [a, 'magic-card-b.89abcdef.js'], manifest: doc({ 'magic-card-a.js': a }) }, 'not in the manifest');
  run('a name that does not match its key fails', { files: [a], manifest: doc({ 'magic-card-b.js': a }) }, 'another chunk');
  run('a file name with no hash fails', { files: ['magic-card-c.js', a], manifest: doc({ 'magic-card-a.js': a }) }, 'neither a hash nor an entry');
  run('a short hash fails', { files: ['magic-card-a.01.js'], manifest: doc({ 'magic-card-a.js': 'magic-card-a.01.js' }) }, 'is not magic-card');
  run('an entry listed in the manifest fails', { files: [a], manifest: doc({ 'magic-card-a.js': a, 'magic-card.js': 'magic-card.js' }) }, 'entry');
  rmSync(tmp, { recursive: true, force: true });
  if (bad) process.exit(1);
  console.log('ok   manifest check self-test');
}

const args = process.argv.slice(2);
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
if (args.includes('--self-test')) selfTest();
else if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const build = opt('--build') ?? JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
  const problems = check(opt('--dist') ?? join(ROOT, 'dist'), build);
  for (const p of problems) console.error(`FAIL ${p}`);
  if (problems.length) process.exit(1);
  console.log(`ok   ${MANIFEST} lists every hashed chunk in dist/ and nothing else (build ${build})`);
}
