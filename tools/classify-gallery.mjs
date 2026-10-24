#!/usr/bin/env node
// Classifies the gallery fixtures (tools/fixtures/gallery/NNN.yaml) as plain or feature against the
// key allowlist (tools/plain-keys.json) and writes tools/fixtures/gallery/classification.json.
//
//   node tools/classify-gallery.mjs                    classify the committed fixtures, write classification.json
//   node tools/classify-gallery.mjs --check            classify, compare with the committed file, exit 1 on any difference
//   node tools/classify-gallery.mjs --scan             only run the token and personal-data scan
//   node tools/classify-gallery.mjs --explain NNN      print every feature found in one fixture, with its path
//   node tools/classify-gallery.mjs --import <dir>     copy <dir>/<n>-<slug>.yaml (n = 1..137) to fixtures/gallery/NNN.yaml, then classify
//
// The output has no timestamps and no absolute paths: the same inputs give the same bytes.
// Every run scans first and refuses to classify a fixture the scan flags.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as jsYaml from 'js-yaml';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURES = join(ROOT, 'tools', 'fixtures', 'gallery');
const KEYS_FILE = join(ROOT, 'tools', 'plain-keys.json');
const OUT_FILE = join(FIXTURES, 'classification.json');
const EXPECTED_COUNT = 137;
const MAX_FIXTURE_BYTES = 262144; // refuse above this
const MAX_ALIASES = 1000; // bound on YAML aliases (alias-expansion limit)

// ── token and personal-data scan ─────────────────────────────────────────────

/** Demo-HA person names the gallery uses (generic placeholders, no real people). */
const DEMO_PERSONS = new Set(['person.anna', 'person.ben', 'person.lisa']);

const SCAN_RULES = [
  ['token', /eyJ[A-Za-z0-9_-]{10,}|ghp_[A-Za-z0-9]{10,}|github_pat_|gho_[A-Za-z0-9]{10,}|sk-[A-Za-z0-9]{16,}|AKIA[0-9A-Z]{12,}|xox[abp]-|-----BEGIN/],
  ['secret-word', /\b(bearer|api[_-]?key|access_token|auth_sig|password|passwd|private[_ -]?key|authorization|client_secret)\b|token=|\bsecret\b/i],
  ['email', /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/],
  ['ipv4', /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/],
  ['mac', /\b([0-9a-f]{2}[:-]){5}[0-9a-f]{2}\b/i],
  ['absolute-url', /(https?:)?\/\/[A-Za-z0-9._-]+\.[A-Za-z]{2,}/],
  ['local-path', /[A-Za-z]:\\|\/Users\/|\/home\/|[A-Za-z]:\/[A-Za-z]/],
  ['phone', /(?:\+\d{1,3}|\(0\d{1,3}\)|(?<![\d.#%-])0\d{1,3})[ -]?\d{3,4}[ -]\d{3,8}(?![\d.%])/],
  ['coordinates', /\b(latitude|longitude)\b|\b-?\d{1,3}\.\d{4,},\s*-?\d{1,3}\.\d{4,}\b/i],
  ['tracker-entity', /\b(device_tracker|zone)\.[a-z0-9_]+/],
];

/**
 * Personal-name deny-list: one case-insensitive term per line (# comments allowed), read from the file named by
 * PRIVACY_DENYLIST, else .company/privacy-denylist.txt (a git-ignored file). PRIVACY_DENYLIST_TERMS (comma separated) is
 * added on top. No term lives in a tracked file. With no list the user-name rule is skipped and a note is printed.
 */
function loadDenyList() {
  const terms = [];
  const file = process.env.PRIVACY_DENYLIST || join(dirname(fileURLToPath(import.meta.url)), '..', '.company', 'privacy-denylist.txt');
  if (existsSync(file)) terms.push(...readFileSync(file, 'utf8').split(/\r?\n/));
  if (process.env.PRIVACY_DENYLIST_TERMS) terms.push(...process.env.PRIVACY_DENYLIST_TERMS.split(','));
  const clean = terms.map((t) => t.trim()).filter((t) => t && !t.startsWith('#'));
  if (!clean.length) {
    console.log('note: no privacy deny-list (PRIVACY_DENYLIST, PRIVACY_DENYLIST_TERMS or .company/privacy-denylist.txt); user-name rule skipped');
    return null;
  }
  return new RegExp(clean.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
}
const DENY_RE = loadDenyList();

/** Returns [{ line, rule, text }] for one fixture text. */
export function scanText(text) {
  const hits = [];
  text.split('\n').forEach((line, i) => {
    for (const [rule, re] of SCAN_RULES) {
      if (re.test(line)) hits.push({ line: i + 1, rule, text: line.trim().slice(0, 120) });
    }
    if (DENY_RE && DENY_RE.test(line)) hits.push({ line: i + 1, rule: 'user-name', text: line.trim().slice(0, 120) });
    for (const m of line.matchAll(/\bperson\.[a-z0-9_]+/g)) {
      if (!DEMO_PERSONS.has(m[0])) hits.push({ line: i + 1, rule: 'person-entity', text: line.trim().slice(0, 120) });
    }
  });
  return hits;
}

// ── helpers ──────────────────────────────────────────────────────────────────

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const loadKeys = () => JSON.parse(readFileSync(KEYS_FILE, 'utf8'));

function fixtureFiles() {
  return readdirSync(FIXTURES)
    .filter((f) => /^\d{3}\.yaml$/.test(f))
    .sort();
}

/** js-yaml 5, CORE_SCHEMA, no merge tag, bounded aliases. */
function parseYaml(text, name) {
  if (Buffer.byteLength(text) > MAX_FIXTURE_BYTES) throw new Error(`${name}: larger than ${MAX_FIXTURE_BYTES} bytes`);
  const doc = jsYaml.load(text, { schema: jsYaml.CORE_SCHEMA, maxAliases: MAX_ALIASES });
  return stripUnsafeKeys(doc);
}

/** Drop prototype-polluting keys; also counts nodes and bounds the walk. */
function stripUnsafeKeys(root) {
  const seen = new Map();
  let visits = 0;
  const copy = (v) => {
    if (!v || typeof v !== 'object') return v;
    if (seen.has(v)) return seen.get(v);
    if (++visits > 200000) throw new Error('too many nodes');
    if (Array.isArray(v)) {
      const out = [];
      seen.set(v, out);
      for (const item of v) out.push(copy(item));
      return out;
    }
    const out = Object.create(null);
    seen.set(v, out);
    for (const [k, val] of Object.entries(v)) {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      out[k] = copy(val);
    }
    return out;
  };
  return copy(root);
}

// ── classifier ───────────────────────────────────────────────────────────────

export function classifyConfig(config, keys) {
  const found = []; // { path, kind: 'feature'|'unknown', name, chunk, reserve }
  const rank = (r) => keys.reserve_rank.indexOf(r);
  const set = (list) => new Set(list);

  const cardKeys = set(keys.card);
  const hostKeys = set(keys.host_keys_ignored.keys);
  const overrideKeys = set(keys.appearance_override);
  const ruleKeys = set(keys.appearance_rule);
  const nodeKeys = set(keys.layout_node);
  const commonKeys = set(keys.module_common);
  const designCss = set(keys.design.css);
  const designStruct = set(keys.design.structure);
  const ruleDesignKeys = set(keys.design.conditional_rule);
  const displayKeys = set(keys.display.keys);
  const condKeys = set(keys.display.condition_keys);
  const condTypes = set(keys.display.condition_types);
  const actionSlots = set(keys.actions.slots);
  const actionTypes = set(keys.actions.plain_types);
  const bgTypes = set(keys.background_layers.plain_types);
  const bgKeys = set(keys.background_layers.plain_keys);
  const layerKeys = set(keys.module_layer.keys);
  const iconKeys = set(keys.icon_keys.keys);
  const iconRe = new RegExp(keys.icon_keys.plain_pattern);
  const seasonalIds = set(keys.seasonal_preset_ids);
  const moduleTypeKeys = Object.fromEntries(Object.entries(keys.module_types).map(([t, l]) => [t, set(l)]));
  const F = keys.features;

  const add = (path, kind, name, spec) => found.push({ path, kind, name, chunk: spec?.chunk ?? 'unknown', reserve: spec?.reserve ?? 'default' });
  const feature = (path, name, spec) => add(path, 'feature', name, spec);
  const unknown = (path, name) => add(path, 'unknown', name, null);

  function checkAnimations(path, list) {
    if (!Array.isArray(list)) return;
    list.forEach((a, i) => {
      if (isObj(a) && typeof a.preset === 'string' && seasonalIds.has(a.preset)) feature(`${path}[${i}].preset`, `seasonal-preset:${a.preset}`, F.seasonal_preset);
    });
  }

  function design(path, d, inHover = false) {
    if (!isObj(d)) return;
    for (const [k, v] of Object.entries(d)) {
      const p = `${path}.${k}`;
      if (F.design[k]) {
        feature(p, `design.${k}`, F.design[k]);
        if (k === 'animations') checkAnimations(p, v);
      } else if (designCss.has(k)) {
        // plain CSS key
      } else if (k === 'hover') {
        if (inHover) unknown(p, 'design.hover.hover');
        else design(p, v, true);
      } else if (k === 'conditional') {
        if (!Array.isArray(v)) continue;
        v.forEach((rule, i) => {
          if (!isObj(rule)) return;
          for (const [rk, rv] of Object.entries(rule)) {
            const rp = `${p}[${i}].${rk}`;
            if (!ruleDesignKeys.has(rk)) unknown(rp, `conditional.${rk}`);
            else if (rk === 'design') design(rp, rv);
            else if (rk === 'conditions') conditions(rp, rv);
          }
        });
      } else unknown(p, `design.${k}`);
    }
  }

  function conditions(path, list) {
    if (!Array.isArray(list)) return;
    list.forEach((c, i) => {
      if (!isObj(c)) return;
      for (const k of Object.keys(c)) if (!condKeys.has(k)) unknown(`${path}[${i}].${k}`, `condition.${k}`);
      if (c.type !== undefined && !condTypes.has(c.type)) unknown(`${path}[${i}].type`, `condition.type:${c.type}`);
    });
  }

  function display(path, d) {
    if (!isObj(d)) return;
    for (const [k, v] of Object.entries(d)) {
      if (!displayKeys.has(k)) unknown(`${path}.${k}`, `display.${k}`);
      else if (k === 'conditions') conditions(`${path}.conditions`, v);
    }
  }

  function actions(path, a) {
    if (!isObj(a)) return;
    for (const [slot, act] of Object.entries(a)) {
      if (!actionSlots.has(slot)) {
        unknown(`${path}.${slot}`, `actions.${slot}`);
        continue;
      }
      if (!isObj(act)) continue;
      const t = act.action;
      if (F.action_types[t]) feature(`${path}.${slot}.action`, `action:${t}`, F.action_types[t]);
      else if (t !== undefined && !actionTypes.has(t)) unknown(`${path}.${slot}.action`, `action:${t}`);
    }
  }

  function iconValue(path, key, v) {
    if (typeof v !== 'string' || v === '') return;
    if (!iconRe.test(v)) feature(`${path}.${key}`, `icon:${v.split(':')[0] || v}`, F.svg_icon);
  }

  function bgLayer(path, layer) {
    if (!isObj(layer)) return;
    const bk = keys.background_layers;
    if (!bgTypes.has(layer.type)) feature(`${path}.type`, `layer-type:${layer.type}`, F.layer_fx);
    for (const k of Object.keys(layer)) {
      if (bk.feature_keys[k]) feature(`${path}.${k}`, `layer-${k}`, F.layer_fx);
      else if (!bgKeys.has(k)) unknown(`${path}.${k}`, `background_layers.${k}`);
    }
    if (typeof layer.entity === 'string' && layer.entity.startsWith('camera.') && bk.camera_entity_is_feature) feature(`${path}.entity`, 'layer-camera', F.layer_fx);
    // a library image reference (image, a state value): drawn by the svg-image chunk, which the render starts
    const refs = [['image', layer.image], ...(isObj(layer.states) ? Object.entries(layer.states).map(([k, v]) => [`states.${k}`, v]) : [])];
    for (const [k, v] of refs) if (typeof v === 'string' && v.startsWith(bk.library_image_prefix)) feature(`${path}.${k}`, 'layer-library-image', F.library_image);
  }

  function bgLayers(path, list) {
    if (Array.isArray(list)) list.forEach((l, i) => bgLayer(`${path}[${i}]`, l));
  }

  function moduleLayer(path, m) {
    if (m.placement !== undefined && !keys.module_layer.placements.includes(m.placement)) unknown(`${path}.placement`, `placement:${m.placement}`);
    if (isObj(m.layer)) for (const k of Object.keys(m.layer)) if (!layerKeys.has(k)) unknown(`${path}.layer.${k}`, `layer.${k}`);
  }

  function hasKey(m, spec) {
    return (spec.size_keys ?? []).some((sk) => {
      const v = sk.split('.').reduce((o, k) => (isObj(o) ? o[k] : undefined), m);
      return v !== undefined && v !== null && v !== '';
    });
  }

  function module(path, m) {
    if (!isObj(m)) return;
    const t = m.type;
    const typeSpec = F.module_types[t];
    const own = moduleTypeKeys[t];
    if (typeSpec) {
      const reserve = typeSpec.size_keys && hasKey(m, typeSpec) ? typeSpec.size_reserve : typeSpec.reserve;
      feature(`${path}.type`, `module:${t}`, { chunk: typeSpec.chunk, reserve });
    } else if (!own) {
      unknown(`${path}.type`, `module:${t}`);
    }
    for (const [k, v] of Object.entries(m)) {
      const p = `${path}.${k}`;
      if (commonKeys.has(k)) {
        if (k === 'design') design(p, v);
        else if (k === 'display') display(p, v);
        else if (k === 'actions') actions(p, v);
        else if (k === 'placement' || k === 'layer') {
          // checked once below
        }
      } else if (F.module_keys[k]) {
        feature(p, `module.${k}`, F.module_keys[k]);
      } else if (own && own.has(k)) {
        if (iconKeys.has(k)) iconValue(path, k, v);
      } else if (k === 'modules' || k === 'columns' || k === 'tabs') {
        // children, walked below
      } else if (!typeSpec) {
        unknown(p, `${t}.${k}`);
      }
    }
    moduleLayer(path, m);
    if (Array.isArray(m.modules)) m.modules.forEach((c, i) => module(`${path}.modules[${i}]`, c));
    if (Array.isArray(m.columns)) m.columns.forEach((c, i) => layoutNode(`${path}.columns[${i}]`, c));
    if (Array.isArray(m.tabs)) {
      m.tabs.forEach((tab, i) => {
        if (isObj(tab) && Array.isArray(tab.modules)) tab.modules.forEach((c, j) => module(`${path}.tabs[${i}].modules[${j}]`, c));
      });
    }
  }

  function layoutNode(path, n) {
    if (!isObj(n)) return;
    for (const [k, v] of Object.entries(n)) {
      const p = `${path}.${k}`;
      if (!nodeKeys.has(k)) unknown(p, `layout.${k}`);
      else if (k === 'design') design(p, v);
      else if (k === 'display') display(p, v);
      else if (k === 'actions') actions(p, v);
    }
    if (Array.isArray(n.columns)) n.columns.forEach((c, i) => layoutNode(`${path}.columns[${i}]`, c));
    if (Array.isArray(n.modules)) n.modules.forEach((c, i) => module(`${path}.modules[${i}]`, c));
  }

  function appearance(path, rules) {
    if (!Array.isArray(rules)) return;
    rules.forEach((r, i) => {
      if (!isObj(r)) return;
      const rp = `${path}[${i}]`;
      for (const [k, v] of Object.entries(r)) {
        if (!ruleKeys.has(k)) unknown(`${rp}.${k}`, `conditional_appearance.${k}`);
        else if (k === 'conditions') conditions(`${rp}.conditions`, v);
        else if (k === 'overrides' && isObj(v)) {
          for (const [ok, ov] of Object.entries(v)) {
            const op = `${rp}.overrides.${ok}`;
            if (F.card[ok]) feature(op, `override.${ok}`, F.card[ok]);
            else if (!overrideKeys.has(ok)) unknown(op, `override.${ok}`);
            else if (ok === 'background_layers') bgLayers(op, ov);
          }
        }
      }
    });
  }

  if (!isObj(config)) {
    unknown('$', 'config');
  } else {
    for (const [k, v] of Object.entries(config)) {
      if (hostKeys.has(k)) continue;
      if (F.card[k]) {
        feature(k, `card.${k}`, F.card[k]);
        if (k === 'animations') checkAnimations(k, v);
        continue;
      }
      if (!cardKeys.has(k)) {
        unknown(k, `card.${k}`);
        continue;
      }
      if (k === 'rows') {
        if (Array.isArray(v)) v.forEach((row, i) => layoutNode(`rows[${i}]`, row));
      } else if (k === 'hover') design('hover', v, true);
      else if (k === 'display') display('display', v);
      else if (k === 'conditional_appearance') appearance(k, v);
      else if (k === 'background_layers') bgLayers(k, v);
    }
  }

  // consolidate
  const names = [...new Set(found.map((f) => f.name))].sort();
  const chunks = [...new Set(found.map((f) => f.chunk))].filter((c) => c !== 'unknown').sort();
  const unknownKeys = [...new Set(found.filter((f) => f.kind === 'unknown').map((f) => f.name))].sort();
  let reserve = 'none';
  for (const f of found) if (rank(f.reserve) > rank(reserve)) reserve = f.reserve;
  const gridRows = isObj(config?.grid_options) && config.grid_options.rows !== undefined;
  return {
    class: found.length === 0 ? 'plain' : 'feature',
    chunks,
    reserve_kind: reserve,
    grid_rows: gridRows,
    features: names,
    unknown_keys: unknownKeys,
    found,
  };
}

/** Number of module objects: every element of a `modules` list, at any depth. */
function countModules(node) {
  let n = 0;
  const walk = (v, inModules) => {
    if (Array.isArray(v)) {
      if (inModules) n += v.filter(isObj).length;
      v.forEach((x) => walk(x, false));
    } else if (isObj(v)) {
      for (const [k, x] of Object.entries(v)) walk(x, k === 'modules');
    }
  };
  walk(node?.rows, false);
  return n;
}

// ── build the classification ─────────────────────────────────────────────────

function build() {
  const keysText = readFileSync(KEYS_FILE);
  const keys = JSON.parse(keysText.toString('utf8'));
  const files = fixtureFiles();
  if (files.length !== EXPECTED_COUNT) throw new Error(`expected ${EXPECTED_COUNT} fixtures, found ${files.length}`);
  files.forEach((f, i) => {
    if (f !== `${String(i + 1).padStart(3, '0')}.yaml`) throw new Error(`fixture numbering has a gap at ${f}`);
  });

  const sources = existsSync(join(FIXTURES, 'sources.json')) ? JSON.parse(readFileSync(join(FIXTURES, 'sources.json'), 'utf8')) : {};
  const cards = [];
  const explain = {};
  const scanHits = [];
  for (const f of files) {
    const raw = readFileSync(join(FIXTURES, f));
    const text = raw.toString('utf8');
    for (const h of scanText(text)) scanHits.push({ file: f, ...h });
    const id = f.slice(0, 3);
    let config;
    try {
      config = parseYaml(text, f);
    } catch (e) {
      throw new Error(`${f}: ${e.message}`);
    }
    const r = classifyConfig(config, keys);
    explain[id] = r.found;
    cards.push({
      id,
      source: sources[id] ?? null,
      sha256: sha256(raw),
      class: r.class,
      chunks: r.chunks,
      reserve_kind: r.reserve_kind,
      grid_rows: r.grid_rows,
      features: r.features,
      unknown_keys: r.unknown_keys,
      modules: countModules(config),
    });
  }
  const plain = cards.filter((c) => c.class === 'plain');
  const feature = cards.filter((c) => c.class === 'feature');

  // Trace fixtures: the plain card with the most modules; the effect card that needs the
  // `anim` chunk only (no other chunk), with the most modules. Ties: lowest id.
  const pick = (list) => list.slice().sort((a, b) => b.modules - a.modules || a.id.localeCompare(b.id))[0]?.id ?? null;
  const effectPool = feature.filter((c) => c.chunks.length === 1 && c.chunks[0] === 'anim' && c.unknown_keys.length === 0);

  const out = {
    description: keys.description,
    plain_keys_sha256: sha256(keysText),
    count: cards.length,
    plain: plain.length,
    feature: feature.length,
    plain_share_percent: Math.round((plain.length / cards.length) * 1000) / 10,
    trace_fixtures: { plain: pick(plain), effect: pick(effectPool) },
    chunk_counts: Object.fromEntries(
      [...new Set(cards.flatMap((c) => c.chunks))].sort().map((ch) => [ch, cards.filter((c) => c.chunks.includes(ch)).length]),
    ),
    reserve_counts: Object.fromEntries(keys.reserve_rank.map((r) => [r, cards.filter((c) => c.reserve_kind === r).length])),
    unknown_key_cards: cards.filter((c) => c.unknown_keys.length).map((c) => c.id),
    cards,
  };
  return { out, explain, scanHits };
}

const serialise = (out) => `${JSON.stringify(out, null, 2)}\n`;

// ── import ───────────────────────────────────────────────────────────────────

function importFrom(dir) {
  const src = resolve(dir);
  const names = readdirSync(src).filter((f) => /^\d+-.*\.yaml$/.test(f));
  const byNum = new Map(names.map((f) => [parseInt(f, 10), f]));
  mkdirSync(FIXTURES, { recursive: true });
  const sources = {};
  for (let n = 1; n <= EXPECTED_COUNT; n++) {
    const f = byNum.get(n);
    if (!f) throw new Error(`gallery card ${n} not found in ${src}`);
    const full = join(src, f);
    if (statSync(full).size > MAX_FIXTURE_BYTES) throw new Error(`${f}: larger than ${MAX_FIXTURE_BYTES} bytes`);
    const text = readFileSync(full, 'utf8').replace(/\r\n/g, '\n');
    const id = String(n).padStart(3, '0');
    sources[id] = f.replace(/\.yaml$/, '').replace(/^\d+-/, '');
    writeFileSync(join(FIXTURES, `${id}.yaml`), text);
  }
  writeFileSync(join(FIXTURES, 'sources.json'), serialise(sources));
  console.log(`imported ${EXPECTED_COUNT} fixtures from the gallery sources`);
}

// ── main ─────────────────────────────────────────────────────────────────────

function main(argv) {
  const flag = (n) => argv.indexOf(n);
  if (flag('--import') >= 0) importFrom(argv[flag('--import') + 1]);
  const { out, explain, scanHits } = build();

  if (scanHits.length) {
    for (const h of scanHits) console.error(`scan: ${h.file}:${h.line} [${h.rule}] ${h.text}`);
    console.error(`scan: ${scanHits.length} hit(s), refusing to classify`);
    process.exit(2);
  }
  console.log(`scan: clean (${out.count} fixtures, ${SCAN_RULES.length + 1} rules)`);
  if (argv.includes('--scan')) return;

  if (flag('--explain') >= 0) {
    const id = argv[flag('--explain') + 1];
    for (const f of explain[id] ?? []) console.log(`${f.kind.padEnd(8)} ${f.chunk.padEnd(14)} ${f.reserve.padEnd(10)} ${f.name}  @ ${f.path}`);
    return;
  }

  const text = serialise(out);
  if (argv.includes('--check')) {
    const current = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, 'utf8') : '';
    if (current !== text) {
      console.error('classification.json differs from a fresh classification');
      process.exit(1);
    }
    console.log(`classification.json is current: ${out.plain} plain, ${out.feature} feature of ${out.count}`);
    return;
  }
  writeFileSync(OUT_FILE, text);
  console.log(`${out.plain} plain, ${out.feature} feature of ${out.count} (${out.plain_share_percent} % plain); ${out.unknown_key_cards.length} card(s) with unknown keys`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
