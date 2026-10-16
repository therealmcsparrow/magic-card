import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-system';
import type { AnimationDoc, TargetRef } from '../model';
import { NO_SELECTION, registerPanel, type StudioSelection } from '../slots';
import { tileDef, type PreviewTile } from '../tiles';

/*
 * Layers panel of the card-part targets (spec section D): Element, Icon, Name, State and
 * Background. The current preview tile decides which can be previewed; the others are listed only
 * when the document already animates them (marked "Not on this tile"), and a hint names the rest and
 * the tile that has them. Choosing a row selects that target (selection-change), so the timeline and
 * the inspector follow it.
 */

interface TargetRow {
  target: TargetRef;
  label: string;
  icon: string;
}

export const CARD_PART_ROWS: TargetRow[] = [
  { target: 'element', label: 'Element', icon: 'mdi:square-rounded-outline' },
  { target: 'icon', label: 'Icon', icon: 'mdi:star-outline' },
  { target: 'name', label: 'Name', icon: 'mdi:format-title' },
  { target: 'state', label: 'State', icon: 'mdi:numeric' },
  { target: 'background', label: 'Background', icon: 'mdi:rectangle-outline' },
];

/** The document animates this target: a track for it, or (element / icon) the main keyframes on it. */
export function animatesTarget(doc: AnimationDoc, target: TargetRef): boolean {
  if (doc.tracks?.some((t) => t.target === target && (t.keyframes.length > 0 || !!t.path))) return true;
  if (target === 'element' || target === 'icon') return (doc.target ?? 'element') === target && (doc.keyframes?.length ?? 0) > 0;
  return false;
}

/** The selected card-part target, if any. */
const selectedTarget = (sel: StudioSelection | undefined): TargetRef | undefined =>
  sel?.kind === 'target' || sel?.kind === 'keys' ? (sel.target ?? sel.keys?.[0]?.target) : undefined;

/** "Name, State and Background" */
const listText = (labels: string[]): string =>
  labels.length < 2 ? (labels[0] ?? '') : `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`;

@customElement('mc-anim-targets-layers')
export class AnimTargetsLayers extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        color: var(--mc-text);
        font-size: 0.875rem;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 2px;
      }
      button.row {
        all: unset;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 18px minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-height: 40px;
        padding: 6px 10px;
        border-radius: var(--mc-radius, 8px);
        color: var(--mc-text);
        cursor: pointer;
        transition: background-color 0.15s ease-out, color 0.15s ease-out;
      }
      button.row:hover {
        background: var(--mc-surface-2);
      }
      button.row:focus-visible {
        outline: 2px solid var(--mc-accent);
        outline-offset: -2px;
      }
      button.row[aria-pressed='true'] {
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
      }
      button.row:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      ha-icon {
        --mdc-icon-size: 18px;
        color: var(--mc-text-2);
      }
      button.row[aria-pressed='true'] ha-icon {
        color: var(--mc-accent-ink);
      }
      .label {
        display: grid;
        min-width: 0;
        line-height: 1.3;
      }
      .label small {
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      button.row[aria-pressed='true'] .label small {
        color: inherit;
      }
      .keys {
        width: 8px;
        height: 8px;
        border-radius: 9999px;
        background: var(--mc-text-2);
      }
      button.row[aria-pressed='true'] .keys {
        background: var(--mc-accent-ink);
      }
      .hint {
        margin: 8px 10px 0;
        font-size: 0.75rem;
        line-height: 1.4;
        color: var(--mc-text-2);
      }
      @media (prefers-reduced-motion: reduce) {
        button.row {
          transition: none;
        }
      }
    `,
  ];

  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: unknown;
  @property({ type: Number }) time = 0;
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: false }) selection: StudioSelection = NO_SELECTION;
  @property({ attribute: false }) tile: PreviewTile = 'icon';

  private _select(target: TargetRef): void {
    if (this.disabled) return;
    const selection: StudioSelection = { kind: 'target', target };
    this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection }, bubbles: true, composed: true }));
  }

  private _row(r: TargetRow, onTile: boolean, selected: TargetRef | undefined): TemplateResult {
    const doc = this.doc!;
    const keyed = animatesTarget(doc, r.target);
    return html`<li>
      <button
        type="button"
        class="row"
        data-target=${r.target}
        aria-pressed=${selected === r.target ? 'true' : 'false'}
        ?disabled=${this.disabled}
        title=${onTile ? r.label : `${r.label} is not on the ${tileDef(this.tile).label} tile`}
        @click=${() => this._select(r.target)}
      >
        <ha-icon icon=${r.icon}></ha-icon>
        <span class="label">${r.label}${onTile ? nothing : html`<small>Not on this tile</small>`}</span>
        ${keyed ? html`<span class="keys" role="img" aria-label="Animated"></span>` : html`<span></span>`}
      </button>
    </li>`;
  }

  protected render(): TemplateResult | typeof nothing {
    const doc = this.doc;
    if (!doc) return nothing;
    const def = tileDef(this.tile);
    const selected = selectedTarget(this.selection);
    const onTile = (t: TargetRef) => def.targets.includes(t);
    // a target the tile lacks stays listed while the document animates it (or it is selected)
    const shown = CARD_PART_ROWS.filter((r) => onTile(r.target) || animatesTarget(doc, r.target) || selected === r.target);
    const notOn = CARD_PART_ROWS.filter((r) => !onTile(r.target));
    const one = notOn.length === 1;
    return html`
      <ul aria-label="Card parts">
        ${shown.map((r) => this._row(r, onTile(r.target), selected))}
      </ul>
      ${notOn.length
        ? html`<p class="hint">
            ${listText(notOn.map((r) => r.label))} ${one ? 'is' : 'are'} not on the ${def.label} tile. Switch the preview tile to Card to see
            ${one ? 'it' : 'them'}.
          </p>`
        : nothing}
    `;
  }
}

registerPanel({
  tag: 'mc-anim-targets-layers',
  place: 'layers',
  // tracks (card parts) belong to keyframes documents
  when: (doc) => doc.kind === 'keyframes',
  title: 'Card parts',
  order: 10,
});

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-targets-layers': AnimTargetsLayers;
  }
}
