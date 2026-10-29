import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
// @ts-expect-error plain ESM tool
import { buildPanel, migratePanel, scanPanel, PANEL_REL } from '../tools/i18n-mcu.mjs';

const PANEL = `
  import { setI18nLocale } from "./mc-i18n.js";
  import { t as tr, tx as trx, locale } from "./mc-i18n-panel.js";
  const a = tr("Save");
  const b = trx("Delete {name}?", { name: 1 });
  const c = tr("{n, plural, one {# point} other {# points}}", { n: 2 });
  const d = tr("A template named '{name}' already exists.", { name: "x" });
  const e = tr("Save");
`;
const NL = { Save: 'Opslaan', 'Delete {name}?': 'Verwijder {name}?', '{n, plural, one {# point} other {# points}}': '{n, plural, one {# punt} other {# punten}}', "A template named '{name}' already exists.": "Er bestaat al een sjabloon met de naam '{name}'." };

const roots: string[] = [];
function mcuRoot(panel = PANEL, nl: Record<string, string> = NL) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mcu-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, path.dirname(PANEL_REL)), { recursive: true });
  fs.mkdirSync(path.join(root, 'i18n'));
  fs.writeFileSync(path.join(root, PANEL_REL), panel);
  fs.writeFileSync(path.join(root, 'i18n/nl.json'), JSON.stringify(nl, null, 2) + '\n');
  const quoted = "A template named '{name}' already exists.";
  fs.writeFileSync(path.join(root, 'i18n/en-US.json'), JSON.stringify({ [quoted]: quoted }, null, 2) + '\n');
  return root;
}
afterEach(() => {
  for (const r of roots.splice(0)) fs.rmSync(r, { recursive: true, force: true });
});

describe('tools/i18n-mcu.mjs', () => {
  it('finds literal ids through the i18nFor destructuring, flags non-literals and hard-coded html text', () => {
    const src = `
      const { t: tr, tx: trx } = i18nFor("mcu-panel", tables);
      const a = tr("Save");
      const b = trx("Delete {name}?", { name: 1 });
      const c = tr(variable);
      const d = html\`<button title="Close">Open it</button><p>\${tr("Fine")}</p>\`;
    `;
    const r = scanPanel(src, 'x.js');
    expect([...r.ids].sort()).toEqual(['Delete {name}?', 'Fine', 'Save']);
    expect(r.violations).toHaveLength(1);
    expect(r.hard.join('|')).toContain('title="Close"');
    expect(r.hard.join('|')).toContain('Open it');
  });

  it('reads the names bound by an import from mc-i18n-panel.js and tells keys from text ids', () => {
    const r = scanPanel(PANEL.replace('tr("Save")', 'tr("mcu-panel.panel.save")'), 'x.js');
    expect([...r.names.entries()].sort()).toEqual([['tr', 't'], ['trx', 'tx']]);
    expect([...r.keys.keys()]).toEqual(['mcu-panel.panel.save']);
    expect(r.ids.has('Save')).toBe(true);
    expect(r.calls.filter((c: { isKey: boolean }) => c.isKey)).toHaveLength(1);
  });

  it('moves the panel to keys: calls, en-GB with notes, en-US and nl with the hash, reworded quotes listed', () => {
    const root = mcuRoot();
    const dry = migratePanel(root);
    expect(dry.written).toBe(false);
    expect(fs.existsSync(path.join(root, 'i18n/en-GB.json'))).toBe(false);

    const r = migratePanel(root, { write: true });
    expect(r.problems).toEqual([]);
    expect(r.written).toBe(true);
    expect(r.calls).toBe(5);
    expect(r.keys.get('Save')).toBe('mcu-panel.panel.save');
    expect(r.keys.get('Delete {name}?')).toBe('mcu-panel.panel.delete-name');
    expect(r.keys.get('{n, plural, one {# point} other {# points}}')).toBe('mcu-panel.panel.points');
    expect(r.reworded.map((x: { locale: string }) => x.locale).sort()).toEqual(['en-GB', 'en-US', 'nl']);

    const src = fs.readFileSync(path.join(root, PANEL_REL), 'utf8');
    expect(src.match(/tr\("mcu-panel\.panel\.save"\)/g)).toHaveLength(2);
    expect(src).toContain('trx("mcu-panel.panel.delete-name",');
    expect(src).not.toContain('tr("Save")');

    const gb = JSON.parse(fs.readFileSync(path.join(root, 'i18n/en-GB.json'), 'utf8'));
    expect(Object.keys(gb)).toEqual([...Object.keys(gb)].sort());
    expect(gb['mcu-panel.panel.save']).toMatchObject({ text: 'Save', max: 10 });
    expect(gb['mcu-panel.panel.save'].note.length).toBeGreaterThanOrEqual(12);
    expect(gb['mcu-panel.panel.delete-name'].vars).toHaveProperty('name');
    const key = Object.keys(gb).find((k) => k.includes('already-exists')) as string;
    expect(gb[key].text).toBe('A template named ‘{name}’ already exists.');
    const nl = JSON.parse(fs.readFileSync(path.join(root, 'i18n/nl.json'), 'utf8'));
    expect(nl['mcu-panel.panel.save']).toEqual({ text: 'Opslaan', hash: expect.stringMatching(/^[0-9a-f]{8}$/) });
    expect(nl[key].text).toBe('Er bestaat al een sjabloon met de naam ‘{name}’.');

    const again = migratePanel(root);
    expect(again.problems.join('|')).toContain('already has keys');
  });

  it('writes nothing when a call is not a literal or the nl text is missing from the check', () => {
    const root = mcuRoot(PANEL + 'const f = tr(variable);\n');
    const before = fs.readFileSync(path.join(root, PANEL_REL), 'utf8');
    const r = migratePanel(root, { write: true });
    expect(r.written).toBe(false);
    expect(r.problems.join('|')).toContain('nothing written');
    expect(fs.readFileSync(path.join(root, PANEL_REL), 'utf8')).toBe(before);
    expect(fs.existsSync(path.join(root, 'i18n/en-GB.json'))).toBe(false);
  });

  it('builds the keyed tables: no errors, one entry per distinct text, t and tx bound to the keys', () => {
    const root = mcuRoot();
    migratePanel(root, { write: true });
    const built = buildPanel(root);
    expect(built.errors.filter((e: string) => !e.startsWith('D5'))).toEqual([]);
    expect(built.count).toBe(4);
    expect(built.tables).toContain('export const t = (key, args) => bound.t(at(key), args);');
    expect(built.tables).toContain('["mcu-panel.panel.save", ');
    expect(built.tables).toContain('Opslaan');
    const us = JSON.parse(built.usJson);
    expect(us['mcu-panel.panel.save'].text).toBe('Save');
  });

  it('reports a text id in a keyed panel and a stale nl entry', () => {
    const root = mcuRoot();
    migratePanel(root, { write: true });
    const file = path.join(root, PANEL_REL);
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8') + 'const g = tr("Another text");\n');
    const gbFile = path.join(root, 'i18n/en-GB.json');
    const gb = JSON.parse(fs.readFileSync(gbFile, 'utf8'));
    gb['mcu-panel.panel.save'].text = 'Store';
    fs.writeFileSync(gbFile, JSON.stringify(gb, null, 2) + '\n');
    const errors = buildPanel(root).errors.join('\n');
    expect(errors).toContain('D1 mcu-panel');
    expect(errors).toContain('is stale');
  });

  it('runs the waiver checks on the panel catalogue: unknown key, old hash and empty reason are errors', () => {
    const root = mcuRoot();
    migratePanel(root, { write: true });
    const gb = JSON.parse(fs.readFileSync(path.join(root, 'i18n/en-GB.json'), 'utf8'));
    const hash = (nl: Record<string, { hash: string }>) => nl['mcu-panel.panel.save'].hash;
    const nl = JSON.parse(fs.readFileSync(path.join(root, 'i18n/nl.json'), 'utf8'));
    expect(gb['mcu-panel.panel.save']).toBeDefined();
    const waivers = path.join(root, 'i18n/waivers.json');
    fs.writeFileSync(waivers, JSON.stringify([{ key: 'mcu-panel.panel.save', hash: hash(nl), reason: 'fine' }]));
    expect(buildPanel(root).errors.filter((e: string) => e.startsWith('D9'))).toEqual([]);
    fs.writeFileSync(
      waivers,
      JSON.stringify([
        { key: 'mcu-panel.panel.ghost', hash: hash(nl), reason: 'x' },
        { key: 'mcu-panel.panel.save', hash: 'deadbeef', reason: 'x' },
      ]),
    );
    const out = buildPanel(root).errors.join('\n');
    expect(out).toContain('"mcu-panel.panel.ghost" is not a key');
    expect(out).toContain('holds hash deadbeef');
    fs.writeFileSync(waivers, JSON.stringify([{ key: 'mcu-panel.panel.save', hash: hash(nl), reason: '  ' }]));
    expect(buildPanel(root).errors.join('\n')).toContain('has no reason');
  });
});
