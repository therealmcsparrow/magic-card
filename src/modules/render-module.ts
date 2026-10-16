import { html, nothing, TemplateResult } from 'lit';
import { ModuleRegistry } from './module-registry';
import type { CardModule, HomeAssistant, ModuleType } from '../types';
import { currentRenderContext } from '../services/render-context';

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
  if (!module) return renderModuleError([`Unknown module: ${String(config?.type)}`]);
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
): TemplateResult {
  const ctx = currentRenderContext();
  return ctx?.renderChild ? ctx.renderChild(child, index, slot) : renderModuleContent(child, hass);
}

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
