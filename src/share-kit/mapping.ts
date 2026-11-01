import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { ENTITY_ID_RE, PLACEHOLDER_ID_RE } from '../contracts/share-kit';
import type { EntityPlaceholder } from '../contracts/share-kit';
import { demoStates, demoText } from './demo-states';
import { t } from './i18n';

// The mapping step of an import: finds the placeholders an item still holds and swaps chosen entity ids in for them.

const MAX_DEPTH = 100;
/** A whole placeholder id: not inside a longer name, not followed by more id characters. */
const PLACEHOLDER_RE = /(?<![a-z0-9_/-])[a-z][a-z0-9_]{0,63}\.mc_placeholder_[1-9][0-9]{0,5}(?![a-z0-9_])/g;

/** Placeholder ids in `value`, in first-occurrence order, each once. */
export function findPlaceholders(value: unknown): EntityPlaceholder[] {
  const seen = new Set<string>();
  const visit = (v: unknown, depth: number): void => {
    if (depth > MAX_DEPTH) throw new Error('share-kit: item is nested too deeply to map');
    if (typeof v === 'string') for (const m of v.matchAll(PLACEHOLDER_RE)) seen.add(m[0]);
    else if (Array.isArray(v)) v.forEach((e) => visit(e, depth + 1));
    else if (v && typeof v === 'object') Object.values(v).forEach((e) => visit(e, depth + 1));
  };
  visit(value, 0);
  return [...seen].map((id) => ({ id, domain: PLACEHOLDER_ID_RE.exec(id)![1] }));
}

/** A copy of `value` with each placeholder replaced by its mapped entity id; anything that is not an entity id is ignored. */
export function applyMapping<T>(value: T, map: Readonly<Record<string, string>>): T {
  const swap = (s: string): string => s.replace(PLACEHOLDER_RE, (id) => (Object.prototype.hasOwnProperty.call(map, id) && mappableTo(map[id], PLACEHOLDER_ID_RE.exec(id)![1]) ? map[id] : id));
  const copy = (v: unknown, depth: number): unknown => {
    if (depth > MAX_DEPTH) throw new Error('share-kit: item is nested too deeply to map');
    if (typeof v === 'string') return swap(v);
    if (Array.isArray(v)) return v.map((e) => copy(e, depth + 1));
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, e]) => [k, copy(e, depth + 1)]));
    return v;
  };
  return copy(value, 0) as T;
}

/** True when `value` is an entity id of `domain`. */
const mappableTo = (value: string, domain: string): boolean => ENTITY_ID_RE.test(value) && value.startsWith(`${domain}.`);

/** True when `value` is empty (left unmapped) or an entity id of the placeholder's domain. */
export const isMappable = (value: string, domain: string): boolean => value === '' || mappableTo(value, domain);

/** The mapping step: one entity field per placeholder with its demo value, and Skip. Names render as text. */
export function mappingView(placeholders: readonly EntityPlaceholder[], values: Readonly<Record<string, string>>, onChange: (id: string, value: string) => void, onSkip: () => void, entities: readonly string[] = []): TemplateResult {
  const demo = demoStates(placeholders);
  const domains = [...new Set(placeholders.map((p) => p.domain))];
  return html`<div data-mapping>
    <strong>${t('share-kit.mapping.map-entities')}</strong>
    <p class="help">${t('share-kit.mapping.this-file-uses-placeholders-instead-of-the-sender-s')}</p>
    ${domains.map((d) => html`<datalist id=${`mc-ents-${d}`}>${entities.filter((e) => e.startsWith(`${d}.`)).slice(0, 200).map((e) => html`<option value=${e}></option>`)}</datalist>`)}
    <ul>
      ${placeholders.map((p) => {
        const v = values[p.id] ?? '';
        const bad = !isMappable(v, p.domain);
        return html`<li>
          <label
            ><span class="mono">${p.id}</span> <span class="help">${t('share-kit.mapping.the-preview-shows-value', { value: demoText(demo[p.id]) })}</span>
            <input type="text" data-map-id=${p.id} .value=${v} placeholder=${`${p.domain}.`} list=${`mc-ents-${p.domain}`} autocomplete="off" spellcheck="false" aria-invalid=${bad ? 'true' : 'false'} @input=${(e: Event) => onChange(p.id, (e.target as HTMLInputElement).value.trim())} />
          </label>
          ${bad ? html`<span class="help" role="alert">${t('share-kit.mapping.that-is-not-an-entity-id-use-the-form-example', { example: `${p.domain}.name` })}</span>` : nothing}
        </li>`;
      })}
    </ul>
    <button type="button" data-map-skip @click=${onSkip}>${t('share-kit.mapping.skip-mapping')}</button>
  </div>`;
}
