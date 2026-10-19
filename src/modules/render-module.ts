import { html, nothing, TemplateResult } from 'lit';
import { ModuleRegistry } from './module-registry';
import type { CardModule, HomeAssistant, ModuleType } from '../types';
import { currentRenderContext } from '../services/render-context';
import { inFlow, layerSlot } from '../layers/layer-slot';
import type { ArrangedChild, RenderChildren, ResolvedLayer } from '../contracts/layer-placement';
import { t } from '../card/i18n';

/** Small inline error state shown in place of one module; the rest of the card keeps rendering. */
export function renderModuleError(messages: string[]): TemplateResult {
  const text = messages.join('. ');
  return html`<div class="mc-module mc-module-error" role="alert" title=${text}>
    <ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${text}</span>
  </div>`;
}

/** What an unfinished module still needs, shown in its place while editing (not an error). */
export function renderModuleHint(messages: string[]): TemplateResult {
  const text = messages.join('. ');
  return html`<div class="mc-module mc-module-hint" title=${text}>
    <ha-icon icon="mdi:information-outline"></ha-icon><span>${text}</span>
  </div>`;
}

/**
 * A module's content: its own validation errors, or an error from rendering it, stay inside the
 * module (top-level modules and nested layout children alike).
 */
export function renderModuleContent(config: CardModule, hass?: HomeAssistant): TemplateResult {
  const module = ModuleRegistry.get(config?.type as ModuleType);
  if (!module) return renderModuleError([t('Unknown module: {type}', { type: String(config?.type) })]);
  try {
    const errors = module.validate(config);
    if (errors.length) return renderModuleError(errors);
    const ctx = currentRenderContext();
    if (!ctx || ctx.editMode) {
      const hints = module.hints?.(config) ?? [];
      if (hints.length) return renderModuleHint(hints);
    }
    return module.renderPreview(config, hass);
  } catch (err) {
    console.warn(`Magic Card: ${config.type} module failed to render`, err);
    return renderModuleError([err instanceof Error ? err.message : String(err)]);
  }
}

/**
 * A layout module's child: inside a card render it goes through the card's module pipeline (the
 * same wrapper as a top-level module: design, actions, display conditions, editor path); outside
 * one (editor thumbnails, tests) only its content is rendered.
 */
export function renderChildModule(
  child: CardModule,
  hass: HomeAssistant | undefined,
  index: number,
  slot = 0,
  layer?: ResolvedLayer,
): TemplateResult {
  const ctx = currentRenderContext();
  return ctx?.renderChild ? ctx.renderChild(child, index, slot, layer) : renderModuleContent(child, hass);
}

/**
 * A layout's children in the order layer-placement 1.0.0 asks for (overlays before and after the
 * modules in flow, backgrounds last; the config index stays the editor path), and whether the layout
 * needs `data-mc-layers`. Layout modules put `layered` on their container.
 */
export function layoutChildren(children: readonly CardModule[], hass: HomeAssistant | undefined, slot = 0): { layered: boolean; content: TemplateResult } {
  const ctx = currentRenderContext();
  const rt = layerSlot.get();
  // slot empty (chunk loading or failed): config order, the card marks the layered wrappers pending
  const a = rt
    ? rt.arrange(children, {
        hidden: (c) => !!ctx?.childHidden?.(c),
        hasActions: (c) => !!ctx?.childHasActions?.(c),
        canHoist: false,
      })
    : inFlow(children);
  const one = ({ child, index, layer }: ArrangedChild) => renderChildModule(child, hass, index, slot, layer);
  return { layered: a.layered, content: html`${a.front.map(one)}${a.backgrounds.map(one)}` };
}

/** The layer-placement contract's name for layoutChildren(): just the markup. */
export const renderChildren: RenderChildren = (children, hass, slot) => layoutChildren(children, hass as HomeAssistant | undefined, slot).content;

/**
 * A layout's children that render something, with their index in the config (the editor path keeps
 * that index): a child hidden by its display conditions is left out, so a slider builds no empty slide.
 */
export function visibleChildren(children: CardModule[]): Array<{ child: CardModule; index: number }> {
  const ctx = currentRenderContext();
  return children
    .map((child, index) => ({ child, index }))
    .filter(({ child }) => !ctx?.childHidden?.(child));
}

/** Placeholder of an empty layout slot: only shown while editing (studio canvas, editor previews). */
export function renderEmptySlot(text: string): TemplateResult | typeof nothing {
  const ctx = currentRenderContext();
  if (ctx && !ctx.editMode) return nothing;
  return html`<span class="mc-placeholder-text">${text}</span>`;
}
