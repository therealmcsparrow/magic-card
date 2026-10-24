import { html, nothing, type TemplateResult } from 'lit';
import { type BackgroundLayerConfig, type BgLayerType, type BgPattern, type PanZoomConfig } from '../../contracts/bg-stack';
import { BLUR_LIGHT_MAX, BLUR_MAX, type LayerAnchor } from '../../contracts/layer-placement';
import type { HomeAssistant } from '../../types';
import { editableGradient } from '../components/gradient-editor';
import '../components/gradient-editor';
import '../components/color-picker';
import '../components/media-picker';
import '../components/entity-picker';
import '../components/attribute-picker';
import '../components/mc-anchor-grid';
import { t as te } from '../i18n';
import { m, t } from './i18n';
import { toYaml } from '../../utils/yaml-utils';
import { parseGradient } from '../../utils/gradient';
import { LAYER_TYPES } from './bg-layers-model';
import { isCameraEntity, imageSource, setImageSource, setStateRow, removeStateRow, renameStateRow, stateRows, switchType, usesLibraryImage, type ImageSource } from './bg-layers-ops';
import { withImageTools } from '../image-tools-loader';
import type { PanPreview } from './bg-status';
import { blendTiles, chevron, lyrSeg, lyrSlider, lyrSwitch } from './controls';
import { isAnchor } from './placement-model';

/*
 * Per-type editors of one Card backdrop layer. Every control writes the
 * plain bg-stack 1.0.0 keys of that layer. The element in bg-layers.ts owns the state; these functions only
 * render, through the small EditorHost interface.
 */

export interface EditorHost {
  hass?: HomeAssistant;
  cardEntity?: string;
  /** A unique id for part `p` of layer `i`. */
  idOf(i: number, p: string): string;
  /** Set keys on layer `i`; undefined removes one. */
  patch(i: number, p: Partial<BackgroundLayerConfig>): void;
  /** Replace layer `i` (type or source switch); the group offers Undo. */
  swap(i: number, next: BackgroundLayerConfig, message: string): void;
  preview?: PanPreview;
  setPreview(p?: PanPreview): void;
  /** A live canvas draws the Preview (the studio); in the card dialog of Home Assistant there is none. */
  canPreview?: boolean;
  /** Index with a blank state row waiting for its name. */
  blankRow?: number;
  addBlankRow(i: number): void;
  clearBlankRow(): void;
  panOpen(i: number): boolean;
  togglePan(i: number): void;
  yamlOpen(i: number): boolean;
  toggleYaml(i: number): void;
  copyYaml(text: string): void;
  copied: boolean;
}

const PATTERNS: ReadonlyArray<{ value: BgPattern; label: ReturnType<typeof m> }> = [
  { value: 'dots', label: m('Dots') },
  { value: 'grid', label: m('Grid') },
  { value: 'lines', label: m('Lines') },
  { value: 'diagonal', label: m('Diagonal lines') },
  { value: 'checks', label: m('Checks') },
];

const SIZES: ReadonlyArray<{ value: 'cover' | 'contain' | 'auto' | 'custom'; label: ReturnType<typeof m> }> = [
  { value: 'cover', label: m('Fill the card') },
  { value: 'contain', label: m('Fit inside') },
  { value: 'auto', label: m('Original size') },
  { value: 'custom', label: m('Custom size') },
];

const REPEATS: ReadonlyArray<{ value: NonNullable<BackgroundLayerConfig['repeat']>; label: ReturnType<typeof m> }> = [
  { value: 'no-repeat', label: m('Do not repeat') },
  { value: 'repeat-x', label: m('Repeat sideways') },
  { value: 'repeat-y', label: m('Repeat downwards') },
  { value: 'repeat', label: m('Repeat both') },
];

const WEATHER_STATES = ['clear-night', 'cloudy', 'exceptional', 'fog', 'hail', 'lightning', 'lightning-rainy', 'partlycloudy', 'pouring', 'rainy', 'snowy', 'snowy-rainy', 'sunny', 'windy', 'windy-variant'];

/** Known states of an entity, for the state name suggestions. */
export function stateSuggestions(hass: HomeAssistant | undefined, entity: string | undefined): string[] {
  if (!entity) return [];
  if (entity.startsWith('weather.')) return WEATHER_STATES;
  const st = hass?.states?.[entity];
  const options = st?.attributes?.options;
  const out = Array.isArray(options) ? options.filter((o): o is string => typeof o === 'string') : [];
  if (st?.state && !out.includes(st.state)) out.push(st.state);
  return out.slice(0, 50);
}

const num = (e: Event): number => Number((e.target as HTMLInputElement).value);
const val = (e: Event): string => (e.target as HTMLInputElement).value;

export function sizeKind(layer: BackgroundLayerConfig): 'cover' | 'contain' | 'auto' | 'custom' {
  const s = layer.size;
  return s === undefined || s === 'cover' ? 'cover' : s === 'contain' || s === 'auto' ? s : 'custom';
}

/** The % of a custom size ("60%" or 60), else 100. */
export function customPercent(layer: BackgroundLayerConfig): number {
  const n = parseFloat(String(layer.size));
  return Number.isFinite(n) ? Math.max(1, Math.min(400, Math.round(n))) : 100;
}

// ── image ──

/** The library image field (the plain media picker until its chunk is there); `on` gets the new value, '' for none. */
function imageField(h: EditorHost, value: string, compact: boolean, label: string, hint: boolean, on: (value: string) => void): TemplateResult {
  const plain = (): TemplateResult => html`<mc-media-picker .hass=${h.hass} .value=${value} .mediaType=${'image'} @value-changed=${(e: CustomEvent) => on(String(e.detail.value))}></mc-media-picker>`;
  return withImageTools(
    () => html`<mc-library-image-field .hass=${h.hass} .value=${value} .context=${'background'} .compact=${compact} .label=${label} .statesHint=${hint} @image-change=${(e: CustomEvent<{ keys: { image?: string } }>) => {
      e.stopPropagation();
      on(String(e.detail.keys.image ?? ''));
    }}></mc-library-image-field>`,
    plain,
  );
}

function renderSource(h: EditorHost, layer: BackgroundLayerConfig, i: number): TemplateResult {
  const src = imageSource(layer);
  const items: ReadonlyArray<{ value: ImageSource; label: string }> = [
    { value: 'picture', label: t('One picture') },
    { value: 'device', label: t('Follows a device') },
    { value: 'state', label: t('Changes with state') },
  ];
  const entity = typeof layer.entity === 'string' ? layer.entity : '';
  const camera = isCameraEntity(entity);
  return html`<div class="field">
    <span class="lbl">${t('Source')}</span>
    ${lyrSeg(t('Source'), src, items, (v) => h.swap(i, setImageSource(layer, v), t('Source changed.')), 'source')}
    ${src === 'picture'
      ? imageField(h, layer.image ?? '', false, '', false, (v) => h.patch(i, { image: v || undefined }))
      : html`<div>
          <label>${t('Device')}</label>
          <mc-entity-picker .hass=${h.hass} .value=${entity} .placeholder=${src === 'state' ? t("Leave empty to use the card's device") : 'entity_id'} @value-changed=${(e: CustomEvent) => h.patch(i, { entity: src === 'state' ? String(e.detail.value) || undefined : String(e.detail.value) })}></mc-entity-picker>
        </div>`}
    ${src === 'device'
      ? html`<div>
          <span class="lbl">${t('Which picture?')}</span>
          ${lyrSeg(
            t('Which picture?'),
            layer.attribute ? 'other' : 'own',
            [{ value: 'own' as const, label: t("The device's own picture") }, { value: 'other' as const, label: t('Another attribute…') }],
            (v) => h.patch(i, { attribute: v === 'own' ? undefined : layer.attribute || 'entity_picture' }),
            'attr',
          )}
          ${layer.attribute
            ? html`<mc-attribute-picker .hass=${h.hass} .entityId=${entity} .value=${layer.attribute} @value-changed=${(e: CustomEvent) => h.patch(i, { attribute: String(e.detail.value) || undefined })}></mc-attribute-picker>`
            : nothing}
        </div>`
      : nothing}
    ${src === 'device' && camera ? renderCamera(h, layer, i) : nothing}
    ${src === 'state' ? renderStates(h, layer, i) : nothing}
  </div>`;
}

function renderCamera(h: EditorHost, layer: BackgroundLayerConfig, i: number): TemplateResult {
  const refresh = Math.max(5, layer.refresh ?? 10);
  return html`<div class="camera">
    <p class="help" data-hint="camera">${t('Still picture, refreshed every {n} s: the light choice for a quiet backdrop. Use a live camera behind other modules only when live video is really needed.', { n: refresh })}</p>
    <label for=${h.idOf(i, 'refresh')}>${t('Refresh every')}</label>
    <div class="inline">
      <input class="lyr-input input" id=${h.idOf(i, 'refresh')} type="number" min="5" step="1" .value=${String(refresh)} @change=${(e: Event) => h.patch(i, { refresh: Math.max(5, Math.round(num(e)) || 10) })} />
      <span aria-hidden="true">${t('seconds')}</span>
    </div>
    ${lyrSwitch(h.idOf(i, 'stale'), t('Show "Not updated" when snapshots fail'), layer.stale_badge !== false, (v) => h.patch(i, { stale_badge: v ? undefined : false }), t('Dims the frame and shows how long ago the last good picture arrived.'))}
  </div>`;
}

function renderStates(h: EditorHost, layer: BackgroundLayerConfig, i: number): TemplateResult {
  const rows = stateRows(layer);
  const listId = h.idOf(i, 'states');
  const hints = stateSuggestions(h.hass, (typeof layer.entity === 'string' && layer.entity) || h.cardEntity);
  return html`<div class="states">
    <datalist id=${listId}>${hints.map((s) => html`<option value=${s}></option>`)}</datalist>
    ${rows.map(
      ([state, image], at) => html`<div class="state-row" data-state=${state}>
        <label>${t('When state is')}<input class="lyr-input input" list=${listId} .value=${state} @change=${(e: Event) => h.swap(i, renameStateRow(layer, state, val(e)), t('State renamed.'))} /></label>
        ${imageField(h, image, true, `${t('When state is')} ${state}`, at === 0 && usesLibraryImage(layer), (v) => h.patch(i, setStateRow(layer, state, v)))}
        <button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="remove-state" aria-label=${t('Remove state {state}', { state })} @click=${() => h.patch(i, removeStateRow(layer, state))}>${t('Remove')}</button>
      </div>`,
    )}
    ${h.blankRow === i
      ? html`<div class="state-row" data-state="">
          <label>${t('When state is')}<input class="lyr-input input" list=${listId} .value=${''} @change=${(e: Event) => {
            const name = val(e).trim();
            h.clearBlankRow();
            if (name) h.patch(i, setStateRow(layer, name, ''));
          }} /></label>
        </div>`
      : nothing}
    <div class="acts"><button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="add-state" @click=${() => h.addBlankRow(i)}>${t('Add state')}</button></div>
    <div>
      <span class="lbl">${t('Any other state')}</span>
      ${imageField(h, layer.image ?? '', true, t('Any other state'), !rows.length && usesLibraryImage(layer), (v) => h.patch(i, { image: v || undefined }))}
    </div>
    <p class="help">${t('Pictures change but text stays. Darken behind text works for all of them. On a wall tablet seen from across the room, use large text.')}</p>
  </div>`;
}

function renderFit(h: EditorHost, layer: BackgroundLayerConfig, i: number): TemplateResult {
  const kind = sizeKind(layer);
  const pos = isAnchor(layer.position) ? layer.position : undefined;
  return html`<div class="fit">
    <div class="row2">
      <div class="f">
        <span class="lbl">${t('Position')}</span>
        <mc-anchor-grid .value=${pos} .label=${t('Position of the picture')} @change=${(e: CustomEvent) => h.patch(i, { position: e.detail.value === 'center' ? undefined : (e.detail.value as LayerAnchor) })}></mc-anchor-grid>
      </div>
      <div class="f">
        <span class="lbl">${t('Size')}</span>
        ${lyrSeg(t('Size'), kind, SIZES.map((s) => ({ value: s.value, label: t(s.label) })), (v) => h.patch(i, { size: v === 'cover' ? undefined : v === 'custom' ? '100%' : v }), 'size')}
        ${kind === 'custom'
          ? html`<label for=${h.idOf(i, 'size')}>${t('Size in %')}</label>
              <input class="lyr-input input" id=${h.idOf(i, 'size')} type="number" min="1" max="400" step="1" .value=${String(customPercent(layer))} @change=${(e: Event) => h.patch(i, { size: `${Math.max(1, Math.min(400, Math.round(num(e)) || 100))}%` })} />`
          : nothing}
      </div>
    </div>
    ${kind !== 'cover' && !usesLibraryImage(layer)
      ? html`<div>
          <label for=${h.idOf(i, 'repeat')}>${t('Repeat')}</label>
          <select class="lyr-input input" id=${h.idOf(i, 'repeat')} @change=${(e: Event) => h.patch(i, { repeat: val(e) === 'no-repeat' ? undefined : (val(e) as BackgroundLayerConfig['repeat']) })}>
            ${REPEATS.map((r) => html`<option value=${r.value} ?selected=${(layer.repeat ?? 'no-repeat') === r.value}>${t(r.label)}</option>`)}
          </select>
        </div>`
      : nothing}
  </div>`;
}

function renderPanZoom(h: EditorHost, layer: BackgroundLayerConfig, i: number): TemplateResult {
  const pz = layer.pan_zoom;
  const on = !!pz;
  const open = h.panOpen(i);
  const set = (p: Partial<PanZoomConfig>): void => h.patch(i, { pan_zoom: { ...pz, ...p } });
  const camera = isCameraEntity(typeof layer.entity === 'string' ? layer.entity : undefined);
  const prev = h.preview;
  return html`<div class="pan">
    <button type="button" class="disc" aria-expanded=${open ? 'true' : 'false'} aria-controls=${h.idOf(i, 'pan')} @click=${() => h.togglePan(i)}>
      <span>${t('Pan and zoom')}</span>${on ? html`<span class="chip is-count">${t('On')}</span>` : nothing}${chevron()}
    </button>
    <div class="effects" id=${h.idOf(i, 'pan')} ?hidden=${!open}>
      ${lyrSwitch(h.idOf(i, 'panon'), t('Pan and zoom'), on, (v) => h.patch(i, { pan_zoom: v ? { from: 100, to: 115, duration: 30, alternate: true, pause_when_idle: true } : undefined }), t('Moves slowly, pauses when the card is off screen and stays still when the device asks for reduced motion.'))}
      ${camera ? html`<p class="help">${t('Pan and zoom work on a still picture from a camera, not on live video.')}</p>` : nothing}
      ${on
        ? html`${lyrSlider(h.idOf(i, 'from'), t('Zoom from'), pz!.from ?? 100, 100, 200, '%', (v) => set({ from: v }))}
            ${lyrSlider(h.idOf(i, 'to'), t('Zoom to'), pz!.to ?? 115, 100, 200, '%', (v) => set({ to: v }))}
            <div>
              <span class="lbl">${t('Focus point')}</span>
              <mc-anchor-grid .value=${pz!.focus ?? 'center'} .label=${t('Where the framing ends')} @change=${(e: CustomEvent) => set({ focus: e.detail.value as LayerAnchor })}></mc-anchor-grid>
            </div>
            ${lyrSlider(h.idOf(i, 'dur'), t('Duration'), pz!.duration ?? 30, 10, 120, 's', (v) => set({ duration: v }))}
            ${lyrSwitch(h.idOf(i, 'alt'), t('Back and forth'), pz!.alternate !== false, (v) => set({ alternate: v ? undefined : false }))}
            ${lyrSwitch(h.idOf(i, 'idle'), t('Rest when nobody is there'), pz!.pause_when_idle === true, (v) => set({ pause_when_idle: v ? true : undefined }), t('Motion stops 2 minutes after the last touch, which saves power on a wall tablet.'))}
            ${h.canPreview === false
              ? nothing
              : html`<div>
              <span class="lbl">${t('Preview (not saved)')}</span>
              ${lyrSeg(t('Preview'), prev, [{ value: 'play' as PanPreview, label: t('Play') }, { value: 'start' as PanPreview, label: t('Start') }, { value: 'end' as PanPreview, label: t('End') }], (v) => h.setPreview(prev === v ? undefined : v), 'preview')}
              <p class="help">${t('Shows the framing in the preview. It plays even if the device asks for reduced motion, because you asked for it.')}</p>
              ${prev === 'play' ? html`<button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="stop-preview" @click=${(e: Event) => stopPreview(h, e)}>${t('Stop preview')}</button>` : nothing}
            </div>`}`
        : nothing}
    </div>
  </div>`;
}

/** Stop preview removes itself: focus goes to Play first, so it does not fall to the page (WCAG 2.4.3). */
function stopPreview(h: EditorHost, e: Event): void {
  (e.currentTarget as HTMLElement).parentElement?.querySelector<HTMLElement>('[data-seg=preview] [data-val=play]')?.focus();
  h.setPreview(undefined);
}

function renderImage(h: EditorHost, layer: BackgroundLayerConfig, i: number): TemplateResult {
  const blur = Math.max(0, Math.min(BLUR_MAX, layer.blur ?? 0));
  return html`${renderSource(h, layer, i)}
    ${renderFit(h, layer, i)}
    ${lyrSlider(h.idOf(i, 'blur'), t('Blur'), blur, 0, BLUR_MAX, 'px', (v) => h.patch(i, { blur: v || undefined }))}
    ${blur > BLUR_LIGHT_MAX ? html`<p class="warnrow" data-warn="blur">${t('Strong blur can make older tablets slow.')}</p>` : nothing}
    ${renderPanZoom(h, layer, i)}`;
}

// ── gradient, pattern, colour ──

function renderGradient(h: EditorHost, layer: BackgroundLayerConfig, i: number): TemplateResult {
  const model = editableGradient(layer.gradient, true);
  const quick = [
    { id: 'bottom', label: t('Dim from bottom'), value: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.6))' },
    { id: 'top', label: t('Dim from top'), value: 'linear-gradient(180deg, rgba(0,0,0,.6), rgba(0,0,0,0))' },
  ];
  return html`<div class="field">
    <div class="acts" role="group" aria-label=${t('Quick gradients')}>
      ${quick.map((q) => html`<button type="button" class="lyr-btn btn btn-secondary btn-sm" data-quick=${q.id} @click=${() => h.patch(i, { gradient: q.value })}>${q.label}</button>`)}
    </div>
    ${model
      ? html`<mc-gradient-editor .model=${model} .label=${t('Gradient')} .allowRadial=${true} @value-changed=${(e: CustomEvent) => h.patch(i, { gradient: String(e.detail.value) })}></mc-gradient-editor>`
      : html`<div>
          <label for=${h.idOf(i, 'css')}>${t('Gradient (CSS)')}</label>
          <input class="lyr-input input" id=${h.idOf(i, 'css')} type="text" spellcheck="false" .value=${layer.gradient ?? ''} aria-invalid=${layer.gradient && !parseGradient(layer.gradient) ? 'true' : 'false'} @change=${(e: Event) => h.patch(i, { gradient: val(e).trim() || undefined })} />
          ${layer.gradient && !parseGradient(layer.gradient) ? html`<p class="err" role="alert">${t('This gradient cannot be shown. Use linear-gradient(180deg, red, blue) or radial-gradient(circle, red, blue).')}</p>` : nothing}
          <p class="help">${t('This gradient has CSS the editor cannot draw. Pick a quick gradient above to use the editor.')}</p>
        </div>`}
  </div>`;
}

function renderPattern(h: EditorHost, layer: BackgroundLayerConfig, i: number): TemplateResult {
  const cur = layer.pattern ?? 'dots';
  const line = cur === 'lines' || cur === 'diagonal' || cur === 'grid';
  return html`<div class="field">
    <span class="lbl" id=${h.idOf(i, 'pt')}>${t('Pattern')}</span>
    <div class="tiles2" role="group" aria-labelledby=${h.idOf(i, 'pt')}>
      ${PATTERNS.map((p) => html`<button type="button" class="lyr-tile" data-pattern=${p.value} aria-pressed=${cur === p.value ? 'true' : 'false'} @click=${() => h.patch(i, { pattern: p.value })}><span class="nm">${cur === p.value ? '✓ ' : ''}${t(p.label)}</span></button>`)}
    </div>
    <div>
      <span class="lbl">${t('Colour')}</span>
      <mc-color-picker .value=${layer.color ?? ''} .label=${t('Pattern colour')} @value-changed=${(e: CustomEvent) => h.patch(i, { color: String(e.detail.value) || undefined })}></mc-color-picker>
    </div>
    ${lyrSlider(h.idOf(i, 'cell'), t('Size'), Math.max(4, Math.min(64, layer.size ? Number(layer.size) || 16 : 16)), 4, 64, 'px', (v) => h.patch(i, { size: v }))}
    ${lyrSlider(h.idOf(i, 'thick'), line ? t('Thickness') : t('Dot size'), Math.max(1, Math.min(8, layer.thickness ?? 2)), 1, 8, 'px', (v) => h.patch(i, { thickness: v }))}
  </div>`;
}

function renderColour(h: EditorHost, layer: BackgroundLayerConfig, i: number): TemplateResult {
  return html`<div class="field">
    <span class="lbl">${t('Colour')}</span>
    <mc-color-picker .value=${layer.color ?? ''} .label=${t('Colour')} @value-changed=${(e: CustomEvent) => h.patch(i, { color: String(e.detail.value) || undefined })}></mc-color-picker>
  </div>`;
}

// ── one layer ──

export function renderLayerEditor(h: EditorHost, layer: BackgroundLayerConfig, i: number): TemplateResult {
  const type = layer.type;
  const yaml = toYaml(layer).trimEnd();
  return html`<div class="editor" data-editor=${type}>
    <div class="field">
      <span class="lbl">${t('Layer type')}</span>
      ${lyrSeg(t('Layer type'), type as BgLayerType, LAYER_TYPES.map((x) => ({ value: x.value, label: te(x.label) })), (v) => v !== type && h.swap(i, switchType(layer, v), t('Layer type changed.')), 'type')}
    </div>
    ${type === 'image' ? renderImage(h, layer, i) : type === 'gradient' ? renderGradient(h, layer, i) : type === 'pattern' ? renderPattern(h, layer, i) : renderColour(h, layer, i)}
    ${lyrSlider(h.idOf(i, 'op'), t('Opacity'), Math.max(0, Math.min(100, layer.opacity ?? 100)), 0, 100, '%', (v) => h.patch(i, { opacity: v === 100 ? undefined : v }))}
    ${blendTiles(h.idOf(i, 'bl'), layer.blend, (v) => h.patch(i, { blend: v }))}
    <div>
      <button type="button" class="disc" aria-expanded=${h.yamlOpen(i) ? 'true' : 'false'} aria-controls=${h.idOf(i, 'y')} @click=${() => h.toggleYaml(i)}><span>${t('Show YAML')}</span>${chevron()}</button>
      <div id=${h.idOf(i, 'y')} ?hidden=${!h.yamlOpen(i)}>
        <pre class="yaml" data-yaml>${yaml}</pre>
        <div class="acts"><button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="copy-yaml" @click=${() => h.copyYaml(yaml)}>${h.copied ? t('Copied') : t('Copy YAML')}</button></div>
      </div>
    </div>
  </div>`;
}
