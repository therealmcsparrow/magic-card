import { html, nothing, TemplateResult } from 'lit';
import type { HomeAssistant, IconFxConfig } from '../types';
import { entityIcon, renderEntityIcon, stateIcon } from '../utils/entity-icon';
import { currentRenderContext } from '../services/render-context';
import './mc-svg-icon';

export interface RenderIconOpts {
  icon?: string;
  entity?: string;
  hass?: HomeAssistant;
  /** The entity's icon (as HA picks it) instead of `icon` (`icon` is the fallback). */
  useEntityIcon?: boolean;
  className?: string;
  fx?: IconFxConfig;
  iconOn?: string;
  iconOff?: string;
  svg?: string;
  /** The module's default icon, drawn while `icon` is `svg` without any SVG markup (default mdi:help). */
  fallbackIcon?: string;
  /** Icon colour on the <mc-svg-icon> host (effects only; without effects the module colours its wrapper). */
  color?: string;
  /** Effects only: a decorative icon (aria-hidden), or one announced as an image with this label. */
  ariaHidden?: boolean;
  ariaLabel?: string;
  /** Card-part marker of the icon element (`data-mc-part`, v2 animation targets): modules pass 'icon'. */
  part?: string;
  /**
   * v2 icon rig (the runtime's resolve-time hint): draws the icon with <mc-svg-icon> in rig mode.
   * Modules do not pass it: for the module's main icon (`part: 'icon'`) it comes from the card's
   * render context (RenderContext.iconRig, set per module by the card).
   */
  rig?: unknown;
}

/** True when `icon_fx` switches any effect on. */
export function hasIconFx(fx?: IconFxConfig): boolean {
  if (!fx || typeof fx !== 'object') return false;
  if (fx.fill && typeof fx.fill === 'object') return true;
  if (fx.device && fx.device !== 'off') return true;
  if (fx.draw && fx.draw !== 'off') return true;
  if (fx.morph === true) return true;
  return !!fx.colors && typeof fx.colors === 'object' && Object.keys(fx.colors).length > 0;
}

/**
 * A module's main icon. Without effects: exactly the markup modules rendered before the icon engine
 * (the entity's state icon or a plain <ha-icon>). With effects: <mc-svg-icon>.
 */
export function renderIcon(opts: RenderIconOpts): TemplateResult {
  // `icon: svg` without markup (the Custom SVG switch before a paste, or YAML): the module's
  // default icon, or the entity's icon when there is an entity, never a blank.
  const o: RenderIconOpts =
    opts.icon === 'svg' && !opts.svg
      ? { ...opts, icon: opts.fallbackIcon || 'mdi:help', useEntityIcon: opts.useEntityIcon || !!opts.entity }
      : opts;
  const className = o.className ?? '';
  // State icons (icon when on / off) win over the entity's own icon.
  const byState = stateIcon(o.hass, o.entity, o.iconOn, o.iconOff);
  const useEntity = !byState && !!o.useEntityIcon && !!o.entity;
  // Own SVG (`icon: svg` + `svg`): always drawn by <mc-svg-icon>, with or without effects.
  const icon = byState ?? (useEntity ? entityIcon(o.hass, o.entity) || o.icon : o.icon);
  // `mcu:` (saved library icons) always go to <mc-svg-icon> too, so HA's single-colour silhouette never shows.
  const own = (o.icon === 'svg' && !!o.svg) || !!icon?.startsWith('mcu:');
  const rig = o.rig ?? (o.part === 'icon' ? currentRenderContext()?.iconRig : undefined);
  if (!hasIconFx(o.fx) && !own && !rig) {
    const part = o.part ?? nothing;
    if (byState) return html`<ha-icon class=${className} data-mc-part=${part} .icon=${byState}></ha-icon>`;
    return useEntity
      ? renderEntityIcon(o.hass, o.entity, o.icon ?? '', className, o.part)
      : html`<ha-icon class=${className} data-mc-part=${part} .icon=${o.icon}></ha-icon>`;
  }
  // Inside HA, <ha-state-icon> knows the icon (translations, device class): mc-svg-icon reads it.
  const stateObj = useEntity && typeof customElements !== 'undefined' && customElements.get('ha-state-icon') ? o.hass?.states?.[o.entity!] : undefined;
  return html`<mc-svg-icon
    class=${className}
    data-mc-part=${o.part ?? nothing}
    style=${o.color ? `color: ${o.color}` : nothing}
    aria-hidden=${o.ariaHidden ? 'true' : nothing}
    aria-label=${o.ariaLabel || nothing}
    role=${o.ariaLabel ? 'img' : nothing}
    .decorative=${!!o.ariaHidden || !!o.ariaLabel}
    .hass=${o.hass}
    .icon=${icon}
    .entity=${o.entity}
    .fx=${o.fx}
    .iconOn=${o.iconOn}
    .iconOff=${o.iconOff}
    .svg=${o.svg}
    .fallback=${o.fallbackIcon}
    .kept=${currentRenderContext()?.customIcons}
    .stateObj=${stateObj}
    .rig=${rig}
  ></mc-svg-icon>`;
}
