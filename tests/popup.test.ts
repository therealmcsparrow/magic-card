import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../src/index';
import type { MagicCardConfig, PopupConfig } from '../src/types';
import { isValidPopupHash, normalizePopupHash } from '../src/utils/popup-hash';
import { SwipeTracker, backdropOpacity, hashMatches, popupStyleVars, triggerFired } from '../src/utils/popup-run';
import { popupCoordinator } from '../src/card/popup-coordinator';
import { CARD_SYNC_KEYS, mergeTemplateWithOverrides } from '../src/services/template-merge';

type Card = HTMLElement & {
  setConfig(c: MagicCardConfig): void;
  hass: unknown;
  editMode: boolean;
  preview: boolean;
  updateComplete: Promise<unknown>;
  getCardSize(): number;
  getGridOptions(): Record<string, unknown>;
  _handleAction(e: Event, mod: unknown, kind: string): void;
};

const states = (s: Record<string, string>) =>
  Object.fromEntries(Object.entries(s).map(([id, state]) => [id, { entity_id: id, state, attributes: {} }]));

const config = (popup?: PopupConfig, extra: Record<string, unknown> = {}) =>
  ({
    type: 'custom:magic-card',
    name: 'Kitchen',
    rows: [{ id: 'r', layout: '1', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: 'Kitchen lights' }] }] }],
    ...(popup ? { popup } : {}),
    ...extra,
  }) as unknown as MagicCardConfig;

const cards: Card[] = [];
async function mount(cfg: MagicCardConfig, opts: { parent?: HTMLElement; hass?: unknown; preview?: boolean; editMode?: boolean } = {}): Promise<Card> {
  const el = document.createElement('magic-card') as Card;
  el.hass = opts.hass ?? { states: states({ 'binary_sensor.doorbell': 'off' }), language: 'en' };
  if (opts.preview) el.preview = true;
  if (opts.editMode) el.editMode = true;
  el.setConfig(cfg);
  (opts.parent ?? document.body).appendChild(el);
  cards.push(el);
  await settle(el);
  return el;
}

/** Lit renders, then the controller shows the dialog in hostUpdated (another render may follow). */
async function settle(el: Card): Promise<void> {
  for (let i = 0; i < 3; i++) await el.updateComplete;
}
const dialog = (el: Card) => el.shadowRoot!.querySelector<HTMLDialogElement>('dialog.mc-popup');
const isOpen = (el: Card) => !!dialog(el)?.open && !!dialog(el)?.querySelector('.mc-popup-surface');
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function navigate(hash: string) {
  history.pushState(null, '', hash ? `#${hash}` : location.pathname);
  window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
}

beforeEach(() => {
  history.replaceState(null, '', location.pathname);
  // no close animation in tests (reduced motion → immediate)
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} }));
});
afterEach(() => {
  for (const c of cards.splice(0)) c.remove();
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('pop-up utils', () => {
  it('normalises and validates pop-up IDs', () => {
    expect(normalizePopupHash('  #kitchen ')).toBe('kitchen');
    expect(isValidPopupHash('kitchen-1_a')).toBe(true);
    expect(isValidPopupHash('my kitchen')).toBe(false);
    expect(isValidPopupHash('-x')).toBe(false);
  });

  it('matches the URL hash case-sensitively, decoding it', () => {
    expect(hashMatches('#kitchen', 'kitchen')).toBe(true);
    expect(hashMatches('#Kitchen', 'kitchen')).toBe(false);
    expect(hashMatches('#kitchen', undefined)).toBe(false);
    expect(hashMatches('', 'kitchen')).toBe(false);
    expect(hashMatches('#k%C3%BCche', 'küche')).toBe(true);
  });

  it('fires a trigger only when the entity changes into the state', () => {
    const t = { entity: 'binary_sensor.doorbell', state: 'on' };
    expect(triggerFired(t, states({ 'binary_sensor.doorbell': 'off' }), states({ 'binary_sensor.doorbell': 'on' }))).toBe(true);
    expect(triggerFired(t, states({ 'binary_sensor.doorbell': 'on' }), states({ 'binary_sensor.doorbell': 'on' }))).toBe(false);
    expect(triggerFired(t, states({ 'binary_sensor.doorbell': 'on' }), states({ 'binary_sensor.doorbell': 'off' }))).toBe(false);
    expect(triggerFired({ entity: 'binary_sensor.doorbell' }, states({ 'binary_sensor.doorbell': 'on' }), states({ 'binary_sensor.doorbell': 'off' }))).toBe(true);
    expect(triggerFired(t, undefined, states({ 'binary_sensor.doorbell': 'on' }))).toBe(false);
    expect(triggerFired({ state: 'on' }, states({}), states({}))).toBe(false);
  });

  it('turns the settings into CSS variables with defaults', () => {
    expect(popupStyleVars({})).toBe('--mc-popup-width: 600px; --mc-popup-max-height: 90vh; --mc-popup-blur: 8px; --mc-popup-backdrop-opacity: 0.4');
    const vars = popupStyleVars({ width: '480', max_height: '70vh', backdrop_blur: '0px', backdrop_opacity: 60 }, '20px');
    expect(vars).toContain('--mc-popup-width: 480px');
    expect(vars).toContain('--mc-popup-backdrop-opacity: 0.6');
    expect(vars).toContain('--mc-popup-radius: 20px');
    expect(popupStyleVars({ width: 'red; x: y' })).toContain('--mc-popup-width: 600px');
    expect(popupStyleVars({}, '16px 4px')).not.toContain('radius');
    expect(backdropOpacity(2)).toBe(0.02);
    expect(backdropOpacity('x')).toBe(0.4);
  });

  it('closes a swipe past the threshold or on a quick flick, follows the finger, never above rest', () => {
    const s = new SwipeTracker();
    s.start(100, 0);
    expect(s.move(60)).toBe(0);
    expect(s.move(150)).toBe(50);
    expect(s.end(150, 1000, 600)).toBe(false); // slow, 50px < 80px
    s.start(100, 0);
    expect(s.end(190, 1000, 600)).toBe(true); // 90px
    s.start(100, 0);
    expect(s.end(140, 40, 600)).toBe(true); // 40px in 40ms: flick
    s.start(100, 0);
    expect(s.end(150, 1000, 160)).toBe(true); // short sheet: 25% of 160 = 40px
    expect(s.end(500, 0, 100)).toBe(false); // not started
  });
});

describe('pop-up card on a dashboard', () => {
  it('is hidden: no card in the flow, zero size, a closed dialog', async () => {
    const el = await mount(config({ enabled: true, hash: 'kitchen' }));
    expect(el.shadowRoot!.querySelector('ha-card')).toBeNull();
    expect(dialog(el)).not.toBeNull();
    expect(dialog(el)!.open).toBe(false);
    expect(el.hasAttribute('data-mc-popup-hidden')).toBe(true);
    expect(el.getCardSize()).toBe(0);
    expect(el.getGridOptions()).toMatchObject({ rows: 'auto' });
    expect(el.shadowRoot!.textContent).not.toContain('Kitchen lights');
  });

  it('takes HA\'s hui-card and sections cell out of the flow and restores them', async () => {
    const cell = document.createElement('div');
    cell.className = 'card';
    cell.style.setProperty('--row-size', '2');
    const huiCard = document.createElement('hui-card');
    cell.appendChild(huiCard);
    document.body.appendChild(cell);
    const el = await mount(config({ enabled: true, hash: 'kitchen' }), { parent: huiCard });
    for (const n of [huiCard, cell]) {
      expect(n.style.position).toBe('absolute');
      expect(parseFloat(n.style.height)).toBe(0);
    }
    el.setConfig(config());
    await settle(el);
    expect(huiCard.style.position).toBe('');
    expect(cell.style.position).toBe('');
    expect(cell.style.getPropertyValue('--row-size')).toBe('2');
    expect(el.shadowRoot!.querySelector('ha-card')).not.toBeNull();
  });

  it('a normal card keeps HA\'s default size options', async () => {
    const el = await mount(config());
    expect(el.getGridOptions()).toEqual({});
    expect(el.getCardSize()).toBe(1);
    expect(dialog(el)).toBeNull();
  });

  it('opens on HA\'s navigate to #kitchen and closes with history.back()', async () => {
    const el = await mount(config({ enabled: true, hash: 'kitchen', title: 'Kitchen' }));
    navigate('kitchen');
    await settle(el);
    expect(isOpen(el)).toBe(true);
    expect(el.shadowRoot!.textContent).toContain('Kitchen lights');
    expect(dialog(el)!.getAttribute('aria-labelledby')).toBe(el.shadowRoot!.querySelector('.mc-popup-title')!.id);
    const back = vi.spyOn(history, 'back').mockImplementation(() => {});
    el.shadowRoot!.querySelector<HTMLButtonElement>('.mc-popup-close')!.click();
    await wait(10);
    await settle(el);
    expect(back).toHaveBeenCalledTimes(1);
    expect(isOpen(el)).toBe(false);
  });

  it('opened by the URL on load: closing replaces the hash instead of going back', async () => {
    history.replaceState(null, '', '#kitchen');
    const el = await mount(config({ enabled: true, hash: 'kitchen' }));
    expect(isOpen(el)).toBe(true);
    const back = vi.spyOn(history, 'back');
    el.shadowRoot!.querySelector<HTMLElement>('.mc-popup-backdrop')!.click();
    await wait(10);
    await settle(el);
    expect(back).not.toHaveBeenCalled();
    expect(location.hash).toBe('');
    expect(isOpen(el)).toBe(false);
  });

  it('closes on the back button (the hash goes away)', async () => {
    const el = await mount(config({ enabled: true, hash: 'kitchen' }));
    navigate('kitchen');
    await settle(el);
    expect(isOpen(el)).toBe(true);
    history.replaceState(null, '', location.pathname);
    window.dispatchEvent(new PopStateEvent('popstate'));
    await wait(10);
    await settle(el);
    expect(isOpen(el)).toBe(false);
  });

  it('Escape closes it and never reaches HA (its dialogs, shortcuts)', async () => {
    const el = await mount(config({ enabled: true, hash: 'kitchen' }));
    navigate('kitchen');
    await settle(el);
    const outside = vi.fn();
    document.addEventListener('keydown', outside);
    vi.spyOn(history, 'back').mockImplementation(() => {});
    const esc = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true, cancelable: true });
    el.shadowRoot!.querySelector('.mc-popup-close')!.dispatchEvent(esc);
    document.removeEventListener('keydown', outside);
    expect(outside).not.toHaveBeenCalled();
    expect(esc.defaultPrevented).toBe(true);
    await wait(10);
    await settle(el);
    expect(isOpen(el)).toBe(false);
  });

  it('only one pop-up is open at a time', async () => {
    const a = await mount(config({ enabled: true, hash: 'a' }));
    const b = await mount(config({ enabled: true, hash: 'b' }));
    navigate('a');
    await settle(a);
    expect(isOpen(a)).toBe(true);
    navigate('b'); // e.g. a button inside pop-up A
    await wait(10);
    await settle(a);
    await settle(b);
    expect(isOpen(b)).toBe(true);
    expect(isOpen(a)).toBe(false);
    expect(popupCoordinator.openHandle).toBeDefined();
  });

  it('a trigger without an ID opens it directly and closes the other pop-up', async () => {
    const a = await mount(config({ enabled: true, hash: 'a' }));
    const hass0 = { states: states({ 'binary_sensor.doorbell': 'off' }), language: 'en' };
    const b = await mount(config({ enabled: true, open_on: { entity: 'binary_sensor.doorbell', state: 'on' }, close_on: { entity: 'binary_sensor.doorbell', state: 'off' } }), { hass: hass0 });
    navigate('a');
    await settle(a);
    b.hass = { ...hass0, states: states({ 'binary_sensor.doorbell': 'on' }) };
    await wait(10);
    await settle(a);
    await settle(b);
    expect(isOpen(b)).toBe(true);
    expect(isOpen(a)).toBe(false);
    expect(location.hash).toBe(''); // A's hash replaced away
    b.hass = { ...hass0, states: states({ 'binary_sensor.doorbell': 'off' }) };
    await wait(10);
    await settle(b);
    expect(isOpen(b)).toBe(false);
  });

  it('an open trigger with an ID goes through the URL (back closes it)', async () => {
    const hass0 = { states: states({ 'binary_sensor.doorbell': 'off' }), language: 'en' };
    const el = await mount(config({ enabled: true, hash: 'door', open_on: { entity: 'binary_sensor.doorbell', state: 'on' } }), { hass: hass0 });
    el.hass = { ...hass0, states: states({ 'binary_sensor.doorbell': 'on' }) };
    await settle(el);
    expect(location.hash).toBe('#door');
    expect(isOpen(el)).toBe(true);
  });

  it('auto closes after the set seconds without interaction', async () => {
    const el = await mount(config({ enabled: true, hash: 'kitchen', auto_close: 0.05 }));
    vi.spyOn(history, 'back').mockImplementation(() => {});
    navigate('kitchen');
    await settle(el);
    expect(isOpen(el)).toBe(true);
    await wait(30);
    dialog(el)!.dispatchEvent(new Event('pointerdown', { bubbles: true })); // interaction resets the timer
    await wait(30);
    expect(isOpen(el)).toBe(true);
    await wait(60);
    await settle(el);
    expect(isOpen(el)).toBe(false);
  });

  it('swipe down on the sheet handle closes past the threshold, snaps back below it', async () => {
    const el = await mount(config({ enabled: true, hash: 'kitchen' }));
    vi.spyOn(history, 'back').mockImplementation(() => {});
    navigate('kitchen');
    await settle(el);
    const head = el.shadowRoot!.querySelector<HTMLElement>('.mc-popup-head')!;
    const surface = el.shadowRoot!.querySelector<HTMLElement>('.mc-popup-surface')!;
    const ptr = (type: string, y: number, t: number) => {
      const e = new PointerEvent(type, { clientY: y, isPrimary: true, button: 0, bubbles: true, pointerId: 1 });
      Object.defineProperty(e, 'timeStamp', { value: t });
      head.dispatchEvent(e);
    };
    ptr('pointerdown', 100, 0);
    ptr('pointermove', 130, 500);
    expect(surface.style.getPropertyValue('--mc-popup-drag')).toBe('30px');
    expect(surface.hasAttribute('data-dragging')).toBe(true);
    ptr('pointerup', 130, 1000);
    expect(surface.style.getPropertyValue('--mc-popup-drag')).toBe('');
    expect(isOpen(el)).toBe(true);
    ptr('pointerdown', 100, 2000);
    ptr('pointermove', 260, 2300);
    ptr('pointerup', 260, 2400);
    await wait(10);
    await settle(el);
    expect(isOpen(el)).toBe(false);
  });

  it('"Open pop-up" / "Close pop-up" actions navigate to #id and close the open one', async () => {
    const el = await mount(config({ enabled: true, hash: 'kitchen' }));
    const button = await mount(config());
    button._handleAction(new Event('x'), { actions: { tap_action: { action: 'popup', hash: '#kitchen' } } }, 'tap');
    await settle(el);
    expect(location.hash).toBe('#kitchen');
    expect(isOpen(el)).toBe(true);
    const back = vi.spyOn(history, 'back').mockImplementation(() => {});
    button._handleAction(new Event('x'), { actions: { tap_action: { action: 'close-popup' } } }, 'tap');
    await wait(10);
    await settle(el);
    expect(back).toHaveBeenCalled();
    expect(isOpen(el)).toBe(false);
  });

  it('hash and triggers do nothing for a disabled pop-up', async () => {
    const el = await mount(config({ enabled: false, hash: 'kitchen' }));
    navigate('kitchen');
    await settle(el);
    expect(dialog(el)).toBeNull();
    expect(el.shadowRoot!.querySelector('ha-card')).not.toBeNull();
  });
});

describe('pop-up card in an editor', () => {
  it('shows inline with a badge, ignores the hash; Preview pop-up opens the real pop-up', async () => {
    const el = await mount(config({ enabled: true, hash: 'kitchen' }), { preview: true });
    expect(el.shadowRoot!.querySelector('ha-card:not(.mc-popup-surface)')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('.mc-popup-badge')!.textContent!.replace(/\s+/g, ' ').trim()).toBe('Pop-up · #kitchen');
    expect(el.getCardSize()).toBe(1);
    navigate('kitchen');
    await settle(el);
    expect(isOpen(el)).toBe(false);
    expect(popupCoordinator.preview(false)).toBe(true);
    await settle(el);
    expect(isOpen(el)).toBe(true);
    // preview closes without touching the URL
    const back = vi.spyOn(history, 'back');
    el.shadowRoot!.querySelector<HTMLButtonElement>('.mc-popup-close')!.click();
    await wait(10);
    await settle(el);
    expect(back).not.toHaveBeenCalled();
    expect(isOpen(el)).toBe(false);
  });

  it('studio canvas (editMode) shows it inline too', async () => {
    const host = document.createElement('div');
    host.className = 'card-host';
    document.body.appendChild(host);
    const el = await mount(config({ enabled: true, hash: 'kitchen' }), { parent: host, editMode: true });
    expect(el.shadowRoot!.querySelector('.mc-popup-badge')).not.toBeNull();
    expect(el.hasAttribute('data-mc-popup-hidden')).toBe(false);
  });

  it('a shaped card: the pop-up surface ring is resolved unshaped (keeps its center position)', async () => {
    const el = await mount(config({ enabled: true, hash: 'kitchen' }, { shape: 'hexagon', ring: { mode: 'animated', position: 'center' } }), { preview: true });
    type R = HTMLElement & { ring: { position: string } };
    // the inline card is shaped: its ring is drawn inside
    expect((el.shadowRoot!.querySelector('ha-card:not(.mc-popup-surface) > mc-ring') as R).ring.position).toBe('inside');
    expect(popupCoordinator.preview(false)).toBe(true);
    await settle(el);
    expect(isOpen(el)).toBe(true);
    expect((el.shadowRoot!.querySelector('.mc-popup-surface > mc-ring') as R).ring.position).toBe('center');
    el.shadowRoot!.querySelector<HTMLButtonElement>('.mc-popup-close')!.click();
    await wait(10);
  });

  it('suggests the pop-up IDs of the cards on the page', async () => {
    await mount(config({ enabled: true, hash: 'kitchen' }));
    await mount(config({ enabled: true, hash: 'bath' }));
    await mount(config({ enabled: false, hash: 'off' }));
    expect(popupCoordinator.knownIds()).toEqual(['bath', 'kitchen']);
  });
});

describe('pop-up and templates', () => {
  it('popup is a card sync key: a linked card keeps its own pop-up when overridden', () => {
    expect(CARD_SYNC_KEYS).toContain('popup');
    const tpl = config({ enabled: true, hash: 'room' });
    const local = config({ enabled: true, hash: 'kitchen' }, { template: 't', not_synced: ['popup'] });
    expect(mergeTemplateWithOverrides(tpl, local).popup).toEqual({ enabled: true, hash: 'kitchen' });
    const synced = config({ enabled: true, hash: 'kitchen' }, { template: 't' });
    expect(mergeTemplateWithOverrides(tpl, synced).popup).toEqual({ enabled: true, hash: 'room' });
  });
});

describe('pop-up ID error text', () => {
  it('the action editor shows the translated message for an invalid ID and none for a valid one', async () => {
    const { render } = await import('lit');
    const { renderActionConfig } = await import('../src/editor/components/action-editor');
    const host = document.createElement('div');
    render(renderActionConfig({ action: 'popup', hash: 'my kitchen' } as never, () => {}), host);
    expect(host.querySelector('p.help.error')?.textContent).toBe('Use letters, digits, - and _ only (no spaces).');
    render(renderActionConfig({ action: 'popup', hash: 'kitchen' } as never, () => {}), host);
    expect(host.querySelector('p.help.error')).toBeNull();
  });
});
