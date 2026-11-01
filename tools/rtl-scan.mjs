// Fails on a physical left/right declaration in a css`` literal of the files it is given, unless the two-value logical
// shorthand follows it in the same rule or the declaration ends with the comment /* physical */.
//   node tools/rtl-scan.mjs [file ...]    default: the editor folders and src/css/editor-*.ts
import { readdirSync, readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = realpathSync(path.resolve(import.meta.dirname, '..'));

// Physical property -> the exact logical properties that answer it later in the same rule. A one-side longhand does not.
const LOGICAL = [
  [/^(left|right)$/, ['inset-inline']],
  [/^margin-(left|right)$/, ['margin-inline']],
  [/^padding-(left|right)$/, ['padding-inline']],
  [/^border-(left|right)(-(width|style|color))?$/, ['border-inline', 'border-inline-width', 'border-inline-style', 'border-inline-color']],
];
const EDITOR_DIRS = ['src/ui-kit', 'src/editor', 'src/anim-studio', 'src/theme-editor', 'src/svg-editor', 'src/shape-editor', 'src/path-canvas', 'src/image-editor', 'src/image-tools', 'src/transfer', 'src/look-editor'];
const VALUE_SIDES = { 'text-align': /^(left|right)\b/, float: /^(left|right)\b/, clear: /^(left|right)\b/ };
const VALUE_LOGICAL = { 'text-align': /^(start|end)\b/ };

/** The body of each css`` literal in `source`, with ${} replaced by 0, and the offset it starts at. */
function cssLiterals(source) {
  const out = [];
  const open = /(?<![\w$.])css\s*`/g;
  let m;
  while ((m = open.exec(source))) {
    const start = m.index + m[0].length;
    let i = start;
    let body = '';
    while (i < source.length && source[i] !== '`') {
      if (source[i] === '\\') {
        body += source.slice(i, i + 2);
        i += 2;
      } else if (source[i] === '$' && source[i + 1] === '{') {
        let depth = 1;
        let j = i + 2;
        while (j < source.length && depth > 0) {
          if (source[j] === '{') depth++;
          else if (source[j] === '}') depth--;
          else if (source[j] === '`') {
            j++;
            while (j < source.length && source[j] !== '`') j += source[j] === '\\' ? 2 : 1;
          }
          j++;
        }
        body += '0' + source.slice(i, j).replace(/[^\n]/g, '');
        i = j;
      } else {
        body += source[i++];
      }
    }
    out.push({ body, start });
  }
  return out;
}

/** Declarations of every rule in a stylesheet body: { prop, value, offset, physical, rule } with rule an id per block. */
function declarations(body) {
  const decls = [];
  const stack = [0];
  let nextRule = 1;
  let text = '';
  let textStart = 0;
  let last = null;
  let lastEnd = -1;
  let pending = false;
  const flush = (end) => {
    const t = text.trim();
    if (t) {
      const c = t.indexOf(':');
      if (c > 0) {
        const lead = text.length - text.trimStart().length;
        last = { prop: t.slice(0, c).trim().toLowerCase(), value: t.slice(c + 1).trim().toLowerCase(), offset: textStart + lead, physical: false, rule: stack[stack.length - 1] };
        decls.push(last);
        lastEnd = end;
      }
    }
    text = '';
  };
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === '/' && body[i + 1] === '*') {
      const close = body.indexOf('*/', i + 2);
      const stop = close < 0 ? body.length : close;
      const mark = /^\s*physical\s*$/.test(body.slice(i + 2, stop));
      if (mark) {
        if (text.trim()) {
          pending = true;
        } else if (last && !body.slice(lastEnd, i).includes('\n')) {
          last.physical = true;
        }
      }
      i = stop + 1;
    } else if (ch === '{') {
      text = '';
      stack.push(nextRule++);
    } else if (ch === '}') {
      flush(i);
      stack.pop();
    } else if (ch === ';') {
      flush(i + 1);
      if (pending) {
        if (last) last.physical = true;
        pending = false;
      }
    } else {
      if (!text.trim()) textStart = i;
      text += ch;
    }
  }
  flush(body.length);
  if (pending && last) last.physical = true;
  return decls;
}
/** Violations in one source text: [{ line, text }]. */
export function scanSource(source) {
  const found = [];
  for (const { body, start } of cssLiterals(source)) {
    const decls = declarations(body);
    decls.forEach((d, idx) => {
      if (d.physical) return;
      const later = decls.slice(idx + 1).filter((o) => o.rule === d.rule);
      let physical = false;
      for (const [re, logical] of LOGICAL) {
        if (re.test(d.prop)) physical = !later.some((o) => logical.includes(o.prop));
      }
      const side = VALUE_SIDES[d.prop];
      if (side?.test(d.value)) {
        const ok = VALUE_LOGICAL[d.prop];
        physical = !(ok && later.some((o) => o.prop === d.prop && ok.test(o.value)));
      }
      if (!physical) return;
      const at = start + d.offset;
      found.push({ line: source.slice(0, at).split('\n').length, text: `${d.prop}: ${d.value}` });
    });
  }
  return found;
}

function listTs(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? listTs(p) : e.name.endsWith('.ts') ? [p] : [];
  });
}

/** The default scan list: the editor folders and the src/css/editor-*.ts sheets. */
export function editorFiles() {
  const css = path.join(ROOT, 'src/css');
  const sheets = readdirSync(css).filter((n) => /^editor-.*\.ts$/.test(n)).map((n) => path.join(css, n));
  return [...EDITOR_DIRS.flatMap((d) => listTs(path.join(ROOT, d))), ...sheets];
}

/** True when a path relative to the repo root leaves it, on any drive. */
function outsideRoot(rel) {
  return rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel);
}

/** Scans repo files; returns [{ file, line, text }]. A path outside the repo is refused. */
export function scanFiles(files) {
  const out = [];
  for (const f of files) {
    const abs = path.resolve(ROOT, f);
    if (outsideRoot(path.relative(ROOT, realpathSync(abs)))) throw new Error(`rtl-scan reads repo files only: ${f}`);
    for (const v of scanSource(readFileSync(abs, 'utf8'))) out.push({ file: path.relative(ROOT, abs).split(path.sep).join('/'), ...v });
  }
  return out;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const hits = scanFiles(args.length ? args : editorFiles());
  for (const h of hits) console.error(`${h.file}:${h.line}: physical ${h.text}`);
  if (hits.length) {
    console.error(`rtl-scan: ${hits.length} physical left/right declaration(s)`);
    process.exit(1);
  }
  console.log('rtl-scan: clean');
}
