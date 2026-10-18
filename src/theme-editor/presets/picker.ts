import { html, css, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { ThemePreset, ThemePresetLibrary } from '../../contracts/theme-editor';
import type { MessageId } from '../../contracts/i18n';
import { glyph } from '../../ui-kit/glyphs';
import { fold } from '../../i18n/fold';
import { m, t } from './i18n';

/*
 * The preset picker of the create dialog (design/dialog-spec.md): search, a Show filter, two groups
 * of cards with a swatch strip. It lives in the lazy preset chunk, not in the editor entry, because
 * the entry has a byte cap (ADR 0014) and nothing here is needed before the dialog opens. It is a
 * template function, not an element: <mcte-start-view> renders it into its own shadow root and adopts
 * `pickerStyles` there when the chunk arrives. lit, icons.ts and <mcte-mode-switch> come from the entry.
 */

export interface PickerView {
  lib: ThemePresetLibrary;
  /** The selected preset id. */
  selected: string;
  query: string;
  /** 'all', 'original' or 'inspired'. */
  filter: string;
  /** (1.2.0) The user's own presets as picker items (group 'mine'), shown first. */
  mine?: readonly ThemePreset[];
}

export interface PickerEvents {
  select: (id: string) => void;
  /** Set the search; `filter` also sets the Show chip in the same step. */
  query: (q: string, filter?: string) => void;
  filter: (f: string) => void;
  /** Export, and for My presets Rename and Delete, of the selected preset. */
  act: (mode: 'export' | 'rename' | 'delete', p: ThemePreset) => void;
}

/** Group order, Show labels, headings and search words (the contract's ThemePresetGroupInfo, kept here so the chunk imports nothing at run time). */
const MINE = { id: 'mine', label: m('My presets'), search: m('my') } as const;
const GROUPS = [
  { id: 'original', label: m('Original'), search: m('original') },
  { id: 'inspired', label: m('Inspired by'), search: m('inspired by') },
  { id: 'genre', label: m('Sci-fi & fantasy'), search: m('genre') },
] as const;
/** The words the "no match" help offers; each is a message, so the button searches in the user's language. */
const SUGGESTIONS: MessageId[] = [m('sci-fi'), m('fantasy'), m('neon'), m('desert'), m('forest')];
const suggestions = (): string[] => SUGGESTIONS.map((w) => t(w));

/** A preset's text in the language: a built-in preset holds an m() id, a My preset the user's own words. */
const own = (p: ThemePreset, v: MessageId | undefined): string => (v === undefined ? '' : p.group === 'mine' ? String(v) : t(v));
export const presetTitle = (p: ThemePreset): string => own(p, p.name);
export const presetBlurb = (p: ThemePreset): string => own(p, p.blurb);
const flat = (s: string): string => s.replace(/[\s-]/g, '');

// A swatch value that names another host (preset-transfer EXTERNAL_REF_RE, kept here as a copy) or that could
// add a second declaration is never put into a style: opening the picker must not contact anyone.
const OUTSIDE = /(?:\b[a-z][a-z0-9+.-]*:\/\/|(?:^|[\s,("'])\/\/[^\s/)"'])|;|@import/i;
const colours = (p: ThemePreset, m: 'light' | 'dark'): Record<string, string> => {
  const v = { ...p.doc, ...p.doc.modes?.[m] } as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const k of ['lovelace-background', 'primary-background-color', 'card-background-color', 'primary-color', 'accent-color']) {
    const x = v[k];
    if (typeof x === 'string' && !OUTSIDE.test(x)) out[k] = x;
  }
  return out;
};

function card(p: ThemePreset, on: boolean, ev: PickerEvents): TemplateResult {
  const half = (m: 'light' | 'dark'): TemplateResult => {
    const v = colours(p, m);
    return html`<span style="background:${v['lovelace-background'] ?? v['primary-background-color']}"><i class="c" style="background:${v['card-background-color']}"></i><i class="d" style="background:${v['primary-color']}"></i></span>`;
  };
  return html`<label class="preset ${on ? 'on' : ''}">
    <input class="pin" type="radio" name="preset" value=${p.id} .checked=${on} @change=${() => ev.select(p.id)} />
    <span class="pv" aria-hidden="true"
      ><span class="sw">${half('light')}${half('dark')}</span
      ><span class="ac" style="background:linear-gradient(90deg,${colours(p, 'light')['accent-color']} 50%,${colours(p, 'dark')['accent-color']} 50%)"></span
    ></span>
    <span class="pn">${presetTitle(p)}${on ? glyph('check') : nothing}</span>
    <span class="help">${presetBlurb(p)}</span>
    ${p.inspiredBy ? html`<span class="help">${t('Inspired by {name}', { name: p.inspiredBy.name })}</span>` : nothing} ${on && p.note ? html`<span class="help">${own(p, p.note)}</span>` : nothing}
  </label>`;
}

const everyone = (v: PickerView): readonly ThemePreset[] => (v.mine?.length ? [...v.mine, ...v.lib.presets] : v.lib.presets);
const search = (v: PickerView): ThemePreset[] => {
  const q = v.query.trim().toLowerCase();
  return everyone(v).filter((p) => {
    const g = p.group === 'mine' ? MINE : GROUPS.find((x) => x.id === p.group);
    const hay = `${presetTitle(p)} ${presetBlurb(p)} ${p.inspiredBy?.name ?? ''} ${p.tags ?? ''} ${g ? t(g.search) : ''} ${p.tags?.startsWith('sci-fi') ? t('sci-fi') : p.tags?.startsWith('fantasy') ? t('fantasy') : ''}`.toLowerCase();
    return !q || fold(hay).includes(fold(q)) || flat(fold(hay)).includes(flat(fold(q)));
  });
};
const shownOf = (v: PickerView): ThemePreset[] => search(v).filter((p) => v.filter === 'all' || p.group === v.filter);

/** The text of the dialog's live region ("12 presets shown"); the region itself lives in the start view. */
export function pickerStatus(v: PickerView): string {
  const n = shownOf(v).length;
  if (n) return t('{n, plural, one {# preset} other {# presets}} shown', { n });
  const [a, b, c, d, e] = suggestions();
  return t('{n, plural, one {# preset} other {# presets}} shown. Try {a}, {b}, {c}, {d} or {e}.', { n, a, b, c, d, e });
}

/** The id the dialog should have selected: the current one while it is in the list, else the first shown, else none. */
export function pickerSelection(v: PickerView): string {
  const shown = shownOf(v);
  return shown.some((p) => p.id === v.selected) ? v.selected : (shown[0]?.id ?? '');
}

/** Search, filter and the grouped cards for the current view. */
export function renderPicker(v: PickerView, ev: PickerEvents): TemplateResult {
  const found = search(v);
  const count = (g: string): number => found.filter((p) => p.group === g).length;
  const shown = shownOf(v);
  const sel = everyone(v).find((p) => p.id === v.selected);
  const groups = v.mine?.length ? [MINE, ...GROUPS] : GROUPS;
  // with no match at all, counts of 0 on every chip read like "no presets exist": leave them off
  const num = (n: number): string => (found.length ? ` ${n}` : '');
  // Move focus to the search field before the list re-renders: the button that was pressed is about to go.
  const again = (e: Event, q: string): void => {
    ((e.currentTarget as HTMLElement).getRootNode() as ShadowRoot | Document).getElementById?.('pq')?.focus();
    ev.query(q, 'all');
  };
  return html`<div class="pl">
    <div class="pbar">
      <label class="sr-only" for="pq">${t('Search presets')}</label>
      <input
        id="pq"
        class="input"
        type="search"
        autocomplete="off"
        placeholder=${t('Name, palette or style')}
        .value=${v.query}
        @input=${(e: Event) => ev.query((e.target as HTMLInputElement).value)}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key !== 'Escape' || !v.query) return;
          e.stopPropagation();
          e.preventDefault();
          ev.query('');
        }}
      />
      <mcte-mode-switch
        label=${t('Show')}
        .value=${v.filter}
        .options=${[{ value: 'all', label: `${t('All')}${num(found.length)}` }, ...groups.map((g) => ({ value: g.id, label: `${t(g.label)}${num(count(g.id))}` }))]}
        @mcte-change=${(e: CustomEvent) => ev.filter(e.detail.value)}
      ></mcte-mode-switch>
    </div>
    <div class="plist" role="radiogroup" aria-label=${t('Preset')}>
      ${shown.length
        ? groups.map((g) => {
            const items = shown.filter((p) => p.group === g.id);
            const part = (title: string, list: ThemePreset[]): TemplateResult | typeof nothing =>
              list.length ? html`<h4>${title} <span class="help">${list.length}</span></h4><div class="presets">${list.map((p) => card(p, p === sel, ev))}</div>` : nothing;
            return items.length
              ? html`<h3>${t(g.label)} <span class="help">${items.length}</span></h3>
                  ${g.id === 'genre'
                    ? html`<p class="help dis">${t('Independent colour schemes made for Magic Card. Not affiliated with, or endorsed by, any film, series, book or game.')}</p>
                        ${part(t('Sci-fi'), items.filter((p) => p.tags?.startsWith('sci-fi')))} ${part(t('Fantasy'), items.filter((p) => p.tags?.startsWith('fantasy')))}`
                    : html`<div class="presets">${items.map((p) => card(p, p === sel, ev))}</div>`}`
              : nothing;
          })
        : html`<p class="help">${t('No preset matches "{query}".', { query: v.query })}</p>
            <p class="help">${t('Presets use genre and colour words, not titles. Try one of these:')}</p>
            <div class="sug">${suggestions().map((w) => html`<button type="button" class="btn btn-secondary btn-sm" @click=${(e: Event) => again(e, w)}>${w}</button>`)}</div>
            <p><button type="button" class="btn btn-text btn-sm" @click=${(e: Event) => again(e, '')}>${t('Clear search')}</button></p>`}
    </div>
    ${sel
      ? html`<div class="pacts">${(sel.group === 'mine' ? (['export', 'rename', 'delete'] as const) : (['export'] as const)).map(
          (act) => html`<button type="button" class="btn btn-text btn-sm ${act === 'delete' ? 'danger' : ''}" @click=${() => ev.act(act, sel)}>${act === 'export' ? t('Export') : act === 'rename' ? t('Rename') : t('Delete')}<span class="sr-only"> ${presetTitle(sel)}</span></button>`,
        )}</div>`
      : nothing}
  </div>`;
}

export const pickerStyles = css`
  .pacts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .pl {
    display: grid;
    gap: 12px;
  }
  .pbar {
    display: grid;
    gap: 8px;
  }
  .plist {
    display: grid;
    gap: 8px;
    align-content: start;
  }
  .plist h4 {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--mc-text);
    margin-block: 4px 0;
  }
  .dis {
    font-size: 0.875rem;
  }
  .sug button {
    min-height: 44px;
  }
  .sug {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .plist h3 {
    font-size: 0.875rem;
    font-weight: 500;
  }
  .presets {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  @media (min-width: 600px) {
    .pbar {
      grid-template-columns: 1fr auto;
    }
    .plist {
      max-height: min(34vh, 340px);
      min-height: min(28vh, 220px);
      overflow: auto;
      padding: 2px;
    }
  }
  /* The sheet (under 600 px) keeps its footer below the scrolling body; a focused card still stays clear of the edge */
  @media (max-width: 599px) {
    .pin {
      scroll-margin-block: 8px 136px;
    }
  }
  /* Short screens: the whole dialog scrolls, nothing nests and nothing sticks */
  @media (max-height: 499px) {
    .plist {
      max-height: none;
      min-height: 0;
      overflow: visible;
    }
    .pin {
      scroll-margin-block: 8px;
    }
  }
  @media (max-width: 899px) {
    .presets {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 599px) {
    .presets {
      grid-template-columns: 1fr;
    }
  }
  .preset {
    position: relative;
    display: grid;
    gap: 4px;
    align-content: start;
    min-height: 96px;
    padding: 8px;
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius-lg);
    cursor: pointer;
    background: var(--mc-surface);
  }
  .pin {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }
  .preset.on {
    outline: 2px solid var(--mc-accent);
    outline-offset: -1px;
  }
  .preset:has(input:focus-visible) {
    outline: 3px solid var(--mc-focus);
    outline-offset: 2px;
  }
  .pv {
    display: grid;
    gap: 2px;
  }
  .sw {
    display: flex;
    height: 28px;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid var(--mc-divider);
  }
  .sw > span {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 4px;
  }
  .sw i {
    display: block;
    border: 1px solid rgba(128, 128, 128, 0.45);
  }
  .sw .c {
    flex: 1;
    height: 20px;
    border-radius: 4px;
  }
  .sw .d {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  .ac {
    height: 3px;
    border-radius: 2px;
  }
  .pn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 500;
    font-size: 0.875rem;
    overflow-wrap: anywhere;
  }
  .pn .ico {
    width: 16px;
    height: 16px;
  }
`;
