import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-stack';
import type { AnimationDoc } from '../model';
import type { LayerKey, LayerView, LayersDensity } from '../../contracts/studio-layers';
import { registerPanel, type StageInfo, type StudioSelection } from '../slots';
import { LayerRows, layerRowStyles } from './layer-row';
import { t, m } from '../i18n';

// mc-anim-path-layers (place 'layers', path documents): the motion path and what moves along it.
// Not a paint stack (no order, no move, no hide); both rows can be locked. The rows select within this list only.

const SUBJECTS = { element: m('anim-studio.path-layers.element'), icon: m('anim-studio.path-layers.icon'), particles: m('anim-studio.path-layers.particles') } as const;

@customElement('mc-anim-path-layers')
export class AnimPathLayers extends LitElement {
  static styles = [
    editorSystem,
    layerRowStyles,
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
  @property({ attribute: false }) library?: unknown;
  @property({ type: Number }) time = 0;
  @property({ attribute: false }) tile?: string;
  @property({ attribute: false }) stage?: StageInfo;
  @property({ attribute: false }) layerView?: LayerView;
  @property() density: LayersDensity = 'full';

  @state() private _sel: LayerKey = 'path';

  private readonly _list = new LayerRows(this, {
    select: (key) => (this._sel = key),
    nameOf: (key) => (key === 'path' ? t('anim-studio.path-layers.motion-path') : t('anim-studio.path-layers.moves-along-subject', { subject: this._subject() })),
  });

  private _subject(): string {
    const mark = SUBJECTS[this.doc?.path?.subject ?? 'element'] ?? SUBJECTS.element;
    return t(mark);
  }

  protected render(): TemplateResult | typeof nothing {
    const doc = this.doc;
    if (!doc || doc.kind !== 'path') return nothing;
    if (!doc.path?.d.trim()) return html`<p class="empty-note">${t('anim-studio.path-layers.no-motion-path-yet-draw-one-on-the-stage')}</p>`;
    return html`<ul aria-label=${t('anim-studio.path-layers.path-layers-no-stacking-order')}>
      ${this._list.row({ key: 'path', name: t('anim-studio.path-layers.motion-path'), icon: 'mdi:vector-curve', selected: this._sel === 'path' })}
      ${this._list.row({ key: 'subject', name: t('anim-studio.path-layers.moves-along-subject', { subject: this._subject() }), icon: 'mdi:arrow-right-bold-outline', selected: this._sel === 'subject' })}
    </ul>`;
  }
}

registerPanel({
  tag: 'mc-anim-path-layers',
  place: 'layers',
  when: (doc) => doc.kind === 'path',
  title: m('anim-studio.path-layers.path-layers'),
  order: 10,
});

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-path-layers': AnimPathLayers;
  }
}
