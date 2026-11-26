// Checks that the production build does not depend on the folder it runs in. It exports HEAD with `git archive` twice, unpacks
// the copies at two different depths (/tmp/a and /tmp/b/deeper) inside a Linux container, runs `npm ci --ignore-scripts` and
// `npm run build` in each, then compares every file under dist/ by SHA-256. It prints one line per file (equal or differing)
// and exits 1 when any file differs or exists in only one copy. Nothing is written to the checkout's dist/.
//
// Usage: node tools/check-build-repro.mjs [--image node:24.22.0-bookworm]
// Needs git and a running Docker engine on the host. Only the archive of HEAD is built, so uncommitted changes are not covered.
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const selfPath = fileURLToPath(import.meta.url);
const DEFAULT_IMAGE = 'node:24.22.0-bookworm';
const COPIES = ['/tmp/a', '/tmp/b/deeper'];
const BUILD_ENV = { ...process.env, NODE_OPTIONS: '--max-old-space-size=6144', CI: 'true', npm_config_fetch_retries: '6', npm_config_fetch_retry_mintimeout: '3000', npm_config_maxsockets: '4' };

/** Runs a child with a fixed argument array and fails on any exit code other than 0. */
function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${cmd} ${args.join(' ')} exited with ${result.status}`);
}

/** Lists every file below dir as POSIX-style relative paths, sorted. */
function listFiles(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full, base));
    else if (entry.isFile()) out.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return out.sort();
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

/** Installs dependencies, retrying because registry connections from a container can reset; the shared npm cache keeps progress. */
function installWithRetry(cwd) {
  for (let attempt = 1; ; attempt++) {
    const result = spawnSync('npm', ['ci', '--ignore-scripts'], { cwd, env: BUILD_ENV, stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status === 0) return;
    if (attempt >= 6) throw new Error(`npm ci --ignore-scripts exited with ${result.status}`);
  }
}

/** Container side: unpack the archive into each copy, build, and compare the two dist folders. */
function inside() {
  const archive = '/work/head.tar';
  for (const dir of COPIES) {
    mkdirSync(dir, { recursive: true });
    run('tar', ['-xf', archive, '-C', dir]);
    installWithRetry(dir);
    run('npm', ['run', 'build'], { cwd: dir, env: BUILD_ENV });
  }
  const [a, b] = COPIES.map((dir) => path.join(dir, 'dist'));
  const filesA = new Set(listFiles(a));
  const filesB = new Set(listFiles(b));
  const all = [...new Set([...filesA, ...filesB])].sort();
  let differing = 0;
  for (const rel of all) {
    if (!filesA.has(rel) || !filesB.has(rel)) {
      differing++;
      console.log(`ONLY IN ${filesA.has(rel) ? COPIES[0] : COPIES[1]}  ${rel}`);
      continue;
    }
    const ha = sha256(path.join(a, rel));
    const hb = sha256(path.join(b, rel));
    const size = statSync(path.join(a, rel)).size;
    if (ha === hb) console.log(`equal      ${ha}  ${size}  ${rel}`);
    else {
      differing++;
      console.log(`DIFFERENT  ${ha}  ${hb}  ${rel}`);
    }
  }
  console.log(`${all.length} files, ${differing} differing`);
  process.exit(differing === 0 ? 0 : 1);
}

/** Host side: export HEAD to a temporary tar and run this script inside the container. */
function host() {
  const imageFlag = process.argv.indexOf('--image');
  const image = imageFlag > 0 && process.argv[imageFlag + 1] ? process.argv[imageFlag + 1] : DEFAULT_IMAGE;
  const work = mkdtempSync(path.join(tmpdir(), 'build-repro-'));
  try {
    const tarPath = path.join(work, 'head.tar');
    execFileSync('git', ['-C', root, 'archive', '--format=tar', '-o', tarPath, 'HEAD'], { stdio: 'inherit' });
    run('docker', [
      'run', '--rm',
      '-v', `${work}:/work:ro`,
      '-v', 'build-repro-npm-cache:/root/.npm',
      '-v', `${selfPath}:/check/check-build-repro.mjs:ro`,
      image,
      'node', '/check/check-build-repro.mjs', '--inside',
    ]);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

try {
  if (process.argv.includes('--inside')) inside();
  else host();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
