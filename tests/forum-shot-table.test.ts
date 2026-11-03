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
  const rows = [
    ref({ cardName: 'b', path: [0, 0] }),
    ref({ cardName: 'a', path: [0, 1], lock: 'limit' }),
    ref({ cardName: 'C', path: [0, 2] }),
  ];

  it('keeps dashboard order with no sort and never changes its input', () => {
    expect(sortedRows(rows, null, 'en').map((r) => r.cardName)).toEqual(['b', 'a', 'C']);
    expect(rows.map((r) => r.cardName)).toEqual(['b', 'a', 'C']);
  });

  it('sorts by the card name in the locale, case-blind, and descending on request', () => {
    expect(
      sortedRows(rows, { key: 'card', dir: 'ascending' }, 'en').map((r) => r.cardName),
    ).toEqual(['a', 'b', 'C']);
    expect(
      sortedRows(rows, { key: 'card', dir: 'descending' }, 'en').map((r) => r.cardName),
    ).toEqual(['C', 'b', 'a']);
  });

  it('sorts numbers inside names by value and accents by the locale', () => {
    const r = [
      ref({ cardName: 'Card 10' }),
      ref({ cardName: 'Card 2' }),
      ref({ cardName: 'Zebra' }),
      ref({ cardName: 'Ärger' }),
    ];
    expect(sortedRows(r, { key: 'card', dir: 'ascending' }, 'sv').map((x) => x.cardName)).toEqual([
      'Card 2',
      'Card 10',
      'Zebra',
      'Ärger',
    ]);
    expect(sortedRows(r, { key: 'card', dir: 'ascending' }, 'de').map((x) => x.cardName)).toEqual([
      'Ärger',
      'Card 2',
      'Card 10',
      'Zebra',
    ]);
  });

  it('puts available cards before locked ones, and keeps dashboard order among equals', () => {
    const r = [
      ref({ cardName: 'x', lock: 'cannot_judge' }),
      ref({ cardName: 'y' }),
      ref({ cardName: 'z', lock: 'custom_card' }),
      ref({ cardName: 'w' }),
    ];
    expect(sortedRows(r, { key: 'status', dir: 'ascending' }, 'en').map((x) => x.cardName)).toEqual(
      ['y', 'w', 'z', 'x'],
    );
  });

  it('sorts the default dashboard under its readable name', () => {
    const r = [
      ref({ cardName: '1', dashboard: 'k', dashboardTitle: 'Kitchen' }),
      ref({ cardName: '2' }),
    ];
    expect(
      sortedRows(r, { key: 'dashboard', dir: 'ascending' }, 'en', 'Aardvark').map(
        (x) => x.cardName,
      ),
    ).toEqual(['2', '1']);
  });
});

describe('dashboardName and rowKey', () => {
  it('names the default dashboard, whose title is empty, and a titleless one by its path', () => {
    expect(dashboardName(ref({ cardName: 'a' }), 'Overview')).toBe('Overview');
    expect(
      dashboardName(ref({ cardName: 'a', dashboard: 'k', dashboardTitle: 'Kitchen' }), 'Overview'),
    ).toBe('Kitchen');
    expect(dashboardName(ref({ cardName: 'a', dashboard: 'k' }), 'Overview')).toBe('k');
  });

  it('keys a row on dashboard and index path', () => {
    expect(rowKey(ref({ cardName: 'a', path: [0, 1] }))).not.toBe(
      rowKey(ref({ cardName: 'a', path: [0, 2] })),
    );
    expect(rowKey(ref({ cardName: 'a', dashboard: 'k' }))).not.toBe(rowKey(ref({ cardName: 'a' })));
  });
});

const mc = (extra: Record<string, unknown> = {}) => ({ type: 'custom:magic-card', ...extra });
function ws(cards: Record<string, unknown>[]) {
  const callWS = vi.fn(async (msg: Record<string, unknown>) =>
    msg.type === 'lovelace/dashboards/list' ? [] : { views: [{ title: 'Home', cards }] },
  );
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
const $$ = <T extends Element>(el: Element, s: string) => [
  ...el.shadowRoot!.querySelectorAll<T>(s),
];
const flush = async (el: MagicCardForumShot) => {
  for (let i = 0; i < 4; i++) {
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
  }
};
const names = (el: Element) =>
  $$<HTMLTableRowElement>(el, 'tbody tr').map((r) => r.querySelector('label')!.textContent!.trim());

afterEach(() => {
  document.body.innerHTML = '';
});

describe('the card table', () => {
  const cards = [
    mc({ name: 'Beta' }),
    mc({ name: 'Alpha', css: '@import url(https://fonts.googleapis.com/css2?family=Lora);' }),
    mc({ name: 'Gamma', rows: [{ type: 'custom-card' }] }),
  ];

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
    expect($<HTMLButtonElement>(el, 'button.download')!.getAttribute('aria-disabled')).toBe(
      'false',
    );
  });

  it('a click on the row selects through its radio; a locked row stays unselectable', async () => {
    const el = await mount(ws(cards));
    const rows = $$<HTMLTableRowElement>(el, 'tbody tr');
    rows[1]
      .querySelector('td:nth-child(2)')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flush(el);
    expect(rows[1].querySelector<HTMLInputElement>('input')!.checked).toBe(true);
    rows[2].querySelector('td')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flush(el);
    expect(rows[2].querySelector<HTMLInputElement>('input')!.checked).toBe(false);
    expect(rows[1].querySelector<HTMLInputElement>('input')!.checked).toBe(true);
  });

  it('locks a row on lock only: a Google font row is available, and a locked row keeps its radio disabled and described', async () => {
    const el = await mount(ws(cards));
    const rows = $$<HTMLTableRowElement>(el, 'tbody tr');
    expect(rows[1].querySelector<HTMLInputElement>('input')!.disabled).toBe(false);
    const locked = rows[2];
    expect(locked.querySelector<HTMLInputElement>('input')!.disabled).toBe(true);
    const note = $(el, `#${locked.querySelector('input')!.getAttribute('aria-describedby')}`)!;
    expect(note.hasAttribute('hidden')).toBe(true);
    expect(note.textContent).toContain('custom-card');
  });

  it('stays a real table at every width: no stacked labels, the table sits in a focusable labelled region', async () => {
    const el = await mount(ws(cards), true);
    expect(el.hasAttribute('narrow')).toBe(true);
    expect($$(el, '[data-label]')).toEqual([]);
    const wrap = $<HTMLElement>(el, 'div.scroll')!;
    expect(wrap.getAttribute('role')).toBe('region');
    expect(wrap.getAttribute('tabindex')).toBe('0');
    expect(wrap.getAttribute('aria-label')).toBe('Magic Card');
    expect(wrap.querySelector('table')!.hasAttribute('aria-label')).toBe(false);
  });

  it('one header row Dashboard, View, Card, Status and one row per card, with no label inside a cell', async () => {
    const el = await mount(ws(cards));
    expect($$(el, 'thead tr')).toHaveLength(1);
    expect($$(el, 'thead th').map((h) => h.textContent!.trim().replace(/[^\p{L}]/gu, ''))).toEqual(['Dashboard', 'View', 'Card', 'Status']);
    expect($$(el, 'tbody tr')).toHaveLength(cards.length);
    expect($$(el, 'td [data-label], td > .status, td > .hint')).toEqual([]);
  });

  it('sorted by Status the order is available first, and each popup shows its own row', async () => {
    const el = await mount(ws(cards));
    $$<HTMLButtonElement>(el, 'thead th button')[3].click();
    await flush(el);
    expect(names(el)).toEqual(['Beta', 'Alpha', 'Gamma']);
    const rows = $$<HTMLElement>(el, 'tbody tr');
    rows[2].querySelector<HTMLButtonElement>('button.tip')!.click();
    await flush(el);
    expect($(el, '.pop-h')!.textContent!.trim()).toBe('Locked');
    expect($(el, '.pop')!.textContent).toContain('custom-card');
    expect(rows[2].contains($(el, '.pop'))).toBe(true);
    rows[1].querySelector<HTMLButtonElement>('button.tip')!.click();
    await flush(el);
    expect($$(el, '.pop')).toHaveLength(1);
    expect(rows[1].contains($(el, '.pop'))).toBe(true);
    expect($(el, '.pop')!.textContent).toContain('fonts.googleapis.com');
  });

  it('the four new keys exist in en-GB, en-US and nl, and the popup text comes from them', async () => {
    const fs = await import('node:fs');
    const keys = ['status-button-available', 'status-button-locked', 'status-detail-available', 'status-close'].map(
      (k) => `forum-shot.card-table.${k}`,
    );
    for (const loc of ['en-GB', 'en-US', 'nl']) {
      const j = JSON.parse(fs.readFileSync(`src/forum-shot/i18n/${loc}.json`, 'utf8'));
      for (const k of keys) expect(j[k]?.text, `${loc} ${k}`).toBeTruthy();
    }
    const src = fs.readFileSync('src/forum-shot/element.ts', 'utf8');
    expect(src).not.toMatch(/show details|Close<\/button>/);
  });

  describe('the status button', () => {
    const btn = (el: Element, row: number) =>
      $$<HTMLElement>(el, 'tbody tr')[row].querySelector<HTMLButtonElement>('button.tip')!;
    const active = (el: Element) => el.shadowRoot!.activeElement;

    it('is one named button per row with no visible text in the cell', async () => {
      const el = await mount(ws(cards));
      expect(btn(el, 1).getAttribute('aria-label')).toBe('Available, show details');
      expect(btn(el, 2).getAttribute('aria-label')).toBe('Locked, show details');
      expect(btn(el, 2).getAttribute('aria-expanded')).toBe('false');
      expect(btn(el, 2).hasAttribute('aria-controls')).toBe(false);
      expect(btn(el, 2).getAttribute('type')).toBe('button');
      expect($$(el, '.pop')).toEqual([]);
      expect(btn(el, 1).textContent!.trim()).toBe('');
    });

    it('opens a dialog with the word, the reason and a Close button holding focus, and tells the button', async () => {
      const el = await mount(ws(cards));
      btn(el, 2).click();
      await flush(el);
      const pop = $<HTMLElement>(el, '.pop')!;
      expect(pop.getAttribute('role')).toBe('dialog');
      expect(btn(el, 2).getAttribute('aria-expanded')).toBe('true');
      expect(btn(el, 2).getAttribute('aria-controls')).toBe(pop.id);
      expect(pop.getAttribute('aria-labelledby')).toBe(pop.querySelector('.pop-h')!.id);
      expect(pop.querySelector('.pop-h')!.textContent!.trim()).toBe('Locked');
      expect(pop.textContent).toContain('custom-card');
      expect(active(el)).toBe(pop.querySelector('button'));
      expect(pop.querySelector('button')!.textContent!.trim()).toBe('Close');
    });

    it('shows the available word, its line and the font hosts', async () => {
      const el = await mount(ws(cards));
      btn(el, 1).click();
      await flush(el);
      const pop = $<HTMLElement>(el, '.pop')!;
      expect(pop.querySelector('.pop-h')!.textContent!.trim()).toBe('Available');
      expect(pop.textContent).toContain('You can pick this card for a forum shot.');
      expect(pop.textContent).toContain('Fonts from fonts.googleapis.com');
      btn(el, 0).click();
      await flush(el);
      const plain = $<HTMLElement>(el, '.pop')!.textContent!;
      expect(plain).toContain('You can pick this card for a forum shot.');
      expect(plain).not.toContain('Fonts from');
    });

    it('closes on the same button, on Close, and on Escape, and gives focus back to the button', async () => {
      const el = await mount(ws(cards));
      btn(el, 2).click();
      await flush(el);
      btn(el, 2).click();
      await flush(el);
      expect($(el, '.pop')).toBeNull();
      btn(el, 2).click();
      await flush(el);
      $<HTMLButtonElement>(el, '.pop button')!.click();
      await flush(el);
      expect($(el, '.pop')).toBeNull();
      expect(active(el)).toBe(btn(el, 2));
      btn(el, 2).click();
      await flush(el);
      $(el, 'div.scroll')!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
      await flush(el);
      expect($(el, '.pop')).toBeNull();
      expect(active(el)).toBe(btn(el, 2));
    });

    it('opens one popup at a time', async () => {
      const el = await mount(ws(cards));
      btn(el, 1).click();
      await flush(el);
      btn(el, 2).click();
      await flush(el);
      expect($$(el, '.pop').length).toBe(1);
      expect(btn(el, 1).getAttribute('aria-expanded')).toBe('false');
      expect(btn(el, 2).getAttribute('aria-expanded')).toBe('true');
    });

    it('closes on a pointerdown outside its row, and not on one inside it', async () => {
      const el = await mount(ws(cards));
      btn(el, 2).click();
      await flush(el);
      $<HTMLElement>(el, '.pop')!.dispatchEvent(
        new Event('pointerdown', { bubbles: true, composed: true }),
      );
      await flush(el);
      expect($(el, '.pop')).not.toBeNull();
      document.body.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
      await flush(el);
      expect($(el, '.pop')).toBeNull();
    });

    it('closes when focus leaves the popup for another element, and ignores a null target', async () => {
      const el = await mount(ws(cards));
      btn(el, 2).click();
      await flush(el);
      const pop = $<HTMLElement>(el, '.pop')!;
      pop.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
      await flush(el);
      expect($(el, '.pop')).not.toBeNull();
      pop.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: $(el, 'button.download') }),
      );
      await flush(el);
      expect($(el, '.pop')).toBeNull();
    });

    it('closes when the wrapper scrolls and when the tab is opened again', async () => {
      const el = await mount(ws(cards));
      btn(el, 2).click();
      await flush(el);
      $(el, 'div.scroll')!.dispatchEvent(new Event('scroll'));
      await flush(el);
      expect($(el, '.pop')).toBeNull();
      btn(el, 2).click();
      await flush(el);
      el.remove();
      document.body.append(el);
      await flush(el);
      expect($(el, '.pop')).toBeNull();
    });

    it('a click inside the popup never selects the row, and a tap on a locked row toggles its popup', async () => {
      const el = await mount(ws(cards));
      btn(el, 1).click();
      await flush(el);
      $<HTMLElement>(el, '.pop')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await flush(el);
      expect($$<HTMLInputElement>(el, 'input[name=card]:checked')).toEqual([]);
      btn(el, 1).click();
      await flush(el);
      const locked = $$<HTMLElement>(el, 'tbody tr')[2];
      locked.querySelector('td')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await flush(el);
      expect($(el, '.pop')).not.toBeNull();
      locked.querySelector('td')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await flush(el);
      expect($(el, '.pop')).toBeNull();
    });

    it('a pointerdown on a cell of an available row closes the popup, and one on the open button or on a locked row keeps it', async () => {
      const el = await mount(ws(cards));
      btn(el, 2).click();
      await flush(el);
      const rows = $$<HTMLElement>(el, 'tbody tr');
      const down = () => new Event('pointerdown', { bubbles: true, composed: true });
      btn(el, 2).dispatchEvent(down());
      rows[2].querySelector('td')!.dispatchEvent(down());
      await flush(el);
      expect($(el, '.pop')).not.toBeNull();
      const cell = rows[1].querySelector('td')!;
      cell.dispatchEvent(down());
      cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await flush(el);
      expect($(el, '.pop')).toBeNull();
      expect(rows[1].className).toBe('picked');
    });

    it('a pointerdown and click on a cell or the label of the open available row close the popup and pick the row', async () => {
      const el = await mount(ws(cards));
      const down = () => new Event('pointerdown', { bubbles: true, composed: true });
      for (const sel of ['td', 'label']) {
        btn(el, 1).click();
        await flush(el);
        expect($(el, '.pop')).not.toBeNull();
        const target = $$<HTMLElement>(el, 'tbody tr')[1].querySelector<HTMLElement>(sel)!;
        target.dispatchEvent(down());
        target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await flush(el);
        expect($(el, '.pop')).toBeNull();
        expect($$<HTMLElement>(el, 'tbody tr')[1].className).toBe('picked');
      }
    });

    it('closes when focus moves from the popup to the Status button of another row', async () => {
      const el = await mount(ws(cards));
      btn(el, 1).click();
      await flush(el);
      $<HTMLElement>(el, '.pop')!.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: btn(el, 2) }),
      );
      await flush(el);
      expect($(el, '.pop')).toBeNull();
    });

    it('keeps the popup open when focus moves to the scroll region or the open button', async () => {
      const el = await mount(ws(cards));
      btn(el, 2).click();
      await flush(el);
      const pop = $<HTMLElement>(el, '.pop')!;
      for (const to of [$(el, '.scroll'), btn(el, 2)]) {
        pop.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: to }));
        await flush(el);
        expect($(el, '.pop')).not.toBeNull();
      }
    });

    it('removes its document and window listeners on Close, on Escape and on disconnect', async () => {
      const spies = [
        vi.spyOn(document, 'addEventListener'),
        vi.spyOn(document, 'removeEventListener'),
        vi.spyOn(window, 'addEventListener'),
        vi.spyOn(window, 'removeEventListener'),
      ];
      const [dAdd, dRemove, wAdd, wRemove] = spies;
      const el = await mount(ws(cards));
      const open = async () => {
        btn(el, 2).click();
        await flush(el);
      };
      await open();
      $<HTMLButtonElement>(el, '.pop .close')!.click();
      await flush(el);
      await open();
      $<HTMLElement>(el, '.scroll')!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
      await flush(el);
      await open();
      el.remove();
      expect(dAdd.mock.calls.filter((c) => c[0] === 'pointerdown').length).toBe(3);
      expect(dRemove.mock.calls.filter((c) => c[0] === 'pointerdown').length).toBe(3);
      expect(wAdd.mock.calls.filter((c) => c[0] === 'resize').length).toBe(3);
      expect(wRemove.mock.calls.filter((c) => c[0] === 'resize').length).toBe(3);
      spies.forEach((spy) => spy.mockRestore());
    });
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
