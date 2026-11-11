import { html, nothing, type TemplateResult } from 'lit';
import type { ClipPlay, ImageClip } from '../contracts/image-animation';
import { t } from './i18n';
import { defaultClip } from './tracks';

// The clip list of the animator: name a clip, choose what starts it and how it repeats, all from lists and fields.

export type TriggerKind = ClipPlay['on'];

export interface StateFields {
  entity: string;
  attribute: string;
  kind: string;
  value: string;
}

export interface ClipsPanelProps {
  clips: readonly ImageClip[];
  selected: string;
  /** The clip whose state fields are open before a state trigger is saved. */
  drafting: string;
  /** The last thing that went wrong or worked, shown in a live region. */
  message: string;
  /** Leave out the timing and trigger fields that still hold their defaults. */
  modifiedOnly?: boolean;
  select(id: string): void;
  create(name: string): void;
  rename(id: string, name: string): void;
  remove(id: string): void;
  duplicate(id: string): void;
  move(id: string, delta: -1 | 1): void;
  setTrigger(id: string, kind: TriggerKind): void;
  bindState(id: string, fields: StateFields): void;
  setTiming(id: string, timing: { duration?: number; iterations?: 'infinite' | number; direction?: NonNullable<ImageClip['direction']> }): void;
}

const value = (root: ParentNode, name: string): string => (root.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`)?.value ?? '').trim();

function triggerLabel(kind: TriggerKind): string {
  switch (kind) {
    case 'hover':
      return t('image-animator.clips-panel.hovering-over-the-image');
    case 'tap':
      return t('image-animator.clips-panel.tapping-the-image');
    case 'state':
      return t('image-animator.clips-panel.an-entity-reaches-a-state');
    default:
      return t('image-animator.clips-panel.always');
  }
}

function whenKind(play: ClipPlay): string {
  if (play.on !== 'state') return 'state';
  const w = play.when;
  if ('state_not' in w) return 'state_not';
  if ('entity_on' in w) return w.entity_on ? 'on' : 'off';
  if ('above' in w) return 'above';
  if ('below' in w) return 'below';
  return 'state';
}

function whenValue(play: ClipPlay): string {
  if (play.on !== 'state') return '';
  const w = play.when;
  if ('state' in w) return w.state;
  if ('state_not' in w) return w.state_not;
  if ('above' in w) return String(w.above);
  if ('below' in w) return String(w.below);
  return '';
}

function stateFields(p: ClipsPanelProps, clip: ImageClip): TemplateResult {
  const play = clip.play;
  const kind = whenKind(play);
  const kinds: [string, string][] = [
    ['state', t('image-animator.clips-panel.state-is')],
    ['state_not', t('image-animator.clips-panel.state-is-not')],
    ['on', t('image-animator.clips-panel.is-on')],
    ['off', t('image-animator.clips-panel.is-off')],
    ['above', t('image-animator.clips-panel.above')],
    ['below', t('image-animator.clips-panel.below')],
  ];
  return html`<div class="state-fields">
    <div class="ia-row">
      <label for="clip-entity">${t('image-animator.clips-panel.entity')}</label>
      <input id="clip-entity" name="entity" type="text" autocomplete="off" spellcheck="false" .value=${play.on === 'state' ? play.entity : ''} />
    </div>
    <div class="ia-row">
      <label for="clip-attribute">${t('image-animator.clips-panel.attribute-optional')}</label>
      <input id="clip-attribute" name="attribute" type="text" autocomplete="off" spellcheck="false" .value=${play.on === 'state' ? (play.attribute ?? '') : ''} />
    </div>
    <div class="ia-row">
      <label for="clip-condition">${t('image-animator.clips-panel.condition')}</label>
      <select id="clip-condition" name="kind" .value=${kind}>
        ${kinds.map(([k, text]) => html`<option value=${k} ?selected=${k === kind}>${text}</option>`)}
      </select>
    </div>
    <div class="ia-row">
      <label for="clip-value">${t('image-animator.clips-panel.value')}</label>
      <input id="clip-value" name="value" type="text" autocomplete="off" .value=${whenValue(play)} />
    </div>
    <div class="ia-row">
      <button
        type="button"
        class="btn btn-secondary"
        @click=${(e: Event) => {
          const root = (e.target as HTMLElement).closest('.state-fields');
          if (root) p.bindState(clip.id, { entity: value(root, 'entity'), attribute: value(root, 'attribute'), kind: value(root, 'kind'), value: value(root, 'value') });
        }}
      >
        ${t('image-animator.clips-panel.use-this-trigger')}
      </button>
    </div>
  </div>`;
}

const clipChanged = (c: ImageClip): boolean => {
  const fresh = defaultClip();
  return (
    c.tracks.length > 0 ||
    !!c.morphs?.length ||
    c.name !== fresh.name ||
    c.play.on !== 'always' ||
    c.duration !== fresh.duration ||
    (c.delay ?? 0) !== 0 ||
    c.easing !== fresh.easing ||
    c.iterations !== 'infinite' ||
    (c.direction ?? 'normal') !== 'normal'
  );
};

/** True when any clip differs from a fresh one, or a trigger is being drafted. */
export const clipsModified = (clips: readonly ImageClip[], drafting?: string): boolean => clips.length > 1 || !!drafting || clips.some(clipChanged);

/** True when a clip carries effects or morphs, which the target, effect and morph panels hold. */
export const clipsHaveEffects = (clips: readonly ImageClip[]): boolean => clips.some((c) => c.tracks.length > 0 || !!c.morphs?.length);

function details(p: ClipsPanelProps, clip: ImageClip, index: number): TemplateResult | typeof nothing {
  const forever = clip.iterations === 'infinite';
  const only = p.modifiedOnly === true;
  const showName = !only || clip.name !== defaultClip().name;
  const showTrigger = !only || clip.play.on !== 'always' || p.drafting === clip.id;
  const showDuration = !only || clip.duration !== 2;
  const showForever = !only || !forever;
  const showDirection = !only || (clip.direction ?? 'normal') !== 'normal';
  const kinds: TriggerKind[] = ['always', 'hover', 'tap', 'state'];
  const shown = p.drafting === clip.id ? 'state' : clip.play.on;
  if (only && !(showName || showTrigger || showDuration || showForever || showDirection || !forever || shown === 'state')) return nothing;
  const directions: [NonNullable<ImageClip['direction']>, string][] = [
    ['normal', t('image-animator.clips-panel.forwards')],
    ['reverse', t('image-animator.clips-panel.backwards')],
    ['alternate', t('image-animator.clips-panel.back-and-forth')],
    ['alternate-reverse', t('image-animator.clips-panel.back-and-forth-starting-backwards')],
  ];
  return html`<div class="clip-details" role="group" aria-labelledby=${showName ? 'clip-name-label' : 'clips-title'}>
    ${showName
      ? html`<div class="ia-row">
      <label id="clip-name-label" for="clip-name">${t('image-animator.clips-panel.clip-name')}</label>
      <input id="clip-name" type="text" maxlength="64" .value=${clip.name} @change=${(e: Event) => p.rename(clip.id, (e.target as HTMLInputElement).value)} />
    </div>`
      : nothing}
    ${showTrigger
      ? html`<div class="ia-row">
      <label for="clip-trigger">${t('image-animator.clips-panel.starts-when')}</label>
      <select id="clip-trigger" .value=${shown} @change=${(e: Event) => p.setTrigger(clip.id, (e.target as HTMLSelectElement).value as TriggerKind)}>
        ${kinds.map((k) => html`<option value=${k} ?selected=${k === shown}>${triggerLabel(k)}</option>`)}
      </select>
    </div>`
      : nothing}
    ${shown === 'state' ? stateFields(p, clip) : nothing}
    ${showDuration
      ? html`<div class="ia-row">
      <label for="clip-duration">${t('image-animator.clips-panel.duration-seconds')}</label>
      <input id="clip-duration" type="number" min="0.05" max="600" step="0.05" .value=${String(clip.duration)} @change=${(e: Event) => p.setTiming(clip.id, { duration: Number((e.target as HTMLInputElement).value) })} />
    </div>`
      : nothing}
    ${showForever
      ? html`<div class="ia-row">
      <label for="clip-forever">${t('image-animator.clips-panel.repeat-forever')}</label>
      <input id="clip-forever" type="checkbox" .checked=${forever} @change=${(e: Event) => p.setTiming(clip.id, { iterations: (e.target as HTMLInputElement).checked ? 'infinite' : 1 })} />
    </div>`
      : nothing}
    ${forever
      ? nothing
      : html`<div class="ia-row">
          <label for="clip-repeats">${t('image-animator.clips-panel.repeats')}</label>
          <input id="clip-repeats" type="number" min="0.01" max="1000" step="1" .value=${String(clip.iterations)} @change=${(e: Event) => p.setTiming(clip.id, { iterations: Number((e.target as HTMLInputElement).value) })} />
        </div>`}
    ${showDirection
      ? html`<div class="ia-row">
      <label for="clip-direction">${t('image-animator.clips-panel.direction')}</label>
      <select id="clip-direction" .value=${clip.direction ?? 'normal'} @change=${(e: Event) => p.setTiming(clip.id, { direction: (e.target as HTMLSelectElement).value as NonNullable<ImageClip['direction']> })}>
        ${directions.map(([k, text]) => html`<option value=${k} ?selected=${k === (clip.direction ?? 'normal')}>${text}</option>`)}
      </select>
    </div>`
      : nothing}
    ${only
      ? nothing
      : html`<div class="ia-row">
      <button type="button" class="btn btn-secondary" ?disabled=${index === 0} @click=${() => p.move(clip.id, -1)}>${t('image-animator.clips-panel.move-up')}</button>
      <button type="button" class="btn btn-secondary" ?disabled=${index === p.clips.length - 1} @click=${() => p.move(clip.id, 1)}>${t('image-animator.clips-panel.move-down')}</button>
      <button type="button" class="btn btn-secondary" @click=${() => p.duplicate(clip.id)}>${t('image-animator.clips-panel.duplicate')}</button>
      <button type="button" class="btn btn-secondary" @click=${() => p.remove(clip.id)}>${t('image-animator.clips-panel.delete')}</button>
    </div>`}
  </div>`;
}

export function renderClips(p: ClipsPanelProps): TemplateResult | typeof nothing {
  const index = p.clips.findIndex((c) => c.id === p.selected);
  const clip = index < 0 ? undefined : p.clips[index];
  if (p.modifiedOnly === true) {
    if (!clipsModified(p.clips, p.drafting)) return nothing;
    const list = p.clips.length > 1;
    const body = clip ? details(p, clip, index) : nothing;
    if (!list && body === nothing) return nothing;
    return html`<section aria-labelledby="clips-title">
      <h3 id="clips-title">${t('image-animator.clips-panel.clips')}</h3>
      ${list
        ? html`<ul class="clip-list">
            ${p.clips.map((c) => html`<li><button type="button" class="btn btn-secondary" aria-pressed=${c.id === p.selected ? 'true' : 'false'} @click=${() => p.select(c.id)}>${c.name}</button></li>`)}
          </ul>`
        : nothing}
      ${body}
    </section>`;
  }
  return html`<section aria-labelledby="clips-title">
    <h3 id="clips-title">${t('image-animator.clips-panel.clips')}</h3>
    <p class="hint">${t('image-animator.clips-panel.name-each-animation-and-choose-what-starts-it')}</p>
    <ul class="clip-list">
      ${p.clips.map((c) => html`<li><button type="button" class="btn btn-secondary" aria-pressed=${c.id === p.selected ? 'true' : 'false'} @click=${() => p.select(c.id)}>${c.name}</button></li>`)}
    </ul>
    ${clip ? details(p, clip, index) : nothing}
    <form
      class="ia-row"
      @submit=${(e: Event) => {
        e.preventDefault();
        const input = (e.target as HTMLFormElement).querySelector('input');
        if (input) {
          p.create(input.value);
          input.value = '';
        }
      }}
    >
      <label for="clip-new">${t('image-animator.clips-panel.new-clip-name')}</label>
      <input id="clip-new" type="text" maxlength="64" autocomplete="off" />
      <button type="submit" class="btn btn-secondary">${t('image-animator.clips-panel.add-clip')}</button>
    </form>
    <p class="status" role="status">${p.message}</p>
  </section>`;
}
