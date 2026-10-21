import { html, TemplateResult, nothing } from 'lit';
import type { ModuleView } from '../../contracts/lazy-module';
import { CardModule, DesignConfig, HomeAssistant, SliderModuleConfig } from '../../types';
import { formatControlValue, numericControl, runServiceCall } from '../../utils/entity-control';
import { controlKey, pendingValue, setPendingValue } from '../../utils/pending-value';
import { renderTrack } from '../../utils/slider-track';
import { hasSliderLook } from '../../contracts/slider-look.needs';
import { lazyChunks } from '../../utils/lazy-chunks';
import { sliderLookSlot } from './slider-look-slot';
import { currentRenderContext } from '../../services/render-context';
import { entityPaint } from '../../utils/entity-color';
import { safeColor } from '../../utils/safe-css';
import { ENTITY_PAINT_KEYS, ENTITY_PAINT_RE } from '../../contracts/entity-colour';
import { entityDisplayName, formatEntityValue } from '../../utils/entity-value';
import { t } from '../../card/i18n';

/** The config with `entity` colour values replaced by their CSS (unset when they give none); the same object without any. */
function paintedColours(c: SliderModuleConfig, hass?: HomeAssistant): SliderModuleConfig {
  const bag = c as unknown as Record<string, unknown>;
  let out = bag;
  for (const k of ENTITY_PAINT_KEYS) {
    const v = bag[k];
    if (typeof v !== 'string' || !ENTITY_PAINT_RE.test(v.trim())) continue;
    if (out === bag) out = { ...bag };
    const css = entityPaint(v, c.entity ? hass?.states[c.entity] : undefined);
    if (css) out[k] = css;
    else delete out[k];
  }
  return out as unknown as SliderModuleConfig;
}

/**
 * Slider for an entity's numeric value. Per domain (see numericControl): input_number / number
 * value, light brightness or colour temperature (kelvin), fan speed, cover position or tilt, valve
 * position, media player volume, climate / water heater target temperature, humidifier humidity.
 * Other entities (sensors) are shown read-only. The service call goes out after release.
 */
export class SliderView implements ModuleView {
  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    // colours of the entity (contract entity-colour 1.0.0) are resolved here, so both renderings get plain CSS
    const c = paintedColours(config as SliderModuleConfig, hass);
    // the look decision reads the config as written: a look key whose entity colour resolves to nothing (light off) stays a look key
    if (hasSliderLook(config as SliderModuleConfig)) {
      // a slider with a look: the slider-look chunk draws it; until it is there (or when it failed) today's markup
      const view = sliderLookSlot.get();
      if (view) return view.renderPreview(c, hass);
      const chunk = lazyChunks['slider-look'];
      if (!chunk.ready() && !chunk.failed()) {
        void chunk.load();
        const update = currentRenderContext()?.requestUpdate;
        if (update) chunk.whenReady(update);
      }
    }
    const stateObj = c.entity && hass ? hass.states[c.entity] : undefined;
    const isVertical = c.direction === 'vertical';
    const design = (c.design || {}) as DesignConfig;
    // the module's own colours beat the design colours (like the icon colour of the icon module)
    // config colours go into a style= string: only values the colour allow-list accepts
    const sliderColor = safeColor(c.slider_color) || safeColor(design.color) || 'var(--primary-color, #03a9f4)';
    const trackColor = safeColor(c.track_color) || safeColor(design.background);
    const style = `--mc-slider-color: ${sliderColor}; ${trackColor ? `--mc-slider-background: ${trackColor};` : ''}`;
    const ctrl = stateObj ? numericControl(hass, stateObj, c.attribute, { min: c.min, max: c.max, step: c.step }) : undefined;

    const key = controlKey(c.entity, c.attribute, 'slider');
    const value = ctrl ? pendingValue(key, ctrl.value) ?? ctrl.value : undefined;
    const ctx = currentRenderContext();
    const valueText = ctrl && value !== undefined
      ? formatControlValue(hass, ctrl, value)
      : stateObj
        ? formatEntityValue(hass, stateObj).text
        : '';
    const name = stateObj ? entityDisplayName(hass, stateObj) : t('Slider');

    const track = renderTrack({
      value,
      min: ctrl?.min ?? c.min ?? 0,
      max: ctrl?.max ?? c.max ?? 100,
      step: ctrl?.step ?? c.step ?? 1,
      vertical: isVertical,
      disabled: !ctrl || ctrl.readOnly || !hass,
      label: name,
      valueText,
      style,
      onCommit: (v) => {
        if (!ctrl?.call || !hass) return;
        const call = ctrl.call;
        setPendingValue(key, v, ctrl.value, (sent) => runServiceCall(hass, call(sent)), () => ctx?.requestUpdate(), 300);
      },
    });

    return html`
      <div
        class="mc-module mc-slider mc-slider-container ${isVertical ? 'mc-slider-container--vertical' : 'mc-slider-container--horizontal'}"
      >
        ${track}
        ${c.show_value !== false && stateObj
          ? html`<span class="mc-slider-value">${valueText}</span>`
          : nothing}
      </div>
    `;
  }

}
