// Namespace 'mcu-panel' (slice I9, contract src/contracts/i18n.ts 1.0.0 r3): the Magic Card Utils panel is plain
// JavaScript with no build step, so its messages are read from the panel source and written to a generated,
// vendored file. Used by tools/i18n-export.mjs (`--mcu <repo>`); the checks D1-D6 run here.
//   <mcu>/custom_components/magic_card_utils/www/magic_card_utils_panel.js   the source: tr('British text', args)
//   <mcu>/i18n/en-US.json   generated (word list + tools/i18n/en-US-exceptions.json), committed, never edited
//   <mcu>/i18n/nl.json      written by the localizer, committed
//   <www>/mc-i18n-panel.js  generated: three '|' joined tables (en-GB, en-US, nl), string-id path (no loader)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spellingErrors } from './i18n-check.mjs';
const require = createRequire(import.meta.url);
const lib = require('./i18n/lib.cjs');
const ts = require('typescript');

export const PANEL_REL = 'custom_components/magic_card_utils/www/magic_card_utils_panel.js';
export const WWW_REL = 'custom_components/magic_card_utils/www';
const NS = 'mcu-panel';
const FNS = new Set(['t', 'tc', 'tx']);

/** Local names of the i18nFor('mcu-panel', ...) destructuring: { t: tr, tx: trx } gives tr -> t, trx -> tx. */
function localNames(sf) {
  const names = new Map();
  const visit = (n) => {
    if (ts.isVariableDeclaration(n) && ts.isObjectBindingPattern(n.name) && n.initializer && ts.isCallExpression(n.initializer) && ts.isIdentifier(n.initializer.expression) && n.initializer.expression.text === 'i18nFor') {
      for (const el of n.name.elements) {
        const fn = (el.propertyName ?? el.name).text;
        if (FNS.has(fn)) names.set(el.name.text, fn);
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return names;
}

const lit = (n) => (n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) ? n.text : undefined);

/** { ids: Set, ctx: Map, violations, hard } for the panel source. */
export function scanPanel(source, file = PANEL_REL) {
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.ES2021, true, ts.ScriptKind.JS);
  const names = localNames(sf);
  const ids = new Set();
  const ctx = new Map();
  const violations = [];
  const hard = [];
  const contract = lib.loadContract();
  const attrs = new Set(contract.SCANNED_ATTRIBUTES.map((a) => a.replace(/^\./, '')));
  const allow = new Set(lib.readJson(path.join(lib.ROOT, 'tools/i18n/allow.json'), {}).text ?? []);
  const hasLetters = (s) => /[A-Za-z]{2,}/.test(s.replace(/&#?\w+;/g, ' '));
  const userText = (s) => hasLetters(s) && !allow.has(s.trim()) && !/^custom:[\w-]+$/.test(s.trim());
  const line = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
  const visit = (n) => {
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && names.has(n.expression.text)) {
      const fn = names.get(n.expression.text);
      const text = lit(fn === 'tc' ? n.arguments[1] : n.arguments[0]);
      const c = fn === 'tc' ? lit(n.arguments[0]) : undefined;
      if (text === undefined || (fn === 'tc' && c === undefined)) violations.push(`${file}:${line(n)} ${n.expression.text}(): the id is not a string literal (D1)`);
      else {
        const id = fn === 'tc' ? `${c}|${text}` : text;
        ids.add(id);
        if (c !== undefined) ctx.set(id, c);
      }
    }
    // D5: html`` text and scanned attributes holding letters outside tr()
    if (ts.isTaggedTemplateExpression(n) && ts.isIdentifier(n.tag) && n.tag.text === 'html') {
      const t = n.template;
      const parts = ts.isNoSubstitutionTemplateLiteral(t) ? [t.text] : [t.head.text, ...t.templateSpans.map((s) => s.literal.text)];
      const joined = parts.join('\u0000').replace(/<!--[\s\S]*?-->/g, '').replace(/<(style|script)\b[\s\S]*?<\/\1>/gi, '');
      for (const m of joined.matchAll(/(?:^|>)([^<>]*)(?=<|$)/g)) {
        const txt = m[1].replace(/\u0000/g, ' ');
        if (userText(txt)) hard.push(`${file}:${line(n)} text "${txt.trim().slice(0, 40)}"`);
      }
      for (const tag of joined.matchAll(/<[a-z][^<>]*>/gi)) {
        for (const a of tag[0].matchAll(/\s(\.?[a-z][\w-]*)="([^"]*)"/gi)) {
          if (attrs.has(a[1].replace(/^\./, '')) && userText(a[2].replace(/\u0000/g, ' '))) hard.push(`${file}:${line(n)} ${a[1]}="${a[2].slice(0, 30)}"`);
        }
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return { ids, ctx, violations, hard, names };
}

const read = (p, fallback) => lib.readJson(p, fallback);

/** Everything the exporter writes for the panel, plus the check results. */
export function buildPanel(mcuRoot) {
  const panel = path.join(mcuRoot, PANEL_REL);
  const { ids, ctx, violations, hard, names } = scanPanel(fs.readFileSync(panel, 'utf8'));
  const errors = [...violations];
  if (!names.size) errors.push(`${PANEL_REL}: no i18nFor('mcu-panel', ...) destructuring found`);
  const contract = lib.loadContract();
  const us = lib.generateUS(ids, ctx);
  const nl = read(path.join(mcuRoot, 'i18n/nl.json'), {});
  const list = lib.sortedIds(ids);
  const text = (id) => (ctx.has(id) ? id.slice(ctx.get(id).length + 1) : id);
  for (const id of list) {
    const base = lib.parseMessage(text(id));
    if (base.error) errors.push(`D6 ${NS} "${id}" (en-GB): ${base.error}`);
    const v = nl[id];
    if (typeof v !== 'string' || v.trim() === '') errors.push(`D2 ${NS} "${id}": no nl entry`);
    else {
      const p = lib.parseMessage(v);
      if (p.error) errors.push(`D6 ${NS} "${id}" (nl): ${p.error}`);
      else if (!base.error && lib.argSig(p.args) !== lib.argSig(base.args)) errors.push(`D2 ${NS} "${id}" (nl): arguments differ (${lib.argNames(p.args)} vs ${lib.argNames(base.args)})`);
    }
    for (const m of spellingErrors(contract, text(id))) errors.push(`D3 ${NS} "${id}": ${m}`);
  }
  for (const k of Object.keys(nl)) if (!ids.has(k)) errors.push(`D2 ${NS} nl.json: stale entry "${k}"`);
  for (const h of hard) errors.push(`D5 ${NS} ${h}`);
  const rows = [list, list.map((i) => us[i]), list.map((i) => nl[i] ?? '')];
  const lit1 = (r, i) => '  ' + JSON.stringify((i === 0 ? r.map((x) => x.replace('|', '\u0001')) : r).join('|')) + ',';
  const tables = `// Magic Card Utils panel messages (namespace 'mcu-panel', contract i18n 1.0.0 r3), generated by tools/i18n-export.mjs in the\n// Magic Card repository from magic_card_utils_panel.js, i18n/en-US.json and i18n/nl.json. Do not edit.\n// Three '|' joined tables: en-GB, en-US, nl. Entry i of each is message i.\nexport default [\n${rows.map(lit1).join('\n')}\n];\n`;
  return { count: list.length, errors, usJson: lib.stableJson(us), tables };
}
