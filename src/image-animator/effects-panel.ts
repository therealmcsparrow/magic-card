import { html, nothing, type TemplateResult } from 'lit';
import { presetKeyframes } from '../anim-studio/from-preset';
import { t as label } from '../i18n/labels';
import { ANIMATION_PRESETS } from '../utils/animation-presets';
import { t } from './i18n';
import type { ImageTarget } from './targets';
import type { Availability, EffectKind } from './tracks';

// The target list and the effect buttons of the animator: everything the canvas does by pointer can be done from here by keyboard.

export interface PresetChoice {
  id: string;
  name: string;
}

export interface PanelProps {
  targets: readonly ImageTarget[];
  target: ImageTarget;
  availability: Availability;
  presets: readonly PresetChoice[];
  presetId: string;
  path: string;
  /** The last thing that went wrong or worked, shown in a live region. */
  message: string;
  pick(ref: ImageTarget['ref']): void;
  add(kind: EffectKind): void;
  setPreset(id: string): void;
  setPath(d: string): void;
}

let choices: PresetChoice[] | undefined;

/** The built-in presets that are plain keyframes, which the image animator can put on a track. */
export function presetChoices(): PresetChoice[] {
  choices ??= ANIMATION_PRESETS.flatMap((p) => {
    try {
      presetKeyframes(p.id);
      return [{ id: p.id, name: label(p.name) }];
    } catch {
      return [];
    }
  });
  return choices;
}

export function targetName(target: ImageTarget): string {
  if (target.kind === 'image') return t('image-animator.effects-panel.whole-image');
  return target.kind === 'group' ? t('image-animator.effects-panel.group-id', { id: target.id ?? '' }) : t('image-animator.effects-panel.shape-id', { id: target.id ?? '' });
}

function effectName(kind: EffectKind): string {
  switch (kind) {
    case 'transform':
      return t('image-animator.effects-panel.move-and-turn');
    case 'opacity':
      return t('image-animator.effects-panel.fade');
    case 'colour':
      return t('image-animator.effects-panel.colour');
    case 'filter':
      return t('image-animator.effects-panel.glow');
    case 'stroke-draw':
      return t('image-animator.effects-panel.draw-the-outline');
    case 'motion-path':
      return t('image-animator.effects-panel.follow-a-path');
    default:
      return t('image-animator.effects-panel.preset');
  }
}

export const effectLabel = effectName;

const SIMPLE: readonly EffectKind[] = ['transform', 'opacity', 'colour', 'filter', 'stroke-draw'];

export function renderTargetList(p: PanelProps): TemplateResult {
  return html`<section aria-labelledby="targets-title">
    <h3 id="targets-title">${t('image-animator.effects-panel.parts-of-the-image')}</h3>
    <p class="hint" id="targets-hint">${t('image-animator.effects-panel.click-a-part-of-the-drawing-or-choose')}</p>
    <ul class="targets" aria-describedby="targets-hint">
      ${p.targets.map(
        (x) => html`<li>
          <button type="button" class="target" aria-pressed=${x.ref === p.target.ref ? 'true' : 'false'} @click=${() => p.pick(x.ref)}>${targetName(x)}</button>
        </li>`,
      )}
    </ul>
  </section>`;
}

export function renderEffects(p: PanelProps): TemplateResult {
  const stroke = p.availability['stroke-draw'];
  return html`<section aria-labelledby="effects-title">
    <h3 id="effects-title">${t('image-animator.effects-panel.add-an-effect-to-name', { name: targetName(p.target) })}</h3>
    <div class="effects" role="group" aria-labelledby="effects-title">
      ${SIMPLE.map((kind) => {
        const a = p.availability[kind];
        return html`<button
          type="button"
          class="btn btn-secondary"
          aria-disabled=${a.ok ? 'false' : 'true'}
          aria-describedby=${a.ok ? nothing : 'no-stroke'}
          @click=${() => a.ok && p.add(kind)}
        >
          ${effectName(kind)}
        </button>`;
      })}
    </div>
    ${stroke.ok ? nothing : html`<p class="hint" id="no-stroke">${t('image-animator.effects-panel.nothing-here-has-an-outline-to-draw')}</p>`}
    <div class="ia-row">
      <label for="preset">${t('image-animator.effects-panel.preset')}</label>
      <select id="preset" .value=${p.presetId} @change=${(e: Event) => p.setPreset((e.target as HTMLSelectElement).value)}>
        ${p.presets.map((x) => html`<option value=${x.id} ?selected=${x.id === p.presetId}>${x.name}</option>`)}
      </select>
      <button type="button" class="btn btn-secondary" ?disabled=${!p.presetId} @click=${() => p.add('preset')}>${t('image-animator.effects-panel.add-preset')}</button>
    </div>
    <div class="ia-row">
      <label for="path">${t('image-animator.effects-panel.path-data')}</label>
      <input id="path" type="text" inputmode="text" autocomplete="off" spellcheck="false" .value=${p.path} placeholder="M0 0 L50 20" @input=${(e: Event) => p.setPath((e.target as HTMLInputElement).value)} />
      <button type="button" class="btn btn-secondary" @click=${() => p.add('motion-path')}>${effectName('motion-path')}</button>
    </div>
    <p class="status" role="status">${p.message}</p>
  </section>`;
}
