import { describe, expect, it } from 'vitest';
import { ENTITY_DOMAINS } from '../src/contracts/share-kit';
import { TRANSFER_FORMAT } from '../src/contracts/preset-transfer';
import type { TransferItem, TransferKind } from '../src/contracts/preset-transfer';
import { toPlaceholders } from '../src/share-kit/placeholders';
import { createShareKit } from '../src/share-kit/chunk';
import { parseTransfer, serialiseTransfer } from '../src/transfer/envelope';
import { shareKitHelpers } from '../src/transfer/share-kit-loader';

const kit = createShareKit(shareKitHelpers);
const item = (data: unknown, extra: Record<string, unknown> = {}): TransferItem => ({ id: 'a', name: 'A', data, ...extra }) as never;
const run = (data: unknown, kind: TransferKind = 'card', extra: Record<string, unknown> = {}) => toPlaceholders(kind, [item(data, extra)]);
const text = (v: unknown): string => JSON.stringify(v);

describe('toPlaceholders', () => {
  it('replaces ids from entity fields, nested entity objects, actions and image bindings', () => {
    const out = run({
      type: 'custom:magic-card',
      entity: 'light.kitchen',
      entities: ['sensor.temp', { entity: 'switch.fan' }],
      tap_action: { action: 'perform_action', perform_action: 'light.toggle', target: { entity_id: ['light.hall', 'light.kitchen'] } },
    });
    const s = text(out.items);
    for (const id of ['light.kitchen', 'sensor.temp', 'switch.fan', 'light.hall']) expect(s).not.toContain(id);
    expect(s).toContain('light.toggle');
    expect(out.placeholders).toEqual([
      { id: 'light.mc_placeholder_1', domain: 'light' },
      { id: 'sensor.mc_placeholder_2', domain: 'sensor' },
      { id: 'switch.mc_placeholder_3', domain: 'switch' },
      { id: 'light.mc_placeholder_4', domain: 'light' },
    ]);
    expect(Object.values(out.originals).sort()).toEqual(['light.hall', 'light.kitchen', 'sensor.temp', 'switch.fan']);
  });

  it('replaces an id that appears only in a template, and in free text', () => {
    const out = run({ text: `{{ states("sensor.only_here") | float }} and {{ is_state('light.lamp', 'on') }}` }, 'card', { description: 'Uses climate.living for heating.' });
    const s = text(out.items);
    for (const id of ['sensor.only_here', 'light.lamp', 'climate.living']) expect(s).not.toContain(id);
    expect(out.placeholders.map((p) => p.domain)).toEqual(['sensor', 'light', 'climate']);
  });

  it('finds an id after states. in a template', () => {
    const out = run({ text: '{{ states.light.kitchen.state }}' });
    expect(text(out.items)).not.toContain('light.kitchen');
    expect(out.originals['light.mc_placeholder_1']).toBe('light.kitchen');
  });

  it('keeps light.kitchen_2 whole when light.kitchen is also replaced, longest first', () => {
    const out = run({ entity: 'light.kitchen', text: 'light.kitchen_2 then light.kitchen and light.kitchen_22.' });
    expect(Object.values(out.originals).sort()).toEqual(['light.kitchen', 'light.kitchen_2', 'light.kitchen_22']);
    expect(text(out.items)).not.toMatch(/light\.kitchen/);
    const data = out.items[0].data as unknown as { text: string };
    expect(data.text).toBe('light.mc_placeholder_2 then light.mc_placeholder_1 and light.mc_placeholder_3.');
  });

  it('uses one placeholder per id, numbered in first-occurrence order, and is repeatable', () => {
    const data = { a: 'sensor.b sensor.a sensor.b', z: { entity: 'sensor.c' } };
    const one = run(data);
    expect(one.items[0].data).toEqual({ a: 'sensor.mc_placeholder_1 sensor.mc_placeholder_2 sensor.mc_placeholder_1', z: { entity: 'sensor.mc_placeholder_3' } });
    expect(run(data)).toEqual(one);
  });

  it('numbers across the items of one export', () => {
    const out = toPlaceholders('card', [item({ entity: 'sensor.a' }), item({ entity: 'sensor.b' }), item({ entity: 'sensor.a' })]);
    expect(out.placeholders).toHaveLength(2);
    expect(text(out.items)).toBe(text([item({ entity: 'sensor.mc_placeholder_1' }), item({ entity: 'sensor.mc_placeholder_2' }), item({ entity: 'sensor.mc_placeholder_1' })]));
  });

  it('adds geo_location to the domain list and replaces it in free text', () => {
    expect(ENTITY_DOMAINS).toContain('geo_location');
    const out = run({ note: 'near geo_location.home_zone today' });
    expect(text(out.items)).not.toContain('home_zone');
  });

  it('uses a domain seen in an entity field even when it is not in the list', () => {
    const out = run({ entity: 'gizmo.thing', note: 'see gizmo.thing and gizmo.other' });
    expect(text(out.items)).not.toMatch(/gizmo\.(thing|other)/);
  });

  it('leaves unknown domains in free text alone', () => {
    const d = { note: 'visit example.com or foo.bar_baz and v1.2.3' };
    expect(run(d).items[0].data).toEqual(d);
  });

  it('leaves paths, urls, extensions and existing placeholders alone', () => {
    const d = {
      a: '/local/light.kitchen/pic.png',
      b: 'url(/local/image.png) url("https://x.example/sensor.hidden")',
      c: 'light.mc_placeholder_7',
      d: 'see image.png and sensor.json and text.yaml',
      e: 'xlight.kitchen 1light.kitchen light.kitchen/ sub-light.kitchen',
    };
    expect(run(d).items[0].data).toEqual({ ...d, b: d.b.replace("x.example", "example.invalid") });
  });

  it('does not turn ordinary words under word-like domains into placeholders', () => {
    const d = { a: 'text.primary and time.sleep', b: 'number.of items, date.format, update.now', c: 'select.all' };
    expect(run(d).items[0].data).toEqual(d);
  });

  it('does turn a word-like domain into a placeholder when it looks like an entity', () => {
    const out = run({ entity: 'text.note', a: 'text.note', b: `{{ states('number.fan_speed') }} and select.mode_2`, c: `{{ states('time.alarm') }}` });
    const s = text(out.items);
    for (const id of ['text.note', 'number.fan_speed', 'select.mode_2', 'time.alarm']) expect(s).not.toContain(id);
  });

  it('builds fresh objects and never changes the input', () => {
    const input = item({ entity: 'light.a', list: ['light.b'] });
    const snapshot = text(input);
    const out = toPlaceholders('card', [input]);
    expect(text(input)).toBe(snapshot);
    expect(out.items[0]).not.toBe(input);
    expect(out.items[0].data).not.toBe(input.data);
  });

  it('keeps __proto__ keys as data and pollutes nothing', () => {
    const data = JSON.parse('{"__proto__": {"polluted": "light.a"}, "entity": "light.a"}');
    const out = run(data);
    expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    expect(text(out.items)).not.toContain('light.a');
  });

  it('works on every kind and leaves no original id in any of them', () => {
    const cases: [TransferKind, unknown][] = [
      ['image', { svg: '<svg/>', view_box: '0 0 1 1', bindings: [{ entity: 'sensor.pool_temp', attribute: 'x' }] }],
      ['card', { type: 'custom:magic-card', entity: 'sensor.pool_temp', name: 'Pool sensor.pool_temp' }],
      ['animation', { description: 'for sensor.pool_temp', steps: [] }],
      ['theme', { 'primary-color': '#fff', 'x-note': 'sensor.pool_temp' }],
      ['shape', { label: 'sensor.pool_temp' }],
      ['icon', { svg: '<svg><title>sensor.pool_temp</title></svg>' }],
    ];
    for (const [kind, data] of cases) {
      const out = toPlaceholders(kind, [item(data, { name: 'My sensor.pool_temp', keywords: ['sensor.pool_temp'], author: 'sensor.pool_temp' }) as never]);
      expect(text(out.items), kind).not.toContain('pool_temp');
      expect(out.placeholders, kind).toEqual([{ id: 'sensor.mc_placeholder_1', domain: 'sensor' }]);
    }
  });

  it('handles long hostile strings in linear time', () => {
    const t0 = Date.now();
    run({ a: 'a.'.repeat(50000), b: 'url('.repeat(50000), c: 'light.'.repeat(50000), d: 'x'.repeat(200000) });
    expect(Date.now() - t0).toBeLessThan(2000);
  });
});

describe('export through the envelope', () => {
  it('writes the placeholders in the header and no original id anywhere, in both formats', () => {
    const p = kit.placeholderItems('card', [item({ type: 'custom:magic-card', entity: 'light.kitchen', text: `{{ states('sensor.secret_room') }}` })]);
    for (const format of ['json', 'yaml'] as const) {
      const out = serialiseTransfer('card', p.items, format, { placeholders: p.placeholders });
      expect(out).not.toMatch(/kitchen|secret_room/);
      expect(out).toContain('light.mc_placeholder_1');
      expect(out).toContain('sensor.mc_placeholder_2');
    }
    const json = JSON.parse(serialiseTransfer('card', p.items, 'json', { placeholders: p.placeholders }));
    expect(Object.keys(json)).toEqual(['magic_card_export', 'kind', 'generator', 'placeholders', 'items']);
    expect(json.placeholders).toEqual([{ id: 'light.mc_placeholder_1', domain: 'light' }, { id: 'sensor.mc_placeholder_2', domain: 'sensor' }]);
  });

  it('writes no placeholders key when there are none', () => {
    const out = JSON.parse(serialiseTransfer('shape', [item({ corner: 1 })] as never, 'json', { placeholders: [] }));
    expect('placeholders' in out).toBe(false);
  });
});

describe('header placeholders on import', () => {
  const file = (placeholders: unknown) => JSON.stringify({ magic_card_export: TRANSFER_FORMAT, kind: 'shape', placeholders, items: [{ id: 's', name: 'S', data: { corner: 10 } }] });
  const parse = (placeholders: unknown) => parseTransfer(file(placeholders), { accept: ['shape'], kit });
  const about = (r: ReturnType<typeof parse>) => (r.ok ? r.notes.filter((n) => n.path.startsWith('placeholders')).map((n) => n.path) : ['refused']);

  it('accepts a well-formed list without a note', () => {
    expect(about(parse([{ id: 'light.mc_placeholder_1', domain: 'light' }]))).toEqual([]);
  });

  it('drops malformed entries and says which', () => {
    const r = parse([{ id: 'light.mc_placeholder_1', domain: 'light' }, { id: 'light.kitchen', domain: 'light' }, { id: 'light.mc_placeholder_2', domain: 'sensor' }, 'x', { id: 'Light.mc_placeholder_3', domain: 'Light' }]);
    expect(about(r)).toEqual(['placeholders[1]', 'placeholders[2]', 'placeholders[3]', 'placeholders[4]']);
  });

  it('drops a header that is not a list', () => {
    expect(about(parse('light.kitchen'))).toEqual(['placeholders']);
  });

  it('stops looking after a bounded number of entries', () => {
    const many = Array.from({ length: 5000 }, (_, i) => ({ id: `light.mc_placeholder_${i + 1}`, domain: 'light' }));
    expect(about(parse(many))).toEqual(['placeholders']);
  });
});
