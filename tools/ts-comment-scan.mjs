// Scans TypeScript text for comment blocks: a block is a run of comment-only lines (// lines or one /* */ comment).
export const HEADER_MAX = 3;
export const BLOCK_MAX = 6;
const DIRECTIVE = /^(?:\/\/+|\/\*+|\*)\s*(?:webpackChunkName|webpackIgnore|webpackPrefetch|webpackPreload|eslint-(?:disable|enable)|@ts-(?:ignore|expect-error|nocheck|check)|istanbul ignore|c8 ignore|prettier-ignore|#__PURE__)|^\/\/\/\s*<reference/;
const IMPORT_START = /^(?:import(?!\s*\()\b|export\s+(?:type\s+)?(?:\*|\{)[^;]*\bfrom\b|export\s+(?:type\s+)?(?:\*|\{)\s*$)/;
const IMPORT_END = /['"]\s*(?:with\s*\{[^}]*\}\s*)?;?\s*(?:\/\/.*)?$/;

/** Blanks the contents of single-line string and template literals so `/*` or `//` inside them is not read as a comment. */
function blankStrings(line) {
  let out = '';
  let q = '';
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '\\') { out += '  '; i++; } else if (c === q) { q = ''; out += c; } else out += ' ';
    } else {
      if (c === '"' || c === "'" || c === '`') q = c;
      out += c;
    }
  }
  return out;
}

/** Returns [{ start, end, lines, header }] for every comment block, directive lines excluded. */
export function commentBlocks(text) {
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let cur = null;
  let inBlock = false;
  let inImport = false;
  let firstCode = -1;
  const flush = () => { if (cur) { blocks.push(cur); cur = null; } };
  const add = (i) => {
    if (!cur) cur = { start: i + 1, end: i + 1, lines: 0, header: false };
    cur.end = i + 1;
    cur.lines++;
  };
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (inBlock) {
      if (DIRECTIVE.test(t)) flush(); else add(i);
      if (t.includes('*/')) { inBlock = false; flush(); }
      continue;
    }
    if (t === '') { flush(); continue; }
    if (t.startsWith('#!')) continue;
    if (t.startsWith('//')) {
      if (DIRECTIVE.test(t)) flush(); else add(i);
      continue;
    }
    if (t.startsWith('/*')) {
      flush();
      if (DIRECTIVE.test(t)) { if (!t.includes('*/')) inBlock = true; continue; }
      add(i);
      if (t.includes('*/', 2)) flush(); else inBlock = true;
      continue;
    }
    flush();
    if (inImport) {
      if (IMPORT_END.test(t)) inImport = false;
    } else if (IMPORT_START.test(t)) {
      inImport = !IMPORT_END.test(t) || /^(?:import|export)[^'"]*\{[^}]*$/.test(t);
    } else if (firstCode < 0) {
      firstCode = i + 1;
    }
    const code = blankStrings(t);
    const open = code.lastIndexOf('/*');
    if (open > 0 && !code.includes('*/', open + 2)) inBlock = true;
  }
  flush();
  const first = blocks[0];
  if (first && (firstCode < 0 || first.start < firstCode)) first.header = true;
  return blocks;
}

/** Violations: header over HEADER_MAX lines, any other block over BLOCK_MAX lines. */
export function commentViolations(text, file = '') {
  return commentBlocks(text).flatMap((b) => {
    const max = b.header ? HEADER_MAX : BLOCK_MAX;
    return b.lines > max ? [{ file, start: b.start, end: b.end, lines: b.lines, header: b.header, max }] : [];
  });
}
