import type { HomeAssistant } from '../types';
import { MAX_BINDING_RULES } from '../contracts/svg-image';
import type { BindingValue, ImageBinding } from '../contracts/mcu-library-images';

// The value a binding gives its target now: the first matching rule, else the default, else undefined.
export function bindingValue(b: ImageBinding, hass: HomeAssistant | undefined): BindingValue | undefined {
  const stateObj = hass?.states?.[b.entity];
  if (!stateObj) return b.default;
  const raw: unknown = b.attribute ? stateObj.attributes?.[b.attribute] : stateObj.state;
  if (raw === undefined || raw === null) return b.default;
  const text = String(raw);
  const num = typeof raw === 'number' ? raw : text.trim() === '' ? NaN : Number(text);
  const rules = b.rules.length > MAX_BINDING_RULES ? b.rules.slice(0, MAX_BINDING_RULES) : b.rules;
  for (const r of rules) {
    if (r.state !== undefined) {
      if (r.state === text) return r.value;
    } else if (r.above !== undefined || r.below !== undefined) {
      if (Number.isFinite(num) && (r.above === undefined || num > r.above) && (r.below === undefined || num < r.below)) return r.value;
    }
  }
  return b.default;
}
