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

const NEWLINE = /\r\n|\n|\r/;
const USES_WORD = /(?<![A-Za-z0-9_])uses(?![A-Za-z0-9_])/;
const USES_LINE = /^ *(?:- +)?uses:[ ]*(.*)$/;
const VALUE = /^(?:"([^"]*)"|'([^']*)'|([^\s#]+))\s*(?:#\s*(.*\S))?\s*$/;
const SHA_REF = /^[^@\s]+@[0-9a-f]{40}$/;
const DOCKER_DIGEST = /^docker:\/\/[^@\s]+@sha256:[0-9a-f]{64}$/;
const COMMENT = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/;
// The only shapes a line holding the word `uses` may have.
const CANON_SHA = /^ *(?:- )?uses: [A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)+@[0-9a-f]{40} # [A-Za-z0-9][A-Za-z0-9._/-]*[ ]*$/;
const CANON_LOCAL = /^ *(?:- )?uses: \.\/[A-Za-z0-9_./-]*[ ]*$/;
const CANON_DOCKER = /^ *(?:- )?uses: docker:\/\/[A-Za-z0-9_.:/-]+@sha256:[0-9a-f]{64}(?: # [A-Za-z0-9][A-Za-z0-9._/-]*)?[ ]*$/;
const COMMENT_LINE = /^[ \t]*#/;
const RUN_BLOCK = /^( *)(- +)?run:[ ]*[|>][-+0-9]*[ ]*(?:#.*)?$/;
const RUN_LINE = /^ *(?:- +)?run:(?: |$)/;
const BLANK = /^[ \t]*$/;

/**
 * Check the text of one workflow or action file. Outside a `run:` block and a whole-line comment, a line holding the word
 * `uses` must have exactly the canonical shape; anything else fails, so a form this tool cannot read never passes.
 * @param {string} text file content
 * @param {string} [file] name used in the messages
 * @returns {string[]} one message per `uses:` that is not pinned
 */
export function checkPins(text, file = 'workflow') {
  const problems = [];
  const lines = text.split(NEWLINE);
  let blockCol = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (blockCol >= 0) {
      if (BLANK.test(line) || /^ */.exec(line)[0].length > blockCol) continue;
      blockCol = -1;
    }
    const run = RUN_BLOCK.exec(line);
    if (run) {
      blockCol = run[1].length + (run[2] ? run[2].length : 0);
      continue;
    }
    if (COMMENT_LINE.test(line) || RUN_LINE.test(line) || !USES_WORD.test(line)) continue;
    if (CANON_SHA.test(line) || CANON_LOCAL.test(line) || CANON_DOCKER.test(line)) continue;
    const where = `${file}:${i + 1}`;
    const hit = USES_LINE.exec(line);
    if (!hit) {
      problems.push(`${where}: uses key is written in a form this check cannot read`);
      continue;
    }
    const parsed = VALUE.exec(hit[1].trim());
    if (!parsed) {
      problems.push(`${where}: uses: value cannot be read`);
      continue;
    }
    const ref = parsed[1] ?? parsed[2] ?? parsed[3];
    const comment = parsed[4];
    if (ref.startsWith('docker://')) problems.push(`${where}: ${ref} is not pinned by an @sha256: digest`);
    else if (!SHA_REF.test(ref)) problems.push(`${where}: ${ref} is not pinned by a full 40-hex commit SHA`);
    else if (!comment || !COMMENT.test(comment)) problems.push(`${where}: ${ref} has no version or branch comment`);
    else problems.push(`${where}: uses cannot read this form, write it as - uses: owner/repo@<sha> # <version>`);
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
    ['quoted pin', `- uses: "owner/repo@${sha}" # v1`, 1],
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
    ['comment with extra words', `- uses: actions/checkout@${sha} # v1 and more`, 1],
    ['space before the colon', '- uses : a/b@v4', 1],
    ['double-quoted key', '- "uses": a/b@v4', 1],
    ['single-quoted key', "- 'uses': a/b@v4", 1],
    ['flow mapping', '- { uses: a/b@v4 }', 1],
    ['flow mapping after another key', '- { name: x, uses: a/b@v4 }', 1],
    ['quoted key under a name line', '  "uses": a/b@v4', 1],
    ['uses in a run line', '  run: echo uses: a/b@v4', 0],
    ['flow mapping with # in a quoted value', '- { name: "a #b", uses: a/b@v4 }', 1],
    ['pinned flow mapping with # in a quoted value', `- { name: "a #b", uses: a/b@${sha} # v1 }`, 1],
    ['explicit key', '- ? uses\n  : a/b@v4', 1],
    ['anchored key', '- &k uses: a/b@v4', 1],
    ['tagged key', '- !!str uses: a/b@v4', 1],
    ['bare CR before uses', '- name: x\ruses: a/b@v4', 1],
    ['value on the next line', '- uses:\n    a/b@v4', 1],
    ['folded value', '- uses: >\n    a/b@v4', 1],
    ['alias value', '- uses: *x', 1],
    ['key alone in a multi-line flow mapping', '- {\n    uses: a/b@v4\n  }', 1],
    ['sequence holding a flow mapping', '- [{ uses: a/b@v4 }]', 1],
    ['uses in a name', '- name: this uses a cache', 1],
    ['uses in a run block', '- run: |\n    echo uses: a/b@v4\n    uses: x\n- name: x', 0],
    ['uses after a run block ends', '- run: |\n    echo hi\n  uses: a/b@v4', 1],
    ['uses in a whole-line comment', '  # uses: a/b@v4', 0],
    ['trailing comment keeps its text', `- uses: a/b@${sha} # v1 uses x`, 1],
    ['tab before the key', '-\tuses: a/b@v4', 1],
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
  if (!files) {
    process.stderr.write(`check-action-pins: no workflow files found under ${root}\n`);
    process.exit(1);
  }
  if (problems.length) {
    for (const p of problems) process.stderr.write(`${p}\n`);
    process.stderr.write(`check-action-pins: ${problems.length} unpinned action(s) in ${files} file(s)\n`);
    process.exit(1);
  }
  process.stdout.write(`check-action-pins: ${files} file(s), every uses: is pinned by a full commit SHA with a version comment\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) main(process.argv.slice(2));
