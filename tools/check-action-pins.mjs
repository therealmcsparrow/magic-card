// Pinned-action check. Every `uses:` in .github/workflows/*.y*ml and .github/actions/**/action.y*ml must name its action by a
// full 40-character lowercase commit SHA followed by a comment that names the version (`# v7.0.1`, `# 22.5.0`) or the branch
// (`# main`). A tag or branch ref fails, because it can be moved after review. `./` local actions are skipped, a `docker://`
// image needs an `@sha256:` digest, and the tool only reads files.
//
// Usage: node tools/check-action-pins.mjs [root]    scan the workflows under root (default: the repository)
//        node tools/check-action-pins.mjs --selftest    the rule against synthetic workflow text
import { readdirSync, readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import process from 'node:process';

const USES_LINE = /^\s*(?:-\s+)?uses:\s*(.*)$/;
const VALUE = /^(?:"([^"]*)"|'([^']*)'|([^\s#]+))\s*(?:#\s*(.*\S))?\s*$/;
const SHA_REF = /^[^@\s]+@[0-9a-f]{40}$/;
const DOCKER_DIGEST = /^docker:\/\/[^@\s]+@sha256:[0-9a-f]{64}$/;
const COMMENT = /^[A-Za-z0-9][A-Za-z0-9._/+-]*(?:\s.*)?$/;

/**
 * Check the text of one workflow or action file.
 * @param {string} text file content
 * @param {string} [file] name used in the messages
 * @returns {string[]} one message per `uses:` that is not pinned
 */
export function checkPins(text, file = 'workflow') {
  const problems = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const hit = USES_LINE.exec(lines[i]);
    if (!hit) continue;
    const where = `${file}:${i + 1}`;
    const parsed = VALUE.exec(hit[1].trim());
    if (!parsed) {
      problems.push(`${where}: uses: value cannot be read`);
      continue;
    }
    const ref = parsed[1] ?? parsed[2] ?? parsed[3];
    const comment = parsed[4];
    if (ref.startsWith('./')) continue;
    if (ref.startsWith('docker://')) {
      if (!DOCKER_DIGEST.test(ref)) problems.push(`${where}: ${ref} is not pinned by an @sha256: digest`);
      continue;
    }
    if (!SHA_REF.test(ref)) {
      problems.push(`${where}: ${ref} is not pinned by a full 40-hex commit SHA`);
      continue;
    }
    if (!comment || !COMMENT.test(comment)) problems.push(`${where}: ${ref} has no version or branch comment`);
  }
  return problems;
}

function readdirSafe(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (err && err.code === 'ENOENT') return [];
    throw err;
  }
}

function listFiles(root) {
  const found = [];
  const wf = path.join(root, '.github', 'workflows');
  for (const e of readdirSafe(wf)) if (e.isFile() && /\.ya?ml$/.test(e.name)) found.push(path.join(wf, e.name));
  const walk = (dir) => {
    for (const e of readdirSafe(dir)) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile() && /^action\.ya?ml$/.test(e.name)) found.push(p);
    }
  };
  walk(path.join(root, '.github', 'actions'));
  return found.sort();
}

/** Scan every workflow and action file under root; returns the messages and the file count. */
export function scan(root) {
  const files = listFiles(root);
  const problems = [];
  for (const f of files) problems.push(...checkPins(readFileSync(f, 'utf8'), path.relative(root, f).split(path.sep).join('/')));
  return { files: files.length, problems };
}

function selftest() {
  const sha = 'a'.repeat(40);
  const cases = [
    ['pinned with v comment', `- uses: actions/checkout@${sha} # v7.0.1`, 0],
    ['pinned with bare version', `      - uses: hacs/action@${sha} # 22.5.0`, 0],
    ['pinned with branch comment', `  uses: owner/repo@${sha} # main`, 0],
    ['quoted pin', `- uses: "owner/repo@${sha}" # v1`, 0],
    ['local action', '- uses: ./.github/actions/setup', 0],
    ['docker with digest', `- uses: docker://alpine@sha256:${'b'.repeat(64)}`, 0],
    ['commented-out line', '# - uses: actions/checkout@v4', 0],
    ['version tag', '- uses: actions/checkout@v4', 1],
    ['branch ref', '- uses: actions/checkout@main', 1],
    ['short sha', '- uses: actions/checkout@3d3c42e # v7', 1],
    ['uppercase sha', `- uses: actions/checkout@${'A'.repeat(40)} # v7`, 1],
    ['sha without comment', `- uses: actions/checkout@${sha}`, 1],
    ['sha with empty comment', `- uses: actions/checkout@${sha} #`, 1],
    ['docker by tag', '- uses: docker://alpine:3.20', 1],
    ['no ref at all', '- uses: actions/checkout', 1],
  ];
  let bad = 0;
  for (const [name, text, expected] of cases) {
    const got = checkPins(text).length;
    if (got !== expected) {
      process.stderr.write(`selftest FAIL: ${name} (expected ${expected} problems, got ${got})\n`);
      bad++;
    }
  }
  if (bad) process.exit(1);
  process.stdout.write(`check-action-pins selftest: ${cases.length} cases ok\n`);
}

function main(argv) {
  if (argv.includes('--selftest')) return selftest();
  const here = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(argv.find((a) => !a.startsWith('--')) ?? path.join(here, '..'));
  const { files, problems } = scan(root);
  if (problems.length) {
    for (const p of problems) process.stderr.write(`${p}\n`);
    process.stderr.write(`check-action-pins: ${problems.length} unpinned action(s) in ${files} file(s)\n`);
    process.exit(1);
  }
  process.stdout.write(`check-action-pins: ${files} file(s), every uses: is pinned by a full commit SHA with a version comment\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) main(process.argv.slice(2));
