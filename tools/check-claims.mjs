// Claims scan: speed and size claims in README.md, documentation/**/*.md and CHANGELOG.md must be backed by evidence in the same place.
// - a speed claim (faster, quicker, sooner, speeds up, snappier next to a load word) links to documentation/loading-and-size/tablet-baseline.md,
//   and that file exists
// - a size claim (a figure with a comparative and a download word) names a release (YYYY.MM.NN, optionally -beta.N) and says both gzip and brotli
// The scan unit is a list item, a table row or one sentence of any other paragraph. Headings and fenced code are skipped. A finding gives
// the unit's first line. CHANGELOG.md is read from the top through the 2026.10.12-beta.12 section.
// Usage: node tools/check-claims.mjs [--root <dir>] | --self-test
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { posix, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const BASELINE = 'documentation/loading-and-size/tablet-baseline.md';
const CHANGELOG_LAST = '## 2026.10.12-beta.12';

const SPEED = /\b(?:faster|quicker|sooner|snappier|speeds?\s+up)\b/i;
const LOAD =
  /\b(?:loads|loaded|loading|to\s+load|downloads?|downloaded|start-?up|renders|opens|card\s+file|main\s+file)\b/i;
const BYTES = /(?<![\w.])-?\d[\d,]*(?:\.\d+)?\s?(?:bytes?|B|KB|kB|KiB|MB|MiB)\b/i;
const PERCENT = /(?<![\w.])-?\d[\d,]*(?:\.\d+)?\s?%/;
const TIMES = /(?<![\w.])\d+(?:\.\d+)?x\b/i;
const COMPARATIVE = /\b(?:smaller|less|saves|saving|shrinks|shrunk)\b/i;
const DOWNLOAD = /\b(?:downloads?|downloaded|gzip|brotli|card\s+file|main\s+file)\b|magic-card[\w.-]*\.js\b/i;
const RELEASE = /\b\d{4}\.\d{2}\.\d{2}(?:-beta\.\d+)?\b/;
const GZIP = /\bgzip\b/i;
const BROTLI = /\bbrotli\b/i;

const LIST_START = /^\s*(?:[-*+]|\d{1,9}[.)])\s+/;
const HEADING = /^\s{0,3}#{1,6}(?:\s|$)/;
const FENCE = /^\s*(`{3,}|~{3,})/;
const SENTENCE_END = /[.!?][)"'*_\]]*(?=\s+[A-Z]|\s*$)/g;

/** Positions [start, end) of the inline code spans in a text; a run of backticks closes at the next run of the same length. */
function codeSpans(text) {
  const spans = [];
  const noCloser = new Set();
  let i = 0;
  while (i < text.length) {
    if (text[i] !== '`') {
      i++;
      continue;
    }
    let n = 1;
    while (text[i + n] === '`') n++;
    const close = noCloser.has(n) ? -1 : text.indexOf('`'.repeat(n), i + n);
    if (close === -1) {
      noCloser.add(n);
      i += n;
    } else {
      spans.push([i, close + n]);
      i = close + n;
    }
  }
  return spans;
}

/** Inline links and reference links of a text: { start, end, target } with the target raw (reference ids are looked up by the caller). */
function links(text) {
  const found = [];
  let pos = 0;
  for (;;) {
    const mid = text.indexOf('](', pos);
    const ref = text.indexOf('][', pos);
    const at = mid === -1 ? ref : ref === -1 ? mid : Math.min(mid, ref);
    if (at === -1) break;
    pos = at + 2;
    let open = at - 1;
    while (open >= (found.length ? found[found.length - 1].end : 0) && text[open] !== '[') open--;
    if (open < 0 || text[open] !== '[') continue;
    const inline = text.startsWith('](', at);
    const close = text.indexOf(inline ? ')' : ']', at + 2);
    if (close === -1) continue;
    const raw = text.slice(at + 2, close).trim();
    found.push({ start: open, end: close + 1, target: raw, ref: !inline, text: text.slice(open + 1, at) });
    pos = close + 1;
  }
  return found;
}

/** The text of a unit with link targets blanked, so a path such as documentation/loading-and-size/ does not read as a load word. */
function prose(text) {
  let out = '';
  let last = 0;
  for (const l of links(text)) {
    out += text.slice(last, l.start) + '[' + l.text + ']';
    last = l.end;
  }
  out += text.slice(last);
  return out.replace(/\bhref="[^"]*"/gi, '').replace(/<(?:https?:)[^>\s]*>/g, ' ');
}

/** Link targets of a unit as repo-relative paths (null for an external or unresolvable target). */
function linkTargets(text, file, refs) {
  const out = [];
  const add = (raw) => {
    let target = raw.split(/[#?]/)[0];
    if (!target || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) return;
    try {
      target = decodeURI(target);
    } catch {
      return;
    }
    out.push(posix.normalize(posix.join(posix.dirname(file), target)));
  };
  for (const l of links(text)) {
    const raw = l.ref ? (refs.get((l.target || l.text).toLowerCase()) ?? '') : l.target;
    add(raw.replace(/^<|>$/g, '').split(/\s/)[0]);
  }
  for (const m of text.matchAll(/\bhref="([^"]*)"/gi)) add(m[1]);
  return out;
}

/** The units of a document: { line, text } for each list item, table row and paragraph sentence outside headings and fenced code. */
function units(lines, firstLine) {
  const out = [];
  let fence = null;
  let block = null;

  const sentences = (parts) => {
    const joined = parts.map((p) => p.text).join(' ');
    const starts = [];
    let offset = 0;
    for (const p of parts) {
      starts.push(offset);
      offset += p.text.length + 1;
    }
    const masked = Array.from(joined);
    for (const [a, b] of codeSpans(joined)) masked.fill('x', a, b);
    for (const l of links(joined)) masked.fill('x', l.start, l.end);
    const flat = masked.join('');
    let from = 0;
    const emit = (to) => {
      const text = joined.slice(from, to).trim();
      if (text) {
        const at = from + joined.slice(from, to).search(/\S/);
        let k = 0;
        while (k + 1 < starts.length && starts[k + 1] <= at) k++;
        out.push({ line: parts[k].line, text });
      }
      from = to;
    };
    for (const m of flat.matchAll(SENTENCE_END)) emit(m.index + m[0].length);
    emit(joined.length);
  };

  const flush = () => {
    if (!block) return;
    if (block.kind === 'item') out.push({ line: block.parts[0].line, text: block.parts.map((p) => p.text).join(' ') });
    else sentences(block.parts);
    block = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/^(?:\s*>)+\s?/, '');
    const no = firstLine + i;
    const fenceMark = FENCE.exec(line);
    if (fence) {
      if (fenceMark && fenceMark[1][0] === fence[0] && fenceMark[1].length >= fence.length && !/\S/.test(line.slice(fenceMark[0].length))) fence = null;
      continue;
    }
    if (fenceMark) {
      flush();
      fence = fenceMark[1];
      continue;
    }
    if (!line.trim()) {
      const next = lines.slice(i + 1).find((l) => l.trim());
      if (!(block?.kind === 'item' && next && /^\s{2,}\S/.test(next) && !LIST_START.test(next))) flush();
      continue;
    }
    if (HEADING.test(line)) {
      flush();
      continue;
    }
    if (/^\s*\|/.test(line)) {
      flush();
      out.push({ line: no, text: line.trim() });
      continue;
    }
    if (LIST_START.test(line)) {
      flush();
      block = { kind: 'item', parts: [{ line: no, text: line.trim() }] };
      continue;
    }
    if (block) block.parts.push({ line: no, text: line.trim() });
    else block = { kind: 'para', parts: [{ line: no, text: line.trim() }] };
  }
  flush();
  return out;
}

/** Reference link definitions of a document: lowercase id -> target. */
function definitions(lines) {
  const refs = new Map();
  for (const line of lines) {
    const m = /^\s{0,3}\[([^\]]{1,200})\]:\s*(\S+)/.exec(line);
    if (m) refs.set(m[1].toLowerCase(), m[2]);
  }
  return refs;
}

/**
 * Claims in one document: { claims: [{ file, line, kind, ok, message }], findings: [string] }.
 * `file` is the repo-relative path (forward slashes), `exists(path)` tells whether a repo-relative file exists.
 */
export function scan(file, text, exists) {
  const claims = [];
  const findings = [];
  let lines = text.split(/\r?\n/);
  const firstLine = 1;
  if (file === 'CHANGELOG.md') {
    const last = lines.findIndex((l) => l.startsWith(CHANGELOG_LAST));
    if (last === -1) {
      findings.push(`${file}:1 the "${CHANGELOG_LAST.slice(3)}" section is missing, so the part of the changelog to read has no end`);
      return { claims, findings };
    }
    let end = lines.findIndex((l, i) => i > last && /^## /.test(l));
    if (end === -1) end = lines.length;
    lines = lines.slice(0, end);
  }
  const refs = definitions(lines);
  for (const unit of units(lines, firstLine)) {
    const words = prose(unit.text);
    const where = `${file}:${unit.line}`;
    if (SPEED.test(words) && LOAD.test(words)) {
      const targets = linkTargets(unit.text, file, refs).filter((t) => t === BASELINE);
      let message = null;
      if (!targets.length) message = `${where} speed claim without a link to ${BASELINE}`;
      else if (!exists(BASELINE)) message = `${where} speed claim links to ${BASELINE}, which does not exist`;
      claims.push({ file, line: unit.line, kind: 'speed', ok: message === null, message });
      if (message) findings.push(message);
    }
    const figure = BYTES.test(words) || PERCENT.test(words) || TIMES.test(words);
    if (figure && COMPARATIVE.test(words) && DOWNLOAD.test(words)) {
      const missing = [];
      if (!RELEASE.test(words)) missing.push('a release name (YYYY.MM.NN)');
      if (!GZIP.test(words)) missing.push('gzip');
      if (!BROTLI.test(words)) missing.push('brotli');
      const message = missing.length ? `${where} size claim is missing ${missing.join(', ')}` : null;
      claims.push({ file, line: unit.line, kind: 'size', ok: message === null, message });
      if (message) findings.push(message);
    }
  }
  return { claims, findings };
}

/** Markdown files under a directory, as repo-relative paths. */
function markdownUnder(root, dir) {
  const out = [];
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) out.push(...markdownUnder(root, rel));
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(rel);
  }
  return out;
}

/** Findings for a whole tree. */
export function check(root) {
  const exists = (rel) => existsSync(join(root, rel));
  const files = ['README.md', 'CHANGELOG.md'];
  if (exists('documentation')) files.push(...markdownUnder(root, 'documentation').sort());
  const findings = [];
  for (const file of files) {
    if (!exists(file)) {
      findings.push(`${file}:1 the file is missing`);
      continue;
    }
    findings.push(...scan(file, readFileSync(join(root, file), 'utf8'), exists).findings);
  }
  return findings;
}

const LOADING = 'documentation/loading-and-size/README.md';

// Each fixture is scanned as `file`; `expect` is 'none' (not a claim), 'pass' (every claim passes) or 'fail' (a finding contains `has`).
const FIXTURES = [
  {
    name: 'the device row of the configuration table is not a claim',
    file: 'README.md',
    text: '| `device` | `auto` picks an animation from the entity: a fan spins faster at a higher speed, a light glows in its colour, a thermostat shows a flame while heating and snow while cooling, a washer drum turns, a cover swings while it moves, a playing media player shows an equalizer, and an alarm pulses. Or force one of `spin`, `glow`, `flame`, `drum`, `swing`, `pulse`, `snow`, `shake`, `eq`; a forced animation pauses while the entity is off or unavailable. |',
    expect: 'none',
  },
  {
    name: 'animation text about the house load is not a claim',
    file: 'documentation/gallery/dashboards/19-rolling-city/README.md',
    text: "- City engine (showpiece): four pistons and two cogs that run faster as the house load rises, a flickering furnace with embers, and the speed in mph worked out from the house load. Below it: solar, house load, battery and grid, plus today's energy and the price.",
    expect: 'none',
  },
  {
    name: 'a size limit that names no download word is not a claim (8 MB and 256 KiB)',
    file: 'documentation/images/editor.md',
    text: 'If the file or text cannot be opened, the window stays open and says why in one line under the tiles, for example "That file is too big to open (over 8 MB). Try a smaller copy.", "That SVG is too big to open (over 8 MB). Try a smaller copy." or "That drawing is over 256 KiB." Nothing changes, your pasted text stays in the box, and the focus goes back to the button you used. A file or text can be up to 8 MB to be opened, but the cleaned drawing must still fit in 256 KiB, like every image.',
    expect: 'none',
  },
  {
    name: 'a limit written as "256 KiB or less" is not a claim',
    file: 'documentation/presets/export-and-import.md',
    text: 'The file is cleaned like every image: scripts, event handlers, links to other sites and embedded pictures are removed and listed in the summary, and a file with a document type that declares its own entities is refused. An .svg file can be up to 8 MB to be read, but the cleaned image must be 256 KiB or less, like every image. The image editor gives the same result when you open the same file there.',
    expect: 'none',
  },
  {
    name: 'a limit that names a download word is checked as a size claim',
    file: 'documentation/images/editor.md',
    text: 'The main file must stay at 256 KiB or less.',
    expect: 'fail',
    has: 'size claim is missing a release name',
  },
  {
    name: 'the beta.12 bullet "Plain cards load faster" fails without the baseline link',
    file: 'README.md',
    text: '-   **Plain cards load faster.** The main file is smaller, because code that only some cards use now sits in two shared files, `magic-card-history.js` and `magic-card-shape-path.js`. A plain card still loads nothing else. A card that needs one of them fetches it with its own feature file. See [Loading and updates](documentation/loading-and-size/README.md).',
    expect: 'fail',
    has: 'speed claim without a link to documentation/loading-and-size/tablet-baseline.md',
  },
  {
    name: 'the 2026.10.11 flow lines bullet fails without a release, gzip and brotli',
    file: LOADING,
    text: '-   **Flow lines** (`magic-card-flows.js`). Cards without flows download about 8.8 KB less with gzip.',
    expect: 'fail',
    has: 'size claim is missing a release name (YYYY.MM.NN), brotli',
  },
  {
    name: 'a size sentence with a release and gzip but no brotli fails',
    file: LOADING,
    text: 'The main file of 2026.10.12-beta.11 is 73,082 B smaller with gzip.',
    expect: 'fail',
    has: 'size claim is missing brotli',
  },
  {
    name: 'a size sentence with gzip and brotli but no release fails',
    file: LOADING,
    text: 'The main file is 4 KiB smaller with gzip and 3 KiB smaller with brotli.',
    expect: 'fail',
    has: 'size claim is missing a release name',
  },
  {
    name: 'a speed sentence that links to the tablet baseline passes',
    file: LOADING,
    text: 'The plain card loads faster, see the [tablet baseline](tablet-baseline.md#results).',
    exists: [BASELINE],
    expect: 'pass',
  },
  {
    name: 'a speed sentence that links to the tablet baseline fails while the file is missing',
    file: LOADING,
    text: 'The plain card loads faster, see the [tablet baseline](tablet-baseline.md).',
    exists: [],
    expect: 'fail',
    has: 'which does not exist',
  },
  {
    name: 'a link to another page does not back a speed claim',
    file: LOADING,
    text: 'The plain card loads faster, see [the guide](README.md).',
    exists: [BASELINE],
    expect: 'fail',
    has: 'speed claim without a link',
  },
  {
    name: 'a link is resolved from the scanned file',
    file: 'README.md',
    text: 'The plain card loads faster, see [the baseline](tablet-baseline.md).',
    exists: [BASELINE],
    expect: 'fail',
    has: 'speed claim without a link',
  },
  {
    name: 'a link from the root resolves to the baseline',
    file: 'README.md',
    text: 'The plain card loads faster, see [the baseline](documentation/loading-and-size/tablet-baseline.md).',
    exists: [BASELINE],
    expect: 'pass',
  },
  {
    name: 'a reference-style link backs a speed claim',
    file: 'README.md',
    text: 'The plain card loads faster, see [the baseline][base].\n\n[base]: documentation/loading-and-size/tablet-baseline.md',
    exists: [BASELINE],
    expect: 'pass',
  },
  {
    name: 'an external link to the baseline name does not back a speed claim',
    file: LOADING,
    text: 'The plain card loads faster, see [it](https://example.com/tablet-baseline.md).',
    exists: [BASELINE],
    expect: 'fail',
    has: 'speed claim without a link',
  },
  {
    name: 'speed and load words match in any case',
    file: LOADING,
    text: 'The Card File LOADS FASTER now.',
    expect: 'fail',
    has: 'speed claim',
  },
  {
    name: 'speed words match whole words only',
    file: LOADING,
    text: 'Fasterness of the main file startups is not measured; the loader preloads it.',
    expect: 'none',
  },
  {
    name: 'a speed word with "speeds up" and "start-up" is a claim',
    file: LOADING,
    text: 'This speeds up start-up.',
    expect: 'fail',
    has: 'speed claim',
  },
  {
    name: 'a path in a link target is not a load word',
    file: LOADING,
    text: 'The fan spins faster, see [the page](documentation/loading-and-size/README.md).',
    expect: 'none',
  },
  {
    name: 'a byte figure with a thousands separator is read',
    file: LOADING,
    text: 'The main file is 73,082 B less.',
    expect: 'fail',
    has: 'size claim is missing',
  },
  {
    name: 'a KiB figure is read',
    file: LOADING,
    text: 'This saves 62 KiB when you download the card file.',
    expect: 'fail',
    has: 'size claim is missing',
  },
  {
    name: 'a percentage figure is read',
    file: LOADING,
    text: 'The download is -40% smaller.',
    expect: 'fail',
    has: 'size claim is missing',
  },
  {
    name: 'a multiplier figure is read',
    file: LOADING,
    text: 'The download is 2x smaller.',
    expect: 'fail',
    has: 'size claim is missing',
  },
  {
    name: 'a figure with no comparative is not a claim',
    file: LOADING,
    text: 'The main file is 73,082 B with gzip.',
    expect: 'none',
  },
  {
    name: 'size words match in any case',
    file: LOADING,
    text: 'The DOWNLOAD is 5 KB SMALLER with GZIP.',
    expect: 'fail',
    has: 'size claim is missing',
  },
  {
    name: 'size words match whole words only',
    file: LOADING,
    text: 'The downloader is 5 KB, a lessening of the gzipped file.',
    expect: 'none',
  },
  {
    name: 'a size bullet with the release, gzip and brotli passes',
    file: LOADING,
    text: '-   **Main file.** In 2026.10.12-beta.11 the main file is 73,082 B with gzip and 62,535 B with brotli, 4,096 B smaller than before.',
    expect: 'pass',
  },
  {
    name: 'a size sentence with a beta-free release name passes',
    file: LOADING,
    text: 'In 2026.10.11 the download is 8,800 B less with gzip and 7,900 B less with brotli.',
    expect: 'pass',
  },
  {
    name: 'a size bullet reads its continuation lines',
    file: LOADING,
    text: '-   **Main file.** The download is 5 KB smaller\n    in 2026.10.12-beta.11 with gzip\n    and with brotli.',
    expect: 'pass',
  },
  {
    name: 'a finding gives the first line of a bullet that spreads over lines',
    file: LOADING,
    text: 'First paragraph.\n\n-   **Faster.** The first line.\n    The main file loads here.',
    expect: 'fail',
    has: `${LOADING}:3 `,
  },
  {
    name: 'a paragraph is read one sentence at a time',
    file: LOADING,
    text: 'The card is nice. It also loads faster. It opens at home.',
    expect: 'fail',
    has: `${LOADING}:1 speed claim`,
  },
  {
    name: 'a speed word and a load word in two sentences of one paragraph are not a claim',
    file: LOADING,
    text: 'The animation runs faster. The page loads at once.',
    expect: 'none',
  },
  {
    name: 'a sentence does not end inside a number',
    file: LOADING,
    text: 'The download is about 8.8 KB smaller with gzip in 2026.10.11 and with brotli.',
    expect: 'pass',
  },
  {
    name: 'a sentence does not end inside a code span or a link',
    file: LOADING,
    text: 'The `a. B` main file is faster [x. Y](README.md) at startup.',
    expect: 'fail',
    has: 'speed claim',
  },
  {
    name: 'a table row is one unit',
    file: LOADING,
    text: '| Card | Note |\n| --- | --- |\n| plain | loads faster. Really. |',
    expect: 'fail',
    has: `${LOADING}:3 `,
  },
  {
    name: 'a heading is skipped',
    file: LOADING,
    text: '## Loads faster with a 5 KB smaller download',
    expect: 'none',
  },
  {
    name: 'fenced code is skipped',
    file: LOADING,
    text: '```\nThe card loads faster.\n```\n\n~~~md\nThe download is 5 KB smaller.\n~~~',
    expect: 'none',
  },
  {
    name: 'a block quote is read',
    file: LOADING,
    text: '> The card loads faster.',
    expect: 'fail',
    has: 'speed claim',
  },
  {
    name: 'the changelog is read through the beta.12 section',
    file: 'CHANGELOG.md',
    text: [
      '# Changelog',
      '',
      '## Unreleased',
      '- The card loads faster.',
      '',
      '## 2026.10.12-beta.12 (2026-10-29)',
      '- The card opens faster.',
      '',
      '## 2026.10.12-beta.11 (2026-10-28)',
      '- The card loads faster.',
    ].join('\n'),
    expect: 'fail',
    has: 'CHANGELOG.md:7 speed claim',
    count: 2,
  },
  {
    name: 'a changelog without the beta.12 section fails',
    file: 'CHANGELOG.md',
    text: '# Changelog\n\n## Unreleased\n- Nothing.\n\n## 2026.10.12-beta.11 (2026-10-28)\n- Nothing.',
    expect: 'fail',
    has: 'section is missing',
  },
  {
    name: 'a changelog that ends with the beta.12 section is read to its end',
    file: 'CHANGELOG.md',
    text: '# Changelog\n\n## 2026.10.12-beta.12 (2026-10-29)\n- The card loads faster.',
    expect: 'fail',
    has: 'CHANGELOG.md:4 speed claim',
  },
];

function selfTest() {
  let bad = 0;
  for (const f of FIXTURES) {
    const has = new Set(f.exists ?? [BASELINE]);
    const { claims, findings } = scan(f.file, f.text, (rel) => has.has(rel));
    let good;
    if (f.expect === 'none') good = claims.length === 0 && findings.length === 0;
    else if (f.expect === 'pass') good = claims.length > 0 && findings.length === 0;
    else good = findings.some((m) => m.includes(f.has)) && (f.count === undefined || findings.length === f.count);
    console.log(`${good ? 'ok  ' : 'FAIL'} selftest: ${f.name}${good ? '' : ' -> ' + JSON.stringify({ claims, findings })}`);
    if (!good) bad++;
  }
  if (bad) process.exit(1);
  console.log('ok   claims scan self-test');
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = args.includes('--root') ? args[args.indexOf('--root') + 1] : ROOT;
  const findings = check(root);
  for (const f of findings) console.error(`FAIL ${f}`);
  if (findings.length) process.exit(1);
  console.log('ok   every speed claim links to the tablet baseline and every size claim names a release, gzip and brotli');
}
