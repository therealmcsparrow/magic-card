import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-stack';
import type { AnimationDoc } from '../model';
import type { ParticlesSim, WeightedShape } from '../../contracts/particles-v2';
import type { LayerKey, LayerToggle, LayerView, LayersDensity } from '../../contracts/studio-layers';
import { registerPanel, type StageInfo, type StudioSelection } from '../slots';
import { emitterIds } from '../layer-view';
import { stageParticlesOf } from '../stage-particles';
import { LayerRows, layerRowStyles, type MoveInfo } from './layer-row';
import { EMITTER_NAME_MAX, emitterCount, emitterLabel, emitterPlacement, moveEmitter, moveEmitterPastContent, renameEmitter, shapeLabel, shownShapes, viewSim } from './particles-utils';
import { t, m } from '../i18n';

/*
 * mc-anim-particles-layers (place 'layers', particles documents): the emitters as a paint stack around the
 * fixed Card content row. Top to bottom: the emitters in front of the content (top-most first), Card content,
 * the emitters behind it (top-most first). One step past Card content changes only that emitter's placement
 * (particles-utils moveEmitterPastContent). Rows: emitter, its Child particles (when on) and the shape rows
 * (select only). Selection is the particles editor's: this panel reads `emitter` / `all` and raises
 * `emitter-change` (the shell hands both to the editor). Hide and solo go to the stage sheet through the real
 * compiler's emitter slots (stage-particles.ts); a document without a v2 sim has no hide or solo.
 */

interface Em {
  /** Index in the document (0 = the primary): the paint order, bottom first. */
  i: number;
  id: string;
  name: string;
  side: 'front' | 'back';
}

const LOCK_ONLY: readonly LayerToggle[] = ['lock'];
const HIDE_LOCK: readonly LayerToggle[] = ['hide', 'lock'];
const NONE: readonly LayerToggle[] = [];

@customElement('mc-anim-particles-layers')
export class AnimParticlesLayers extends LitElement {
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
      .lcontent {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 32px;
        padding: 2px 8px;
        border-top: 1px dashed var(--mc-divider);
        border-bottom: 1px dashed var(--mc-divider);
        color: var(--mc-text-2);
        --mdc-icon-size: 18px;
      }
      .lcontent ha-icon {
        flex: none;
      }
      .sr {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
      .note {
        margin: 6px 8px 0;
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
  /** The emitter the particles editor edits (0 = the primary). */
  @property({ type: Number }) emitter = 0;
  /** The editor shows "All particles": no emitter row is the selected one. */
  @property({ type: Boolean }) all = false;

  /** Disclosure the user chose (key -> open); without a choice: open for one emitter and for the selected one. */
  @state() private _open = new Map<LayerKey, boolean>();
  @state() private _renaming?: LayerKey;
  /** A Child particles or shape row picked in this list (the editor has no row of its own for them). */
  @state() private _sub?: LayerKey;

  private readonly _list = new LayerRows(this, {
    select: (key) => this._pick(key),
    move: (key, dir) => this._move(key, dir),
    rename: (key) => (this._renaming = key),
    dblclick: (key) => !this.disabled && /^emitter:/.test(key) && this._multi && !this._list.refuseLocked(key, this._nameOfKey(key)) && (this._renaming = key),
    open: (key, open) => (this._open = new Map(this._open).set(key, open)),
    nameOf: (key) => this._nameOfKey(key),
  });

  private get _multi(): boolean {
    return !!this.doc && emitterCount(this.doc) > 1;
  }

  /** The emitters of the document with their row ids. */
  private _ems(doc: AnimationDoc): Em[] {
    const ids = doc.particles?.sim ? emitterIds(doc) : ['main'];
    return Array.from({ length: emitterCount(doc) }, (_, i) => ({ i, id: ids[i] ?? `e${i + 1}`, name: emitterLabel(doc, 0, i), side: emitterPlacement(doc, i) }));
  }

  private _nameOfKey(key: LayerKey): string {
    const id = key.slice(key.indexOf(':') + 1).replace(/[|/].*$/, '');
    const e = this.doc ? this._ems(this.doc).find((x) => x.id === id) : undefined;
    return key.startsWith('children:') ? t('Child particles of {name}', { name: e?.name ?? id }) : (e?.name ?? id);
  }

  private _emit(doc: AnimationDoc, label: string): void {
    this.dispatchEvent(new CustomEvent('doc-change', { bubbles: true, composed: true, detail: { doc, label } }));
  }

  private _select(index: number): void {
    this.dispatchEvent(new CustomEvent('emitter-change', { bubbles: true, composed: true, detail: { index, all: false } }));
  }

  private _pick(key: LayerKey): void {
    if (this.disabled || !this.doc) return;
    const id = key.slice(key.indexOf(':') + 1).replace(/[|/].*$/, '');
    const e = this._ems(this.doc).find((x) => x.id === id);
    if (!e) return;
    this._sub = key.startsWith('emitter:') ? undefined : key;
    this._select(e.i);
  }

  /** Display order of one side: the top-most first (later in the document is drawn above). */
  private _side(ems: Em[], side: 'front' | 'back'): Em[] {
    return ems.filter((e) => e.side === side).reverse();
  }

  private _move(key: LayerKey, dir: 'up' | 'down'): void {
    const doc = this.doc;
    if (!doc || this.disabled) return;
    const ems = this._ems(doc);
    const e = ems.find((x) => `emitter:${x.id}` === key);
    if (!e) return;
    const list = this._side(ems, e.side);
    const p = list.indexOf(e);
    const keepId = ems[Math.max(0, Math.min(ems.length - 1, this.emitter))]?.id;
    let next: AnimationDoc;
    let label: string;
    let said: string;
    const crossing = dir === 'up' ? e.side === 'back' && p === 0 : e.side === 'front' && p === list.length - 1;
    if (crossing) {
      const side = e.side === 'back' ? 'front' : 'back';
      next = moveEmitterPastContent(doc, 0, e.i, side).doc;
      label = side === 'front' ? t('Move emitter in front of the content') : t('Move emitter behind the content');
      said = side === 'front' ? t('{name} moved in front of the content', { name: e.name }) : t('{name} moved behind the content', { name: e.name });
    } else {
      const to = list[dir === 'up' ? p - 1 : p + 1];
      if (!to) return;
      next = moveEmitter(doc, 0, e.i, to.i);
      label = dir === 'up' ? t('Move emitter up') : t('Move emitter down');
      said = t('{name} moved {direction}, position {position} of {count}', { name: e.name, direction: dir === 'up' ? t('up') : t('down'), position: dir === 'up' ? p : p + 2, count: list.length });
    }
    if (next === doc) return;
    this._emit(next, label);
    this._list.announce(said);
    // the editor keeps editing the same emitter: its index moved with the order
    const at = emitterIds(next).indexOf(keepId ?? '');
    if (at >= 0 && at !== this.emitter && next.particles?.sim) this._select(at);
  }

  private _rename(key: LayerKey, raw: string): void {
    if (this._renaming !== key) return;
    this._renaming = undefined;
    const doc = this.doc;
    const e = doc ? this._ems(doc).find((x) => `emitter:${x.id}` === key) : undefined;
    if (!doc || !e || this._list.refuseLocked(key, e.name)) return;
    const next = renameEmitter(doc, 0, e.i, raw);
    if (next !== doc) this._emit(next, 'Rename emitter');
  }

  private _moveInfo(e: Em, dir: 'up' | 'down', list: Em[]): MoveInfo {
    const p = list.indexOf(e);
    const cross = dir === 'up' ? e.side === 'back' && p === 0 : e.side === 'front' && p === list.length - 1;
    const edge = dir === 'up' ? p === 0 : p === list.length - 1;
    const ok = !this.disabled && (cross || !edge);
    if (cross) {
      const where = dir === 'up' ? t('in front of the content') : t('behind the content');
      return { ok, label: t('Move {name} {where}', { name: e.name, where }), menu: t('Move {where}', { where }) };
    }
    return dir === 'up' ? { ok, label: t('Move {name} up (drawn on top)', { name: e.name }), menu: t('Move up (drawn on top)') } : { ok, label: t('Move {name} down', { name: e.name }), menu: t('Move down') };
  }

  private _focusRow(key: LayerKey): void {
    this._list.focusKey(key);
  }

  private _renameField(e: Em, key: LayerKey): TemplateResult {
    return html`<input
      class="input rename"
      aria-label=${t('Layer name')}
      maxlength=${EMITTER_NAME_MAX}
      .value=${e.name}
      @click=${(ev: Event) => ev.stopPropagation()}
      @keydown=${(ev: KeyboardEvent) => {
        ev.stopPropagation();
        if (ev.key === 'Enter') {
          this._rename(key, (ev.target as HTMLInputElement).value);
          this._focusRow(key);
        } else if (ev.key === 'Escape') {
          this._renaming = undefined;
          this._focusRow(key);
        }
      }}
      @blur=${(ev: Event) => this._rename(key, (ev.target as HTMLInputElement).value)}
    />`;
  }

  private _rowsOf(doc: AnimationDoc, e: Em, ems: Em[], toggles: readonly LayerToggle[] | undefined): TemplateResult[] {
    const key = `emitter:${e.id}`;
    const sim = viewSim(doc, 0);
    const own = e.i === 0 ? sim : sim.emitters![e.i - 1];
    const kids = e.i === 0 ? sim.children : sim.emitters![e.i - 1].children;
    const selected = !this.all && Math.min(this.emitter, ems.length - 1) === e.i;
    const open = this._open.get(key) ?? (ems.length === 1 || selected);
    const list = this._side(ems, e.side);
    const out: TemplateResult[] = [
      this._list.row({
        key,
        name: e.name,
        icon: 'mdi:shimmer',
        selected: selected && !this._sub,
        expanded: open,
        toggles,
        up: this._moveInfo(e, 'up', list),
        down: this._moveInfo(e, 'down', list),
        renamable: this._multi,
        renaming: this._renaming === key ? this._renameField(e, key) : undefined,
        describe: e.side === 'front' ? t('in front of the content') : t('behind the content'),
        title: e.side === 'front' ? t('{name}, in front of the content', { name: e.name }) : t('{name}, behind the content', { name: e.name }),
      }),
    ];
    if (!open) return out;
    if (kids) {
      out.push(
        this._list.row({ key: `children:${e.id}`, name: t('Child particles'), icon: 'mdi:dots-hexagon', level: 2, selected: this._sub === `children:${e.id}`, toggles }),
      );
    }
    const shape = (shapes: WeightedShape[], prefix: string, label: string): void => {
      shownShapes({ shapes } as ParticlesSim).forEach((w, n) => {
        const k = `pshape:${prefix}|${n}`;
        out.push(this._list.row({ key: k, name: `${label} ${n + 1}: ${shapeLabel(w.shape)}`, icon: 'mdi:shape-outline', level: 2, selected: this._sub === k, toggles: NONE }));
      });
    };
    shape(own.shapes, e.id, t('Shape'));
    if (kids) shape(kids.shapes, `${e.id}/c`, t('Child shape'));
    return out;
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    // the editor selected another emitter: keep its row inside the column
    if (((changed.has('emitter') && changed.get('emitter') !== undefined) || (changed.has('all') && changed.get('all') !== undefined)) && this.doc && !this.all) {
      const id = this._ems(this.doc)[Math.min(this.emitter, emitterCount(this.doc) - 1)]?.id;
      this.renderRoot.querySelector<HTMLElement>(`[data-lk="emitter:${id}"]`)?.scrollIntoView?.({ block: 'nearest' });
    }
  }

  protected render(): TemplateResult | typeof nothing {
    const doc = this.doc;
    if (!doc || doc.kind !== 'particles') return nothing;
    const ems = this._ems(doc);
    const hasSim = !!doc.particles?.sim;
    const ready = hasSim && !!stageParticlesOf(doc);
    // no v2 emitters: nothing to hide or lock; v2 without a stage rule source: lock only
    const toggles = !hasSim ? HIDE_LOCK : ready ? undefined : LOCK_ONLY;
    const front = this._side(ems, 'front');
    const back = this._side(ems, 'back');
    return html`<ul aria-label=${t('Particle layers')}>
        ${front.flatMap((e) => this._rowsOf(doc, e, ems, toggles))}
        <li class="lcontent" title=${t('Card content. Text, icons and background of the card.')}>
          <ha-icon icon="mdi:card-text-outline" aria-hidden="true"></ha-icon><span>${t('Card content')}</span><span class="sr">${t('. Text, icons and background of the card.')}</span>
        </li>
        ${back.flatMap((e) => this._rowsOf(doc, e, ems, toggles))}
      </ul>
      ${hasSim && !ready ? html`<p class="note">${t('Hide and solo are unavailable: the particle preview could not be built.')}</p>` : nothing}`;
  }
}

registerPanel({
  tag: 'mc-anim-particles-layers',
  place: 'layers',
  when: (doc) => doc.kind === 'particles',
  title: m('Particle layers'),
  order: 10,
});

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-particles-layers': AnimParticlesLayers;
  }
}
