import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MagicCardRef } from '../src/contracts/forum-shot';
import { dashboardName, rowKey, sortedRows } from '../src/forum-shot/card-table';
import { MagicCardForumShot } from '../src/forum-shot/element';
import '../src/forum-shot';

const ref = (o: Partial<MagicCardRef> & { cardName: string }): MagicCardRef => ({
  dashboard: null,
  view: 'Home',
  path: [0, 0],
  label: o.cardName,
  remote: [],
  lock: null,
  fontHosts: [],
  dashboardTitle: '',
  ...o,
});

describe('sortedRows', () => {
  const rows = [ref({ cardName: 'b', path: [0, 0] }), ref({ cardName: 'a', path: [0, 1], lock: 'limit' }), ref({ cardName: 'C', path: [0, 2] })];

  it('keeps dashboard order with no sort and never changes its input', () => {
    expect(sortedRows(rows, null, 'en').map((r) => r.cardName)).toEqual(['b', 'a', 'C']);
    expect(rows.map((r) => r.cardName)).toEqual(['b', 'a', 'C']);
  });

  it('sorts by the card name in the locale, case-blind, and descending on request', () => {
    expect(sortedRows(rows, { key: 'card', dir: 'ascending' }, 'en').map((r) => r.cardName)).toEqual(['a', 'b', 'C']);
    expect(sortedRows(rows, { key: 'card', dir: 'descending' }, 'en').map((r) => r.cardName)).toEqual(['C', 'b', 'a']);
  });

  it('sorts numbers inside names by value and accents by the locale', () => {
    const r = [ref({ cardName: 'Card 10' }), ref({ cardName: 'Card 2' }), ref({ cardName: 'Zebra' }), ref({ cardName: 'Ärger' })];
    expect(sortedRows(r, { key: 'card', dir: 'ascending' }, 'sv').map((x) => x.cardName)).toEqual(['Card 2', 'Card 10', 'Zebra', 'Ärger']);
    expect(sortedRows(r, { key: 'card', dir: 'ascending' }, 'de').map((x) => x.cardName)).toEqual(['Ärger', 'Card 2', 'Card 10', 'Zebra']);
  });

  it('puts available cards before locked ones, and keeps dashboard order among equals', () => {
    const r = [ref({ cardName: 'x', lock: 'cannot_judge' }), ref({ cardName: 'y' }), ref({ cardName: 'z', lock: 'custom_card' }), ref({ cardName: 'w' })];
    expect(sortedRows(r, { key: 'status', dir: 'ascending' }, 'en').map((x) => x.cardName)).toEqual(['y', 'w', 'z', 'x']);
  });

  it('sorts the default dashboard under its readable name', () => {
    const r = [ref({ cardName: '1', dashboard: 'k', dashboardTitle: 'Kitchen' }), ref({ cardName: '2' })];
    expect(sortedRows(r, { key: 'dashboard', dir: 'ascending' }, 'en', 'Aardvark').map((x) => x.cardName)).toEqual(['2', '1']);
  });
});

describe('dashboardName and rowKey', () => {
  it('names the default dashboard, whose title is empty, and a titleless one by its path', () => {
    expect(dashboardName(ref({ cardName: 'a' }), 'Overview')).toBe('Overview');
    expect(dashboardName(ref({ cardName: 'a', dashboard: 'k', dashboardTitle: 'Kitchen' }), 'Overview')).toBe('Kitchen');
    expect(dashboardName(ref({ cardName: 'a', dashboard: 'k' }), 'Overview')).toBe('k');
  });

  it('keys a row on dashboard and index path', () => {
    expect(rowKey(ref({ cardName: 'a', path: [0, 1] }))).not.toBe(rowKey(ref({ cardName: 'a', path: [0, 2] })));
    expect(rowKey(ref({ cardName: 'a', dashboard: 'k' }))).not.toBe(rowKey(ref({ cardName: 'a' })));
  });
});

const mc = (extra: Record<string, unknown> = {}) => ({ type: 'custom:magic-card', ...extra });
function ws(cards: Record<string, unknown>[]) {
  const callWS = vi.fn(async (msg: Record<string, unknown>) => (msg.type === 'lovelace/dashboards/list' ? [] : { views: [{ title: 'Home', cards }] }));
  return { callWS, language: 'en', panels: { lovelace: { title: 'Overview' } } };
}
async function mount(hass: unknown, narrow = false) {
  const el = document.createElement('magic-card-forum-shot') as MagicCardForumShot;
  el.narrow = narrow;
  el.hass = hass as never;
  document.body.append(el);
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
  }
  return el;
}
const $ = <T extends Element>(el: Element, s: string) => el.shadowRoot!.querySelector<T>(s);
const $$ = <T extends Element>(el: Element, s: string) => [...el.shadowRoot!.querySelectorAll<T>(s)];
const flush = async (el: MagicCardForumShot) => {
  for (let i = 0; i < 4; i++) {
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
  }
};
const names = (el: Element) => $$<HTMLTableRowElement>(el, 'tbody tr').map((r) => r.querySelector('label')!.textContent!.trim());

afterEach(() => {
  document.body.innerHTML = '';
});

describe('the card table', () => {
  const cards = [mc({ name: 'Beta' }), mc({ name: 'Alpha', css: '@import url(https://fonts.googleapis.com/css2?family=Lora);' }), mc({ name: 'Gamma', rows: [{ type: 'custom-card' }] })];

  it('has explicit table roles, sortable headers as buttons with aria-sort, and none sorted on opening', async () => {
    const el = await mount(ws(cards));
    expect($(el, 'table')!.getAttribute('role')).toBe('table');
    const ths = $$(el, 'thead th');
    expect(ths.map((h) => h.getAttribute('role'))).toEqual(Array(4).fill('columnheader'));
    expect(ths.every((h) => h.querySelector('button'))).toBe(true);
    expect(ths.map((h) => h.getAttribute('aria-sort'))).toEqual(['none', 'none', 'none', 'none']);
    expect(names(el)).toEqual(['Beta', 'Alpha', 'Gamma']);
  });

  it('shows the readable name of the default dashboard', async () => {
    const el = await mount(ws(cards));
    expect($$(el, 'tbody tr')[0].querySelector('td')!.textContent).toContain('Overview');
  });

  it('sorts ascending on the first click, descending on the second, and marks the column', async () => {
    const el = await mount(ws(cards));
    const btn = () => $$<HTMLButtonElement>(el, 'thead th button')[2];
    btn().click();
    await flush(el);
    expect(names(el)).toEqual(['Alpha', 'Beta', 'Gamma']);
    expect($$(el, 'thead th')[2].getAttribute('aria-sort')).toBe('ascending');
    btn().click();
    await flush(el);
    expect(names(el)).toEqual(['Gamma', 'Beta', 'Alpha']);
    expect($$(el, 'thead th')[2].getAttribute('aria-sort')).toBe('descending');
    expect($$(el, 'thead th')[0].getAttribute('aria-sort')).toBe('none');
  });

  it('selection stays on the card after a sort', async () => {
    const el = await mount(ws(cards));
    $$<HTMLInputElement>(el, 'input[name=card]')[0].click();
    await flush(el);
    $$<HTMLButtonElement>(el, 'thead th button')[2].click();
    await flush(el);
    const checked = $$<HTMLInputElement>(el, 'input[name=card]:checked');
    expect(checked.length).toBe(1);
    expect(checked[0].closest('tr')!.querySelector('label')!.textContent!.trim()).toBe('Beta');
    expect($<HTMLButtonElement>(el, 'button.download')!.getAttribute('aria-disabled')).toBe('false');
  });

  it('a click on the row selects through its radio; a locked row stays unselectable', async () => {
    const el = await mount(ws(cards));
    const rows = $$<HTMLTableRowElement>(el, 'tbody tr');
    rows[1].querySelector('td:nth-child(2)')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flush(el);
    expect(rows[1].querySelector<HTMLInputElement>('input')!.checked).toBe(true);
    rows[2].querySelector('td')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flush(el);
    expect(rows[2].querySelector<HTMLInputElement>('input')!.checked).toBe(false);
    expect(rows[1].querySelector<HTMLInputElement>('input')!.checked).toBe(true);
  });

  it('locks a row on lock only: a Google font row is available, and a locked row says Locked, the reason and no host', async () => {
    const el = await mount(ws(cards));
    const rows = $$<HTMLTableRowElement>(el, 'tbody tr');
    expect(rows[1].querySelector<HTMLInputElement>('input')!.disabled).toBe(false);
    expect(rows[1].lastElementChild!.textContent).toContain('Available');
    const locked = rows[2];
    expect(locked.querySelector<HTMLInputElement>('input')!.disabled).toBe(true);
    const status = locked.lastElementChild!.textContent!;
    expect(status).toContain('Locked');
    expect(status).not.toContain('googleapis');
    expect(locked.querySelector('input')!.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('labels each stacked value, and the narrow property reaches the host', async () => {
    const el = await mount(ws(cards), true);
    expect(el.hasAttribute('narrow')).toBe(true);
    const cells = $$<HTMLElement>(el, 'tbody tr:first-child td');
    expect(cells.map((c) => c.dataset.label)).toEqual(['Dashboard', 'View', 'Card', 'Status']);
  });

  it('opening the tab again returns to dashboard order', async () => {
    const el = await mount(ws(cards));
    $$<HTMLButtonElement>(el, 'thead th button')[2].click();
    await flush(el);
    el.remove();
    document.body.append(el);
    await flush(el);
    expect(names(el)).toEqual(['Beta', 'Alpha', 'Gamma']);
  });

  it('picking a row makes no request and renders no preview', async () => {
    const hass = ws(cards);
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const el = await mount(hass);
    const calls = hass.callWS.mock.calls.length;
    $$<HTMLInputElement>(el, 'input[name=card]')[0].click();
    await flush(el);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(hass.callWS.mock.calls.length).toBe(calls);
    expect($(el, 'img.preview')).toBeNull();
    fetchSpy.mockRestore();
  });
});
