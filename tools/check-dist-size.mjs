// Size gate for the built dist/*.js. Every number lives in tools/size-caps.json (shape: tools/size-caps.schema.json,
// ADR 0042); this file holds only the final-cap constant. Rules:
// - magic-card.js, which every dashboard loads, is gated on gzip bytes: zlib.gzipSync(buffer, { level: 9 }), one shot on the whole file
//   (node.M5, node.S5). The active stage cap applies; while the S0 cap is null (until S0.close) the cap is entry.base.gzip.
//   Gzip bytes depend on the zlib build, so the result is authoritative only on the Node pinned in .nvmrc (zlib and brotli versions are
//   recorded in the caps file). Another zlib or brotli: CI fails, a local run prints "not authoritative".
// - every other dist .js is gated on raw bytes: size <= raw cap <= Architect ceiling. File names are matched with the content hash
//   stripped (magic-card-<name>.<hash8>.js -> magic-card-<name>.js). A dist file with no entry fails (AC7).
// - raises: with --base-ref the caps file is compared with the same file at that git ref. Any entry cap, stage cap, br cap, ceiling or
//   base figure that went up (or a number that was removed) fails unless ceo_decisions carries a matching entry (field, from, to).
//   Only the Lead writes ceo_decisions after the CEO says yes in chat; entries already in the base file must stay as they are.
// - siblings (ADR 0044): every dist .js has a .js.br and a .js.gz next to it (tools/compress-dist.mjs writes them), each unpacks to that
//   .js byte for byte, and a .br or .gz with no .js fails (an orphan, or a stale copy HA would keep serving). Siblings have no size cap of
//   their own, except magic-card.js.br: <= entry.br.cap when set, and always <= the active stage gzip cap.
// Usage: node tools/check-dist-size.mjs [--caps <file>] [--dist <dir>] [--base-ref <git ref> | --base-file <file>] [--require-base] [--caps-only] [--committed] [--digest]
//   --base-file     compare with a file instead of a git ref (the self-test uses it).
//   --require-base an unresolvable ref fails (CI); a ref that exists but has no caps file yet (first run) means no raises.
//   --caps-only     check the caps file and the raises only, no dist (the quick CI job).
//   --committed     check only that every committed .br/.gz unpacks to its committed .js byte for byte (run before the build, which
//                   rewrites them). Sizes and caps are not checked.
//   --digest        also print the sha256 of the gzip bytes after the 10-byte header (the header OS byte differs per platform).
// Raising a cap or ceiling needs a CEO decision, written by the Lead into ceo_decisions in the same change.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliDecompressSync, gunzipSync, gzipSync } from 'node:zlib';

/** 60 KiB, CEO Brief Gate 2026-10-20. Held here as well, so editing the JSON cannot move it. */
const FINAL_CAP = 61_440;
const STAGES = ['S0', 'S1a', 'S1b', 'S2'];
const ROOT = fileURLToPath(new URL('../', import.meta.url));

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const flag = (name) => args.includes(name);
const capsPath = opt('--caps') ?? join(ROOT, 'tools', 'size-caps.json');
const distDir = opt('--dist') ?? join(ROOT, 'dist');
const baseRef = opt('--base-ref');
const baseFile = opt('--base-file');
const inCi = process.env.GITHUB_ACTIONS === 'true' || process.env.CI === 'true';

let failed = false;
const fail = (msg) => {
  console.error(`FAIL ${msg}`);
  failed = true;
};
const ok = (msg) => console.log(`ok   ${msg}`);
const note = (msg) => console.log(`note ${msg}`);

const isObj = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);
const isInt = (v) => Number.isInteger(v) && v >= 1;
const COMMIT = /^[0-9a-f]{7,40}$/;

/** Hand-written check of the parts of tools/size-caps.schema.json the gate relies on (no validator dependency). */
function validateShape(c) {
  const errs = [];
  const need = (cond, msg) => {
    if (!cond) errs.push(msg);
  };
  const keys = (o, allowed, where) => {
    for (const k of Object.keys(o)) need(allowed.includes(k), `${where}: unknown key "${k}"`);
  };
  if (!isObj(c)) return ['the caps file is not a JSON object'];
  keys(c, ['$schema', 'version', 'gzip', 'entry', 'files', 'ceo_decisions'], 'root');
  need(c.version === 1, 'version must be 1');
  const g = c.gzip;
  if (isObj(g)) {
    keys(g, ['level', 'node', 'zlib', 'brotli'], 'gzip');
    need(g.level === 9, 'gzip.level must be 9');
    for (const k of ['node', 'zlib', 'brotli']) need(typeof g[k] === 'string' && g[k] !== '', `gzip.${k} must be a non-empty string`);
  } else errs.push('gzip must be an object');
  const e = c.entry;
  if (isObj(e)) {
    keys(e, ['file', 'base', 'final_cap', 'current_stage', 'stages', 'br'], 'entry');
    need(e.file === 'magic-card.js', 'entry.file must be magic-card.js');
    need(isObj(e.base) && COMMIT.test(String(e.base.commit)) && isInt(e.base.gzip) && isInt(e.base.raw), 'entry.base needs commit, gzip and raw');
    need(e.final_cap === FINAL_CAP, `entry.final_cap must be ${FINAL_CAP}`);
    need(STAGES.includes(e.current_stage), 'entry.current_stage must be one of S0, S1a, S1b, S2');
    if (Array.isArray(e.stages) && e.stages.length === 4) {
      e.stages.forEach((s, i) => {
        const w = `entry.stages[${i}]`;
        need(isObj(s) && s.id === STAGES[i], `${w}.id must be ${STAGES[i]}`);
        if (!isObj(s)) return;
        keys(s, ['id', 'cap', 'target', 'landed_commit', 'measured', 'trace_ms'], w);
        need(s.cap === null || isInt(s.cap), `${w}.cap must be an integer or null`);
        need(isInt(s.target), `${w}.target must be an integer`);
        need(s.landed_commit === null || COMMIT.test(String(s.landed_commit)), `${w}.landed_commit must be a commit or null`);
      });
    } else errs.push('entry.stages must hold the four stages S0, S1a, S1b, S2');
    const br = e.br;
    if (isObj(br)) {
      keys(br, ['quality', 'cap', 'measured'], 'entry.br');
      need(br.quality === 11, 'entry.br.quality must be 11');
      need(br.cap === null || isInt(br.cap), 'entry.br.cap must be an integer or null');
      need(br.measured === null || Number.isInteger(br.measured), 'entry.br.measured must be an integer or null');
    } else errs.push('entry.br must be an object');
  } else errs.push('entry must be an object');
  if (isObj(c.files)) {
    for (const [name, f] of Object.entries(c.files)) {
      const w = `files["${name}"]`;
      need(/^[a-z0-9][a-z0-9-]*\.js$/.test(name) && name !== 'magic-card.js', `${w}: name must be a logical dist .js name without a hash`);
      if (!isObj(f)) {
        errs.push(`${w} must be an object`);
        continue;
      }
      keys(f, ['raw', 'ceiling', 'optional', 'note'], w);
      need(isInt(f.raw) && isInt(f.ceiling), `${w}: raw and ceiling must be integers`);
      need(typeof f.note === 'string' && f.note !== '', `${w}: note must say what the file holds`);
      need(f.optional === undefined || typeof f.optional === 'boolean', `${w}.optional must be a boolean`);
    }
  } else errs.push('files must be an object');
  if (Array.isArray(c.ceo_decisions)) {
    c.ceo_decisions.forEach((d, i) => {
      const w = `ceo_decisions[${i}]`;
      need(isObj(d), `${w} must be an object`);
      if (!isObj(d)) return;
      keys(d, ['id', 'date', 'source', 'quote', 'field', 'from', 'to', 'reason'], w);
      need(/^CEO-\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(String(d.id)), `${w}.id must look like CEO-2026-10-20-name`);
      need(/^\d{4}-\d{2}-\d{2}$/.test(String(d.date)), `${w}.date must be YYYY-MM-DD`);
      need(d.source === 'chat', `${w}.source must be "chat"`);
      need(typeof d.quote === 'string' && d.quote.length >= 3, `${w}.quote must hold the CEO's words`);
      need(typeof d.field === 'string' && d.field.startsWith('/'), `${w}.field must be a JSON pointer`);
      need(d.from === null || Number.isInteger(d.from), `${w}.from must be an integer or null`);
      need(Number.isInteger(d.to), `${w}.to must be an integer`);
    });
  } else errs.push('ceo_decisions must be an array');
  return errs;
}

/** The active entry cap: the stage cap, or entry.base.gzip while the S0 cap is still null. */
function stageCaps(c) {
  const eff = [];
  c.entry.stages.forEach((s, i) => {
    eff.push(s.cap ?? (i === 0 ? c.entry.base.gzip : null));
  });
  return eff;
}

/** Ladder rules: each cap <= the previous one, S2 <= final cap, the active stage has a cap. */
function checkLadder(c) {
  const eff = stageCaps(c);
  let prev = Infinity;
  eff.forEach((cap, i) => {
    if (cap === null) return;
    if (cap > prev) fail(`entry.stages[${i}] (${STAGES[i]}) cap ${cap} B is above the stage before it (${prev} B): the ladder only steps down`);
    prev = cap;
  });
  const s0 = c.entry.stages[0].cap;
  if (s0 !== null && s0 > c.entry.base.gzip) fail(`S0 cap ${s0} B is above the base figure ${c.entry.base.gzip} B (entry.base.gzip)`);
  const s2 = eff[3];
  if (s2 !== null && s2 > FINAL_CAP) fail(`S2 cap ${s2} B is above the final cap ${FINAL_CAP} B`);
  const active = STAGES.indexOf(c.entry.current_stage);
  if (eff[active] === null) fail(`current_stage ${c.entry.current_stage} has no cap: set its cap in the stage-close change first`);
  return eff[active];
}

/** Every number the CEO path guards, as { pointer: value } (null = absent or unset). */
function guarded(c) {
  const m = new Map();
  m.set('/entry/base/gzip', c.entry.base.gzip);
  c.entry.stages.forEach((st, i) => m.set(`/entry/stages/${i}/cap`, st.cap));
  m.set('/entry/br/cap', c.entry.br.cap);
  for (const [name, f] of Object.entries(c.files)) m.set(`/files/${name}/ceiling`, f.ceiling);
  return m;
}

function loadBase(ref) {
  let blob;
  if (baseFile) return existsSync(baseFile) ? { caps: JSON.parse(readFileSync(baseFile, 'utf8')) } : { missingFile: true };
  try {
    execFileSync('git', ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`], { cwd: ROOT, stdio: 'pipe' });
  } catch {
    return { missingRef: true };
  }
  try {
    blob = execFileSync('git', ['show', `${ref}:tools/size-caps.json`], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 24 }).toString('utf8');
  } catch {
    return { missingFile: true };
  }
  return { caps: JSON.parse(blob) };
}

function checkRaises(c, ref) {
  const base = loadBase(ref);
  if (base.missingRef) {
    const msg = `base ref "${ref}" does not resolve, so raises against the base branch were not checked`;
    if (flag('--require-base')) fail(msg);
    else note(msg);
    return;
  }
  if (base.missingFile) {
    note(`${ref} has no tools/size-caps.json (first run): no raises`);
    return;
  }
  const b = base.caps;
  const before = guarded(b);
  const after = guarded(c);
  const decisions = c.ceo_decisions;
  // append-only: the entries of the base file stay, in place
  b.ceo_decisions.forEach((d, i) => {
    if (JSON.stringify(decisions[i]) !== JSON.stringify(d)) fail(`ceo_decisions[${i}] (${d.id}) differs from ${ref}: the list is append-only`);
  });
  if (STAGES.indexOf(c.entry.current_stage) < STAGES.indexOf(b.entry.current_stage)) fail(`entry.current_stage moved back from ${b.entry.current_stage} to ${c.entry.current_stage}`);
  let raises = 0;
  for (const [ptr, was] of before) {
    if (!after.has(ptr)) continue; // file entry removed: lower by definition
    const now = after.get(ptr);
    const raised = was !== null && (now === null || now > was);
    if (!raised) continue;
    raises++;
    const hit = decisions.find((d) => d.field === ptr && d.from === was && d.to === now);
    if (hit) ok(`${ptr} ${was} -> ${now} (${hit.id})`);
    else fail(`${ptr} was raised from ${was} to ${now} with no ceo_decisions entry (field "${ptr}", from ${was}, to ${now}). Only the Lead writes one, after the CEO says yes in chat`);
  }
  for (const [name, f] of Object.entries(c.files)) {
    if (!b.files[name]) note(`new size entry ${name}: raw ${f.raw} B, ceiling ${f.ceiling} B (the Architect sets the ceiling; review it)`);
  }
  if (raises === 0) ok(`no cap or ceiling went up against ${ref}`);
}

/** zlib and brotli versions against the caps file. Returns true when this run is authoritative. */
function checkAuthority(c) {
  const g = c.gzip;
  const diffs = [];
  if (process.versions.zlib !== g.zlib) diffs.push(`zlib ${process.versions.zlib} (recorded ${g.zlib})`);
  if (process.versions.brotli !== g.brotli) diffs.push(`brotli ${process.versions.brotli} (recorded ${g.brotli})`);
  if (diffs.length === 0) {
    if (process.versions.node !== g.node) note(`Node ${process.versions.node} differs from the pinned ${g.node}, but zlib and brotli match`);
    return true;
  }
  if (inCi) fail(`CI runs another compressor than the caps file records: ${diffs.join(', ')}. Pin Node ${g.node} in .nvmrc (setup-node node-version-file) or record the new versions in tools/size-caps.json`);
  else console.warn(`WARN gzip result NOT AUTHORITATIVE on Node ${process.versions.node}: ${diffs.join(', ')}. Pinned Node is ${g.node}; CI decides`);
  return false;
}

function checkNvmrc(c) {
  const p = join(ROOT, '.nvmrc');
  if (!existsSync(p)) return fail('.nvmrc is missing: it pins the exact Node (major.minor.patch) the gzip figures were made with');
  const v = readFileSync(p, 'utf8').trim().replace(/^v/, '');
  if (!/^\d+\.\d+\.\d+$/.test(v)) fail(`.nvmrc "${v}" is not an exact major.minor.patch version`);
  else if (v !== c.gzip.node) fail(`.nvmrc ${v} differs from gzip.node ${c.gzip.node} in tools/size-caps.json`);
}

/** Logical name of a dist file: content hash stripped. */
const logicalName = (f) => f.replace(/\.[0-9a-f]{8}\.js$/, '.js');

function checkDist(c, activeCap, authoritative) {
  if (!existsSync(distDir)) return fail(`${distDir} does not exist: run npm run build first`);
  const files = readdirSync(distDir).filter((f) => f.endsWith('.js')).sort();
  const seen = new Map();
  for (const f of files) {
    const name = logicalName(f);
    if (seen.has(name)) fail(`${f} and ${seen.get(name)} both map to ${name}`);
    seen.set(name, f);
  }
  const tag = authoritative ? '' : ' (not authoritative)';
  const entry = c.entry.file;
  if (!seen.has(entry)) fail(`${entry}: missing from dist/`);
  else {
    const buf = readFileSync(join(distDir, entry));
    const gz = gzipSync(buf, { level: c.gzip.level });
    const digest = flag('--digest') ? ` sha256(after header) ${createHash('sha256').update(gz.subarray(10)).digest('hex')}` : '';
    if (gz.length > activeCap) fail(`${entry}: ${gz.length} B gzip > cap ${activeCap} B (+${gz.length - activeCap} B), stage ${c.entry.current_stage}${tag}${digest}`);
    else ok(`${entry}: ${gz.length} B gzip <= ${activeCap} B (headroom ${activeCap - gz.length} B), ${buf.length} B raw, stage ${c.entry.current_stage}${tag}${digest}`);
  }
  for (const [name, file] of seen) {
    if (name === entry) continue;
    const size = statSync(join(distDir, file)).size;
    const f = c.files[name];
    if (!f) fail(`${file}: ${size} B, new file with no entry in tools/size-caps.json. Add one (raw = its production size + 5 %, rounded up to 1 KiB, under an Architect ceiling) in the same PR`);
    else if (size > f.raw) fail(`${file}: ${size} B > cap ${f.raw} B (+${size - f.raw} B)`);
    else ok(`${file}: ${size} B <= ${f.raw} B (headroom ${f.raw - size} B)`);
  }
  for (const [name, f] of Object.entries(c.files)) {
    if (!seen.has(name) && !f.optional) fail(`${name}: missing from dist/`);
  }
  checkSiblings(c, files, activeCap, tag);
}

/** ADR 0044: .js.br and .js.gz next to every .js, each unpacking to it byte for byte; no copy without its .js. */
function checkSiblings(c, files, activeCap, tag) {
  for (const f of readdirSync(distDir)) {
    const m = /^(.*.js).(br|gz)$/.exec(f);
    if (m && !files.includes(m[1])) fail(`${f}: orphan copy with no ${m[1]} next to it (HA would keep serving it). Delete it together with the .js`);
  }
  let good = 0;
  for (const f of files) {
    const raw = readFileSync(join(distDir, f));
    for (const [ext, unpack] of [['br', brotliDecompressSync], ['gz', gunzipSync]]) {
      const p = join(distDir, `${f}.${ext}`);
      if (!existsSync(p)) {
        fail(`${f}.${ext}: missing. Run npm run build (it ends with tools/compress-dist.mjs)`);
        continue;
      }
      let back;
      try {
        back = unpack(readFileSync(p));
      } catch (e) {
        fail(`${f}.${ext}: does not unpack (${e.code ?? e.message})`);
        continue;
      }
      if (Buffer.compare(back, raw) !== 0) fail(`${f}.${ext}: unpacks to ${back.length} B that differ from ${f} (${raw.length} B): stale copy, rebuild`);
      else good++;
    }
  }
  const entry = c.entry.file;
  const p = join(distDir, `${entry}.br`);
  if (existsSync(p)) {
    const size = statSync(p).size;
    const cap = c.entry.br.cap;
    if (cap !== null && size > cap) fail(`${entry}.br: ${size} B > br cap ${cap} B (+${size - cap} B)${tag}`);
    else if (size > activeCap) fail(`${entry}.br: ${size} B > the stage ${c.entry.current_stage} gzip cap ${activeCap} B${tag}`);
    else ok(`${entry}.br: ${size} B brotli <= ${cap === null ? 'stage gzip cap ' + activeCap : 'br cap ' + cap} B${tag}`);
  }
  if (!failed) ok(`${good} sibling copies unpack to their .js byte for byte`);
}

function main() {
  let caps;
  try {
    caps = JSON.parse(readFileSync(capsPath, 'utf8'));
  } catch (e) {
    console.error(`FAIL cannot read ${capsPath}: ${e.message}`);
    process.exit(1);
  }
  const errs = validateShape(caps);
  if (errs.length) {
    for (const e of errs) fail(`size-caps.json: ${e}`);
    process.exit(1);
  }
  for (const [name, f] of Object.entries(caps.files)) {
    if (f.raw > f.ceiling) fail(`files["${name}"]: raw cap ${f.raw} B is above its ceiling ${f.ceiling} B. A ceiling raise needs a CEO decision`);
  }
  const activeCap = checkLadder(caps);
  if (flag('--committed')) {
    if (!existsSync(distDir)) fail(`${distDir} does not exist`);
    else checkSiblings(caps, readdirSync(distDir).filter((f) => f.endsWith('.js')).sort(), activeCap, ' (committed copies)');
    process.exit(failed ? 1 : 0);
  }
  checkNvmrc(caps);
  if (baseRef || baseFile) checkRaises(caps, baseRef ?? baseFile);
  else note('no --base-ref: raises against the base branch were not checked');
  if (!flag('--caps-only')) {
    const authoritative = checkAuthority(caps);
    checkDist(caps, activeCap, authoritative);
    if (!authoritative && !failed) console.warn('WARN passed here, but the gzip figure is not authoritative; CI on the pinned Node decides');
  }
  process.exit(failed ? 1 : 0);
}

main();
