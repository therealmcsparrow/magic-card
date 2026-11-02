import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { EntityPlaceholder } from '../contracts/share-kit';
import type { TransferItem, TransferKind } from '../contracts/preset-transfer';
import type { ThemeDoc } from '../contracts/theme-editor';
import { demoStates, demoText } from './demo-states';
import { locale, t } from './i18n';
import { NEUTRAL_PATTERN, previewSafe, wallTabletLabels, wallTabletVars } from './preview';

// The preview of an import, drawn from previewSafe copies and demo states: an address that is not an embedded image
// never reaches an element, so showing it contacts no other host.

const DATA_SVG_RE = /^<svg[\s>][^]*<\/svg>\s*$/i;

/** An embedded picture of an icon or image item (shown in an <img>, where a script never runs), or undefined. */
function picture(kind: TransferKind, data: unknown): string | undefined {
  const svg = (data as { svg?: unknown } | undefined)?.svg;
  return (kind === 'icon' || kind === 'image') && typeof svg === 'string' && DATA_SVG_RE.test(svg) ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : undefined;
}

const PATH_RE = /^[MmLlHhVvCcSsQqTtAaZz0-9eE\s,.+-]{1,20000}$/;
const COLOUR_RE = /^(?:#[0-9a-f]{3,8}|[a-z]{3,20}|(?:rgb|hsl)a?\([0-9\s.,%/]{1,40}\))$/i;
const SWATCH_KEYS = ['primary-color', 'accent-color', 'card-background-color', 'primary-text-color', 'secondary-text-color'];
const cards = new WeakMap<TransferItem, Node>();

/** A path-only icon: the path alone, drawn in an inline svg (no markup from the file reaches the page). */
function pathIcon(data: unknown): TemplateResult | undefined {
  const { path: d, view_box: vb } = (data ?? {}) as { path?: unknown; view_box?: unknown };
  return typeof d === 'string' && PATH_RE.test(d) ? html`<svg viewBox=${typeof vb === 'string' && /^[-0-9.\s]{1,60}$/.test(vb) ? vb : '0 0 24 24'} width="56" height="56" aria-hidden="true"><path d=${d} fill="currentColor"></path></svg>` : undefined;
}

/** The real card element on the previewSafe copy and demo states; inert, so nothing on it can be used. Undefined while the card is not defined. */
function realCard(kind: TransferKind, item: TransferItem, safe: unknown, demo: ReturnType<typeof demoStates>): Node | undefined {
  if (!customElements.get('magic-card')) return undefined;
  let node = cards.get(item);
  if (!node) {
    const el = document.createElement('magic-card') as HTMLElement & { setConfig(c: unknown): void; hass: unknown };
    const states = Object.fromEntries(Object.values(demo).map((d) => [d.entity_id, { ...d, context: { id: '' }, last_changed: '', last_updated: '' }]));
    try {
      el.setConfig(kind === 'shape' ? { type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: item.name }] }] }], shape: 'custom', shape_options: safe } : safe);
    } catch {
      return undefined;
    }
    el.hass = { states, entities: {}, language: locale(), locale: { language: locale(), number_format: 'language', time_format: 'language' }, themes: { themes: {}, darkMode: false }, callWS: async () => ({}), callService: async () => undefined };
    el.setAttribute('inert', '');
    el.style.pointerEvents = 'none';
    cards.set(item, (node = el));
  }
  return node;
}

/** The colours of a theme as swatches, from its previewSafe copy; a value that is not a plain colour is left out. */
function swatches(safe: ThemeDoc): TemplateResult {
  const v = wallTabletVars(safe, 'light');
  return html`<div style="display:flex;gap:4px">${SWATCH_KEYS.filter((k) => COLOUR_RE.test(v[`--${k}`] ?? '')).map((k) => html`<span data-theme-swatch title=${k} style=${`width:28px;height:28px;border-radius:6px;border:1px solid rgba(128,128,128,.5);background:${v[`--${k}`]}`}></span>`)}</div>`;
}

export function importPreview(kind: TransferKind, items: readonly TransferItem[], placeholders: readonly EntityPlaceholder[], wallTablet: boolean, onWallTablet: () => void): TemplateResult {
  const states = demoStates(placeholders);
  const demo = Object.values(states);
  return html`<div data-import-preview>
    <strong>${t('share-kit.import-preview.preview-heading')}</strong>
    ${kind === 'theme'
      ? html`<button type="button" class="tablet-toggle" data-wall-tablet-toggle aria-pressed=${wallTablet ? 'true' : 'false'} @click=${onWallTablet}>${t('share-kit.import-preview.wall-tablet-toggle')}</button>`
      : nothing}
    ${items.map((i) => {
      const safe = previewSafe(kind, i.data as never);
      const src = picture(kind, safe);
      const card = kind === 'card' || kind === 'shape' ? realCard(kind, i, safe, states) : undefined;
      const icon = kind === 'icon' ? pathIcon(safe) : undefined;
      const swatch = kind === 'theme' && !wallTablet ? swatches(safe as ThemeDoc) : undefined;
      const stripes = html`<div aria-hidden="true" style=${`width:56px;height:56px;border-radius:8px;background:${NEUTRAL_PATTERN}`}></div>`;
      return html`<figure role="group" aria-label=${t('share-kit.import-preview.preview-of-name', { name: i.name })} style="margin:8px 0">
        ${src ? html`<img src=${src} alt="" width="56" height="56" />` : (card ?? icon ?? swatch ?? stripes)}
        <figcaption>${i.name}</figcaption>
        ${kind === 'animation' ? html`<mc-anim-preview .doc=${safe}></mc-anim-preview>` : nothing}
        ${kind === 'theme'
          ? wallTablet
            ? (['light', 'dark'] as const).map((m) => html`<mc-wall-tablet .vars=${wallTabletVars(safe as ThemeDoc, m)} .labels=${wallTabletLabels(m)}></mc-wall-tablet>`)
            : nothing
          : nothing}
      </figure>`;
    })}
    ${demo.length ? html`<p class="help">${t('share-kit.import-preview.demo-states-help')}</p><ul>${demo.map((d) => html`<li><span class="mono">${d.entity_id}</span> ${demoText(d)}</li>`)}</ul>` : nothing}
  </div>`;
}
