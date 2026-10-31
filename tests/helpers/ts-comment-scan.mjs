// Scans TypeScript text for comment blocks: a block is a run of comment-only lines (// lines or one /* */ comment).
export const HEADER_MAX = 3;
export const BLOCK_MAX = 6;
const MAGIC = /webpackChunkName|webpackIgnore|webpackPrefetch|webpackPreload|eslint-(disable|enable)|@ts-(ignore|expect-error|nocheck|check)|istanbul ignore|c8 ignore|^\s*\/\/\/\s*<reference|prettier-ignore|#__PURE__/;

/** Returns [{ start, end, lines, header }] for every comment block, magic lines excluded. */
export function commentBlocks(text) {
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let cur = null;
  let inBlock = false;
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
      if (MAGIC.test(t)) flush(); else add(i);
      if (t.includes('*/')) { inBlock = false; flush(); }
      continue;
    }
    if (t === '') { flush(); continue; }
    if (t.startsWith('#!')) continue;
    if (t.startsWith('//')) {
      if (MAGIC.test(t)) flush(); else add(i);
      continue;
    }
    if (t.startsWith('/*')) {
      flush();
      if (MAGIC.test(t)) { if (!t.includes('*/')) inBlock = true; continue; }
      add(i);
      if (t.includes('*/', 2)) flush(); else inBlock = true;
      continue;
    }
    flush();
    if (firstCode < 0) firstCode = i + 1;
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
