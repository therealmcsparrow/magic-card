import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-stack';
import type { AnimationDoc } from '../model';
import type { LayerKey, LayerView, LayersDensity } from '../../contracts/studio-layers';
import { registerPanel, type StageInfo, type StudioSelection } from '../slots';
import { remapStepKeys } from '../layer-view';
import { LayerRows, layerRowStyles } from './layer-row';
import { formatSeconds, moveItem, stepInfo, type AnimationLibraryMap } from './sequence-utils';
import { t, m } from '../i18n';

/*
 * mc-anim-steps-layers (place 'layers', sequence documents): the steps in play order, first step first.
 * Move up = plays earlier. A step's LayerKey is its index (`step:<n>`), so a move remaps the keys of the
 * view (remapStepKeys) in the same turn as the document change. Hide takes the step out of the preview
 * (applyLayerView); the document keeps it. The row selects within this list; the steps' own settings are
 * in the Sequence editor.
 */

export { remapStepKeys };

@customElement('mc-anim-steps-layers')
export class AnimStepsLayers extends LitElement {
  static styles = [
    editorSystem,
    layerRowStyles,
    css`
      :host {
        display: block;
        color: var(--mc-text);
        font-size: 0.875rem;
      }
      ol {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 2px;
      }
      .num {
        flex: none;
        display: grid;
        place-items: center;
        min-width: 22px;
        height: 22px;
        border-radius: 9999px;
        border: 1px solid var(--mc-divider);
        font-size: 0.75rem;
        font-variant-numeric: tabular-nums;
      }
      .lr.is-hidden .num {
        text-decoration: line-through;
        opacity: 0.6;
      }
      .empty-note {
        margin: 0;
        padding: 8px;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
    `,
  ];

  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) selection: StudioSelection = { kind: 'none' };
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: AnimationLibraryMap;
  @property({ type: Number }) time = 0;
  @property({ attribute: false }) tile?: string;
  @property({ attribute: false }) stage?: StageInfo;
  @property({ attribute: false }) layerView?: LayerView;
  @property() density: LayersDensity = 'full';

  @state() private _sel?: LayerKey;

  private readonly _list = new LayerRows(this, {
    select: (key) => (this._sel = key),
    move: (key, dir) => this._move(Number(key.slice(5)), dir),
    nameOf: (key) => this._name(Number(key.slice(5))),
  });

  private _name(i: number): string {
    const s = this.doc?.steps?.[i];
    return s ? stepInfo(s.animation, this.library, this.doc?.id).name : t('Step {i}', { i: i + 1 });
  }

  private _move(from: number, dir: 'up' | 'down'): void {
    const doc = this.doc;
    const steps = doc?.steps ?? [];
    const to = dir === 'up' ? from - 1 : from + 1;
    if (!doc || this.disabled || to < 0 || to >= steps.length) return;
    const name = this._name(from);
    let ctl: string | undefined;
    try {
      ctl = (this.renderRoot as ShadowRoot).activeElement?.getAttribute('data-ctl') ?? undefined;
    } catch {
      ctl = undefined;
    }
    this.dispatchEvent(new CustomEvent('doc-change', { bubbles: true, composed: true, detail: { doc: { ...doc, steps: moveItem(steps, from, to) }, label: t('Move step') } }));
    this._list.announce(t('{name} is now step {to} of {count}', { name, to: to + 1, count: steps.length }), remapStepKeys(this.layerView ?? { hidden: [], solo: [], locked: [], open: [] }, from, to));
    if (this._sel === `step:${from}`) this._sel = `step:${to}`;
    // the row key is the index: focus goes to the place the step moved to (after the row's own refocus)
    queueMicrotask(() => this._list.focusKey(`step:${to}`, ctl));
  }

  protected render(): TemplateResult | typeof nothing {
    const doc = this.doc;
    if (!doc || doc.kind !== 'sequence') return nothing;
    const steps = doc.steps ?? [];
    if (!steps.length) return html`<p class="empty-note">${t('No steps yet. Add a clip to start the sequence.')}</p>`;
    return html`<ol aria-label=${t('Sequence steps (plays first to last)')}>
      ${steps.map((s, i) => {
        const info = stepInfo(s.animation, this.library, doc.id);
        const dur = info.status === 'ok' ? (s.duration ?? info.defaultDuration) : undefined;
        const key = `step:${i}`;
        const name = info.name;
        return this._list.row({
          key,
          name,
          thumb: html`<span class="num" aria-hidden="true">${i + 1}</span>`,
          note: info.problem,
          badge: dur !== undefined ? formatSeconds(dur) : undefined,
          describe: info.problem ? t('step {i} of {count}, {problem}', { i: i + 1, count: steps.length, problem: info.problem }) : t('step {i} of {count}', { i: i + 1, count: steps.length }),
          selected: this._sel === key,
          up: { ok: !this.disabled && i > 0, label: t('Move {name} up (plays earlier)', { name }), menu: t('Move up (plays earlier)') },
          down: { ok: !this.disabled && i < steps.length - 1, label: t('Move {name} down (plays later)', { name }), menu: t('Move down (plays later)') },
        });
      })}
    </ol>`;
  }
}

registerPanel({
  tag: 'mc-anim-steps-layers',
  place: 'layers',
  when: (doc) => doc.kind === 'sequence',
  title: m('Sequence steps'),
  order: 10,
});

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-steps-layers': AnimStepsLayers;
  }
}
