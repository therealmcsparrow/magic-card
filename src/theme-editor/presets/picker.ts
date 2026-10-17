import { html, css, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { ThemePreset, ThemePresetLibrary } from '../../contracts/theme-editor';
import { icon } from '../icons';

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
}

export interface PickerEvents {
  select: (id: string) => void;
  query: (q: string) => void;
  filter: (f: string) => void;
}

const colours = (p: ThemePreset, m: 'light' | 'dark'): Record<string, string> => (p.doc.modes?.[m] ?? {}) as Record<string, string>;

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
    <span class="pn">${p.name}${on ? icon('check') : nothing}</span>
    <span class="help">${p.blurb}</span>
    ${p.inspiredBy ? html`<span class="help">Inspired by ${p.inspiredBy.name}</span>` : nothing} ${on && p.note ? html`<span class="help">${p.note}</span>` : nothing}
  </label>`;
}

const search = (v: PickerView): ThemePreset[] => {
  const q = v.query.trim().toLowerCase();
  return v.lib.presets.filter((p) => !q || `${p.name} ${p.blurb} ${p.inspiredBy?.name ?? ''} ${p.group === 'inspired' ? 'inspired by' : p.group}`.toLowerCase().includes(q));
};
const shownOf = (v: PickerView): ThemePreset[] => search(v).filter((p) => v.filter === 'all' || p.group === v.filter);

/** The text of the dialog's live region ("12 presets shown"); the region itself lives in the start view. */
export function pickerStatus(v: PickerView): string {
  const n = shownOf(v).length;
  return `${n} ${n === 1 ? 'preset' : 'presets'} shown`;
}

/** Search, filter and the grouped cards for the current view. */
export function renderPicker(v: PickerView, ev: PickerEvents): TemplateResult {
  const found = search(v);
  const count = (g: string): number => found.filter((p) => p.group === g).length;
  const shown = shownOf(v);
  const sel = v.lib.presets.find((p) => p.id === v.selected);
  return html`<div class="pl">
    <div class="pbar">
      <label class="sr-only" for="pq">Search presets</label>
      <input
        id="pq"
        class="input"
        type="search"
        autocomplete="off"
        placeholder="Name, palette or style"
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
        label="Show"
        .value=${v.filter}
        .options=${[
          { value: 'all', label: `All ${found.length}` },
          { value: 'original', label: `Original ${count('original')}` },
          { value: 'inspired', label: `Inspired by ${count('inspired')}` },
        ]}
        @mcte-change=${(e: CustomEvent) => ev.filter(e.detail.value)}
      ></mcte-mode-switch>
    </div>
    <div class="plist" role="radiogroup" aria-label="Preset">
      ${shown.length
        ? (['original', 'inspired'] as const).map((g) => {
            const items = shown.filter((p) => p.group === g);
            return items.length
              ? html`<h3>${g === 'original' ? 'Original' : 'Inspired by'} <span class="help">${items.length}</span></h3>
                  <div class="presets">${items.map((p) => card(p, p === sel, ev))}</div>`
              : nothing;
          })
        : html`<p class="help">
            No preset matches "${v.query}". <button type="button" class="btn btn-text btn-sm" @click=${() => (ev.query(''), ev.filter('all'))}>Clear search</button>
          </p>`}
    </div>
    ${sel && !shown.includes(sel) ? html`<p class="help">Selected: ${sel.name}</p>` : nothing}
  </div>`;
}

export const pickerStyles = css`
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
      max-height: min(52vh, 520px);
      overflow: auto;
      padding: 2px;
    }
  }
  /* The sheet (under 600 px) has a sticky footer of up to three rows: keep a focused card above it */
  @media (max-width: 599px) {
    .pin {
      scroll-margin-block: 8px 136px;
    }
  }
  /* Short screens: the whole dialog scrolls, nothing nests and nothing sticks */
  @media (max-height: 499px) {
    .plist {
      max-height: none;
      overflow: visible;
    }
    dialog .foot {
      position: static;
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
