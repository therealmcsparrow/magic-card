/*
 * Production-only webpack loader for the TypeScript files webpack.config.js lists: shrinks the static text of css``
 * and html`` template literals. Terser never touches template text. Only the literal parts are edited, found with the
 * TypeScript parser, so expression code inside ${} is never changed.
 *   css`...`  comments dropped, whitespace collapsed, no space around { } ; , > or after :
 *   css also drops the leading zero of decimals (0.5 becomes .5).
 *   css`...` with ${}: each ${} is swapped for a placeholder that ends in a digit (so no decimal after it loses
 *             its zero), the text is shrunk as above, and the placeholders are put back. Whitespace next to a
 *             placeholder collapses to one space like anywhere else. A template whose placeholders do not all come
 *             back once, in order, or whose text already holds the marker, is left as written.
 *   html`...` parts: any run of two or more whitespace characters becomes one space (HTML collapses
 *             them the same way), and whitespace between two tags goes when one of them is a block
 *             element, and so does whitespace between a block tag and a ${} (leading and trailing
 *             space of a block never shows), and whitespace before the > that ends a tag.
 *             Parts holding <pre or <textarea are left alone.
 * An html`` part that sets white-space: pre* (pre, pre-wrap, pre-line) is left alone: there the
 * whitespace is content. css``, whose source whitespace never reaches the page, is still shrunk, but quoted strings
 * and url() in it are copied as written: only the code around them shrinks.
 * Table files (TABLE_FILES): the keyframe and particle tables hold plain template literals as property values, with no
 * css tag. In those files every untagged template literal that is the value of an object property is shrunk like css:
 * a literal without ${} like css``, each part of a literal with ${} the same way but without the trim (a substituted
 * value can border the part on either side).
 */
const ts = require('typescript');

const TABLE_FILES = /src\/css\/(?:animation-keyframes|animation-scenes|animation-extra|scene-keyframes)\.ts$/;

const PRE_SPACE = /white-space\s*:\s*pre/i;
// comments are dropped; quoted strings and url(...) stay byte for byte (the comment comes first in the alternation, so an
// apostrophe inside a comment never opens a string); the code between them is shrunk
const CSS_TOKEN = /(\/\*[\s\S]*?\*\/|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|url\([^)]*\))/;
const minCss = (t) =>
  t
    .split(CSS_TOKEN)
    .map((piece, i) => (i % 2 ? (piece.startsWith('/*') ? '' : piece) : minCssCode(piece)))
    .join('')
    .trim();
// no trim here: the space before or after a string or url() separates two values
const minCssCode = (t) =>
  t
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/:\s+/g, ':')
    .replace(/;}/g, '}')
    .replace(/(^|[^\d.])0\.(\d)/g, '$1.$2');

// Whitespace between two tags is dropped when one of them is a block element (it would collapse there anyway).
const BLOCK = new Set(['div', 'p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'header', 'section', 'form', 'dialog']);
const B = [...BLOCK].join('|');
const edgeOpen = new RegExp('(</?(?:' + B + ')\\b[^<>]*>)\\s+$', 'i');
const edgeClose = new RegExp('^\\s+(?=</?(?:' + B + ')\\b)', 'i');
const minHtml = (t) =>
  /<pre|<textarea/i.test(t) || PRE_SPACE.test(t)
    ? t
    : t
        .replace(/\s{2,}/g, ' ')
        .replace(/(["'])\s+>/g, '$1>')
        .replace(edgeOpen, '$1')
        .replace(edgeClose, '')
        .replace(/(<\/?([a-z][a-z0-9-]*)[^<>]*>)\s+(?=<\/?([a-z][a-z0-9-]*))/gi, (all, tag, a, b) => (BLOCK.has(a.toLowerCase()) || BLOCK.has(b.toLowerCase()) ? tag : all));

const PH_MARK = 'mcph';
const PH_RE = /mcph(\d{4})/;
// Shrinks the literal parts of a css`` template that has ${}; null when it has to stay as written.
function minCssParts(texts) {
  if (texts.some((t) => t.includes(PH_MARK))) return null;
  const joined = texts.map((t, i) => (i ? PH_MARK + String(i - 1).padStart(4, '0') : '') + t).join('');
  // split with one capture group alternates text and placeholder index
  const pieces = minCss(joined).split(PH_RE);
  if (pieces.length !== texts.length * 2 - 1) return null;
  const out = [];
  for (let i = 0; i < pieces.length; i++) {
    if (i % 2 === 0) out.push(pieces[i]);
    else if (Number(pieces[i]) !== (i - 1) / 2) return null;
  }
  return out;
}

function minify(source, fileName = 'x.ts') {
  const isTable = TABLE_FILES.test(fileName.replace(/\\/g, '/'));
  if (!isTable && !/\b(?:css|html)`/.test(source)) return source;
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true);
  const edits = [];
  const partRange = (p) => {
    const start = p.getStart(sf) + 1;
    const end = p.end - (p.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral || p.kind === ts.SyntaxKind.TemplateTail ? 1 : 2);
    return [start, end];
  };
  const visit = (node) => {
    if (isTable && ts.isPropertyAssignment(node) && (ts.isNoSubstitutionTemplateLiteral(node.initializer) || ts.isTemplateExpression(node.initializer))) {
      const t = node.initializer;
      const single = ts.isNoSubstitutionTemplateLiteral(t);
      for (const p of single ? [t] : [t.head, ...t.templateSpans.map((s) => s.literal)]) {
        const [start, end] = partRange(p);
        const text = source.slice(start, end);
        const out = single ? minCss(text) : minCssCode(text);
        if (out !== text) edits.push([start, end, out]);
      }
    }
    if (ts.isTaggedTemplateExpression(node) && ts.isIdentifier(node.tag) && (node.tag.text === 'css' || node.tag.text === 'html')) {
      const isCss = node.tag.text === 'css';
      const t = node.template;
      const parts = ts.isNoSubstitutionTemplateLiteral(t) ? [t] : [t.head, ...t.templateSpans.map((s) => s.literal)];
      if (isCss && parts.length > 1) {
        const ranges = parts.map(partRange);
        const texts = ranges.map(([a, b]) => source.slice(a, b));
        const outs = minCssParts(texts);
        if (outs) ranges.forEach(([a, b], i) => outs[i] !== texts[i] && edits.push([a, b, outs[i]]));
      } else {
        for (const p of parts) {
          const [start, end] = partRange(p);
          const text = source.slice(start, end);
          const out = isCss ? minCss(text) : minHtml(text);
          if (out !== text) edits.push([start, end, out]);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  let out = source;
  for (const [s, e, text] of edits.sort((a, b) => b[0] - a[0])) out = out.slice(0, s) + text + out.slice(e);
  return out;
}

module.exports = function (source) {
  return minify(source, this.resourcePath);
};
module.exports.minify = minify;
