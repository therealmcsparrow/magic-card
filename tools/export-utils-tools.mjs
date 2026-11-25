// Copies the utils set (theme editor, forum shot and every chunk only they load) into the Magic Card Utils www folder.
//
//   node tools/export-utils-tools.mjs <www>            build from `git archive HEAD`, check, then write the set into <www>
//   node tools/export-utils-tools.mjs <www> --check    build the same set, write nothing; exit 1 "stale" when <www> differs, 2 on a tool error
//
// The tool owns only the top-level files of <www> named magic-card-<name>[.<8 hex>].js and magic-card-tools.json.
// Every other file and folder in <www> is never read, written or removed.
// The build runs in a fixed folder below the OS temp directory, on a tree extracted from the committed HEAD,
// with `npm ci` there. The extraction refuses absolute names, `..` segments and links.
// The same commit gives the same bytes, so two runs give equal SHA-256 hashes.
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUILD_DIR = path.join(os.tmpdir(), 'mc-utils-export');
const OWNED_JS = /^magic-card-[a-z0-9-]+(\.[0-9a-f]{8})?\.js$/;
const TOOLS_JSON = 'magic-card-tools.json';
const MAX_JSON_BYTES = 64 * 1024 * 1024;
const MAX_TAR_BYTES = 1024 * 1024 * 1024;

const sha256 = (data) => createHash('sha256').update(data).digest('hex');

class ToolError extends Error {}

/** The names this tool owns: top-level magic-card-*.js files and magic-card-tools.json. */
export function ownedFiles(names) {
  return names.filter((n) => typeof n === 'string' && (n === TOOLS_JSON || OWNED_JS.test(n)));
}

/** What to delete from www (owned files absent from the new set) and what to copy (the new set), both sorted. */
export function planCopy(existing, next) {
  const keep = new Set(ownedFiles(next));
  return {
    remove: ownedFiles(existing).filter((n) => !keep.has(n)).sort(),
    copy: [...keep].sort(),
  };
}

/** The deterministic text of magic-card-tools.json. `files` maps name -> content; keys are sorted, nothing varies between runs. */
export function toolsManifest({ version, files, packages, fonts }) {
  const sortedObject = (entries) => Object.fromEntries(entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
  const doc = {
    version,
    files: sortedObject(Object.entries(files).map(([name, content]) => [name, sha256(content)])),
    bundled: {
      packages: sortedObject(Object.entries(packages)),
      fonts: [...new Set(fonts)].sort(),
    },
  };
  return `${JSON.stringify(doc, null, 2)}\n`;
}

/** Compares two name -> sha256 maps: files whose hash differs, files only in `fresh` (missing on disk) and files only on disk (extra). */
export function compareSets(disk, fresh) {
  const changed = [];
  const missing = [];
  const extra = [];
  for (const name of Object.keys(fresh).sort()) {
    if (!Object.hasOwn(disk, name)) missing.push(name);
    else if (disk[name] !== fresh[name]) changed.push(name);
  }
  for (const name of Object.keys(disk).sort()) if (!Object.hasOwn(fresh, name)) extra.push(name);
  return { changed, missing, extra };
}

/** Parses JSON text of a bounded size into plain data; any failure becomes a ToolError. */
function parseJsonFile(file, what) {
  let text;
  try {
    if (fs.statSync(file).size > MAX_JSON_BYTES) throw new ToolError(`${what} is larger than ${MAX_JSON_BYTES} bytes`);
    text = fs.readFileSync(file, 'utf8');
  } catch (e) {
    if (e instanceof ToolError) throw e;
    throw new ToolError(`cannot read ${what}: ${e.code ?? e.message}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new ToolError(`${what} is not valid JSON`);
  }
}

/** Empties and recreates the fixed build folder. A link at that path is removed as a link, never followed. */
function freshBuildDir() {
  let st = null;
  try {
    st = fs.lstatSync(BUILD_DIR);
  } catch (e) {
    if (e.code !== 'ENOENT') throw new ToolError(`cannot inspect ${BUILD_DIR}: ${e.code}`);
  }
  if (st) {
    if (st.isSymbolicLink() || !st.isDirectory()) {
      fs.rmdirSync(BUILD_DIR);
    } else {
      fs.rmSync(BUILD_DIR, { recursive: true, force: true });
    }
  }
  fs.mkdirSync(BUILD_DIR, { recursive: true });
  const after = fs.lstatSync(BUILD_DIR);
  if (after.isSymbolicLink() || !after.isDirectory()) throw new ToolError(`${BUILD_DIR} is not a plain folder`);
}

const octal = (buf) => {
  const s = buf.toString('latin1').replace(/\0.*$/s, '').trim();
  return s === '' ? 0 : parseInt(s, 8);
};
const cString = (buf) => buf.toString('utf8').replace(/\0.*$/s, '');

/** Reads pax extended header records (`<len> key=value\n`) into a map. */
function paxRecords(data) {
  const out = Object.create(null);
  let i = 0;
  while (i < data.length) {
    const sp = data.indexOf(0x20, i);
    if (sp < 0) break;
    const len = parseInt(data.toString('latin1', i, sp), 10);
    if (!Number.isInteger(len) || len <= 0) break;
    const rec = data.toString('utf8', sp + 1, i + len - 1);
    const eq = rec.indexOf('=');
    if (eq > 0) out[rec.slice(0, eq)] = rec.slice(eq + 1);
    i += len;
  }
  return out;
}

/** Resolves an archive name to a path inside `dir`, or throws when it is absolute, climbs out with `..`, or holds a drive or backslash. */
function safeTarget(dir, name) {
  if (name.includes('\\') || name.includes('\0') || /^[A-Za-z]:/.test(name) || name.startsWith('/')) throw new ToolError(`unsafe name in archive: ${name}`);
  const parts = name.split('/').filter((p) => p !== '' && p !== '.');
  if (parts.includes('..')) throw new ToolError(`unsafe name in archive: ${name}`);
  const target = path.join(dir, ...parts);
  const rel = path.relative(dir, target);
  if (rel.startsWith('..') || path.isAbsolute(rel)) throw new ToolError(`unsafe name in archive: ${name}`);
  return { target, isRoot: parts.length === 0 };
}

/** Extracts a tar buffer into `dir`: regular files and folders only; any link entry fails the run. */
function extractTar(buf, dir) {
  let pos = 0;
  let longName = null;
  let pax = null;
  while (pos + 512 <= buf.length) {
    const header = buf.subarray(pos, pos + 512);
    if (header.every((b) => b === 0)) break;
    const size = octal(header.subarray(124, 136));
    const type = String.fromCharCode(header[156] || 0x30);
    const body = buf.subarray(pos + 512, pos + 512 + size);
    pos += 512 + Math.ceil(size / 512) * 512;
    if (type === 'g') continue;
    if (type === 'x') {
      pax = paxRecords(body);
      continue;
    }
    if (type === 'L') {
      longName = cString(body);
      continue;
    }
    const prefix = cString(header.subarray(345, 500));
    let name = cString(header.subarray(0, 100));
    if (prefix) name = `${prefix}/${name}`;
    if (pax?.path) name = pax.path;
    else if (longName) name = longName;
    pax = null;
    longName = null;
    if (type === '1' || type === '2') throw new ToolError(`archive holds a link: ${name}`);
    const { target, isRoot } = safeTarget(dir, name);
    if (type === '5') {
      if (!isRoot) fs.mkdirSync(target, { recursive: true });
    } else if (type === '0') {
      if (isRoot) throw new ToolError(`unsafe name in archive: ${name}`);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, body, { flag: 'wx' });
    } else {
      throw new ToolError(`unsupported archive entry type ${type}: ${name}`);
    }
  }
}

/** Runs a child with constant arguments; a non-zero exit or a spawn failure becomes a ToolError. */
function runChild(cmd, args, options) {
  const result = spawnSync(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'], ...options });
  if (result.error) throw new ToolError(`${cmd} ${args.join(' ')} failed to start: ${result.error.code ?? result.error.message}`);
  if (result.status !== 0) throw new ToolError(`${cmd} ${args.join(' ')} exited with ${result.status}`);
}

/** The npm entry script next to the running node, so no shell is needed. */
function npmCli() {
  const bin = path.dirname(process.execPath);
  const candidates = [path.join(bin, 'node_modules', 'npm', 'bin', 'npm-cli.js'), path.join(bin, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js')];
  const found = candidates.find((c) => fs.existsSync(c));
  if (!found) throw new ToolError('cannot find npm next to the running node');
  return found;
}

/** The package names the utils graph imports (bare specifiers in its ./src files) plus their runtime dependencies from package-lock, name -> version. */
function bundledPackages(buildDir) {
  const stats = parseJsonFile(path.join(buildDir, 'node_modules', '.cache', 'magic-card', 'i18n-stats.utils.json'), 'the utils stats');
  const lock = parseJsonFile(path.join(buildDir, 'package-lock.json'), 'package-lock.json');
  const locked = Object.assign(Object.create(null), lock.packages);
  const sources = new Set();
  for (const chunk of Array.isArray(stats.chunks) ? stats.chunks : []) for (const m of chunk.modules ?? []) if (typeof m === 'string' && m.startsWith('./src/')) sources.add(m);
  const wanted = new Set();
  const specifier = /(?:\bfrom\s*|\bimport\s*\(?\s*|\bimport\s+)['"]([^'"./][^'"]*)['"]/g;
  for (const rel of [...sources].sort()) {
    const file = path.join(buildDir, rel);
    if (!/\.(ts|js|mjs)$/.test(file) || !fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const m of text.matchAll(specifier)) {
      const parts = m[1].split('/');
      const name = m[1].startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
      if (locked[`node_modules/${name}`]) wanted.add(name);
    }
  }
  const queue = [...wanted];
  while (queue.length) {
    const name = queue.shift();
    const deps = Object.keys(locked[`node_modules/${name}`]?.dependencies ?? {});
    for (const dep of deps) {
      if (!wanted.has(dep) && locked[`node_modules/${dep}`]) {
        wanted.add(dep);
        queue.push(dep);
      }
    }
  }
  const out = Object.create(null);
  for (const name of [...wanted].sort()) {
    const version = locked[`node_modules/${name}`]?.version;
    if (typeof version !== 'string') throw new ToolError(`package-lock has no version for ${name}`);
    out[name] = version;
  }
  return out;
}

/** Font family names of the bundled studio fonts, from the woff2 file names in fonts/. */
function bundledFonts(buildDir, distFiles) {
  if (!distFiles.some((n) => n.startsWith('magic-card-studio-fonts.'))) return [];
  const dir = path.join(buildDir, 'fonts');
  const names = fs.readdirSync(dir).filter((n) => n.endsWith('.woff2'));
  const families = names.map((n) => n.replace(/\.woff2$/, '').replace(/-\d+$/, '').split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '));
  return [...new Set(families)].sort();
}

/** Builds the utils set from the committed HEAD and returns name -> Buffer, manifest included. */
function buildSet() {
  freshBuildDir();
  const tar = execFileSync('git', ['archive', '--format=tar', 'HEAD'], { cwd: root, maxBuffer: MAX_TAR_BYTES });
  extractTar(tar, BUILD_DIR);
  const env = {
    ...process.env,
    GIT_CEILING_DIRECTORIES: path.dirname(BUILD_DIR),
    NODE_OPTIONS: '--max-old-space-size=6144',
    CI: 'true',
    npm_config_fetch_retries: '6',
  };
  const npm = npmCli();
  runChild(process.execPath, [npm, 'ci', '--ignore-scripts'], { cwd: BUILD_DIR, env });
  // keys.gen.ts and messages.gen.ts are git-ignored, so the archived tree lacks them until i18n generates them.
  runChild(process.execPath, [npm, 'run', 'i18n'], { cwd: BUILD_DIR, env });
  runChild(process.execPath, [npm, 'run', 'build:utils'], { cwd: BUILD_DIR, env });
  const dist = path.join(BUILD_DIR, 'dist-utils');
  runChild(process.execPath, [path.join(BUILD_DIR, 'tools', 'check-dist-size.mjs'), '--set', 'utils', '--dist', dist], { cwd: BUILD_DIR, env });
  runChild(process.execPath, [path.join(BUILD_DIR, 'tools', 'check-es-syntax.mjs'), '--set', 'utils', '--dist', dist, '--no-base'], { cwd: BUILD_DIR, env });
  const names = ownedFiles(fs.readdirSync(dist, { withFileTypes: true }).filter((e) => e.isFile()).map((e) => e.name)).filter((n) => n !== TOOLS_JSON);
  if (names.length === 0) throw new ToolError('the utils build produced no files');
  const files = Object.create(null);
  for (const name of names.sort()) files[name] = fs.readFileSync(path.join(dist, name));
  const version = parseJsonFile(path.join(BUILD_DIR, 'package.json'), 'package.json').version;
  if (typeof version !== 'string') throw new ToolError('package.json has no version');
  const manifest = toolsManifest({ version, files, packages: bundledPackages(BUILD_DIR), fonts: bundledFonts(BUILD_DIR, names) });
  files[TOOLS_JSON] = Buffer.from(manifest, 'utf8');
  return files;
}

/** The owned top-level regular files of www with their hashes; a link or other entry under an owned name is an error. */
function readOwned(www) {
  const out = Object.create(null);
  for (const name of ownedFiles(fs.readdirSync(www))) {
    const full = path.join(www, name);
    if (!fs.lstatSync(full).isFile()) throw new ToolError(`${full} is not a regular file`);
    out[name] = sha256(fs.readFileSync(full));
  }
  return out;
}

function main(argv) {
  const check = argv.includes('--check');
  const positional = argv.filter((a) => !a.startsWith('--'));
  const unknown = argv.filter((a) => a.startsWith('--') && a !== '--check');
  if (positional.length !== 1 || unknown.length) throw new ToolError('usage: node tools/export-utils-tools.mjs <www> [--check]');
  const www = path.resolve(positional[0]);
  let st;
  try {
    st = fs.lstatSync(www);
  } catch {
    throw new ToolError(`${www} does not exist`);
  }
  if (!st.isDirectory()) throw new ToolError(`${www} is not a folder`);

  const files = buildSet();
  const fresh = Object.fromEntries(Object.entries(files).map(([n, b]) => [n, sha256(b)]));

  if (check) {
    const diff = compareSets(readOwned(www), fresh);
    if (diff.changed.length || diff.missing.length || diff.extra.length) {
      console.error(`stale: ${www} differs from a fresh export`);
      for (const n of diff.changed) console.error(`  changed ${n}`);
      for (const n of diff.missing) console.error(`  missing ${n}`);
      for (const n of diff.extra) console.error(`  extra   ${n}`);
      return 1;
    }
    console.log(`up to date, ${Object.keys(fresh).length} files`);
    return 0;
  }

  const plan = planCopy(fs.readdirSync(www), Object.keys(files));
  for (const name of plan.remove) {
    const full = path.join(www, name);
    if (!fs.lstatSync(full).isFile()) throw new ToolError(`${full} is not a regular file`);
    fs.unlinkSync(full);
  }
  for (const name of plan.copy) {
    const full = path.join(www, name);
    if (fs.existsSync(full) && !fs.lstatSync(full).isFile()) throw new ToolError(`${full} is not a regular file`);
    fs.writeFileSync(full, files[name]);
  }
  console.log(`wrote ${plan.copy.length} files, removed ${plan.remove.length} to ${www}`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (e) {
    console.error(`error: ${e instanceof ToolError ? e.message : (e?.stack ?? e)}`);
    process.exitCode = 2;
  }
}
