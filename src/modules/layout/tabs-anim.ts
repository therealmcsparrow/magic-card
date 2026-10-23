import type * as AnimChunk from '../../anim-studio/anim-chunk';
import { currentRenderContext } from '../../services/render-context';
import type { AnimationConfig, HomeAssistant, IconFxConfig } from '../../types';
import { lazyChunks } from '../../utils/lazy-chunks';

/*
 * Animations and icon effects of the tabs. `tab_animations` lists are design animation entries; the animation
 * chunk's resolver turns them into the attributes the card already uses on a module (`data-mc-anim` plus inline
 * custom properties), so its rules, reduced motion and the card's pause button apply to a tab button as they do to
 * any module. Until the chunk has installed the tabs draw plain and render again when it has.
 */

type AnimModule = typeof AnimChunk;

/** `data-mc-anim` and `style` of one tab button. */
export interface TabAnimAttrs {
  targets?: string;
  style: string;
}

export interface TabAnims {
  /** A tab that is neither active nor disabled. */
  base?: TabAnimAttrs;
  active?: TabAnimAttrs;
  disabled?: TabAnimAttrs;
  /** Custom properties and `data-mc-tab` tokens for the `.mc-tabs` element (the hover list plays through CSS). */
  hover?: { vars: Record<string, string>; tokens: string[] };
  /** Some list animates the tab icon (the icon gets the class the animation rules look for). */
  icon: boolean;
  /** Some list animates the label (it is wrapped in `data-mc-part="name"`). */
  label: boolean;
}

const MAX_ENTRIES = 12;
const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** Motion entries only: custom documents, On tap and non-object entries are left out (particles, rings and scenes draw nothing here). */
function list(v: unknown): AnimationConfig[] {
  if (!Array.isArray(v)) return [];
  return v
    .slice(0, MAX_ENTRIES)
    .filter((e): e is AnimationConfig => isObject(e) && typeof e.preset === 'string' && !e.preset.trim().startsWith('custom:') && e.trigger !== 'tap');
}

/** The names the hover list may set on the bar; the entries' own `--mca-*` variables come along. */
const HOVER_VARS = ['m', 'i', 'n', 'om', 'oi', 'on'];

function hoverVars(style: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const decl of style.split(';')) {
    const at = decl.indexOf(':');
    if (at < 0) continue;
    const name = decl.slice(0, at).trim();
    const value = decl.slice(at + 1).trim();
    if (name.startsWith('--mc-anim-') && HOVER_VARS.includes(name.slice(10))) out[`--mc-th-anim-${name.slice(10)}`] = value;
    else if (/^--mca-[\w-]+$/.test(name)) out[name] = value;
  }
  return out;
}

/**
 * The tabs' animation attributes for a design (rules already applied). Undefined without any `tab_animations`, and
 * while the animation chunk is not ready (it is requested here, once the design needs it).
 */
export function tabAnims(design: Record<string, unknown> | undefined, hass: HomeAssistant | undefined, entity?: string): TabAnims | undefined {
  const own = (state: string): AnimationConfig[] => list((isObject(design?.[state]) ? (design![state] as Record<string, unknown>) : {}).tab_animations);
  const base = list(design?.tab_animations);
  const active = own('tab_active');
  const disabled = own('tab_disabled');
  const hover = own('hover');
  if (!base.length && !active.length && !disabled.length && !hover.length) return undefined;

  const mod = lazyChunks.anim.module() as AnimModule | undefined;
  if (!mod) {
    const ctx = currentRenderContext();
    void lazyChunks.anim.load();
    ctx?.metChunk?.('anim');
    if (ctx) lazyChunks.anim.whenReady(ctx.requestUpdate);
    return undefined;
  }
  const stateObj = entity ? hass?.states?.[entity] : undefined;
  const run = (entries: AnimationConfig[]): TabAnimAttrs | undefined => {
    if (!entries.length) return undefined;
    const r = mod.resolveAnimations({ animations: entries }, stateObj, { allowIcon: true, states: hass?.states });
    return r?.targets ? { targets: r.targets, style: r.style } : undefined;
  };
  const b = run(base);
  const out: TabAnims = {
    base: b,
    active: active.length ? run([...base, ...active]) : b,
    disabled: disabled.length ? run([...base, ...disabled]) : b,
    icon: false,
    label: false,
  };
  const h = hover.length ? mod.resolveAnimations({ animations: hover }, stateObj, { allowIcon: true, states: hass?.states }) : undefined;
  if (h?.targets) {
    const vars = hoverVars(h.style);
    const tokens = [
      ...(vars['--mc-th-anim-m'] ? ['h-anim'] : []),
      ...(vars['--mc-th-anim-i'] ? ['h-anim-i'] : []),
      ...(vars['--mc-th-anim-n'] ? ['h-anim-n'] : []),
    ];
    if (tokens.length) out.hover = { vars, tokens };
  }
  const targets = [out.base, out.active, out.disabled].map((a) => a?.targets ?? '').join(' ');
  out.icon = /\bicon\b/.test(targets) || !!out.hover?.vars['--mc-th-anim-i'];
  out.label = /\blabel\b/.test(targets) || !!out.hover?.vars['--mc-th-anim-n'];
  return out;
}

const FX_KEYS = ['device', 'draw', 'draw_duration'] as const;

/** The three icon-effect keys a tab may set, nothing else from the object. */
function tabFx(v: unknown): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  if (!isObject(v)) return out;
  for (const k of FX_KEYS) if (typeof v[k] === 'string' || typeof v[k] === 'number') out[k] = v[k] as string | number;
  return out;
}

const MAX_MEMO = 64;
const memo = new Map<string, IconFxConfig>();

/**
 * The icon effects of one tab: the module's `icon_fx`, then the design's `tab_icon_fx`, then the active tab's, then the
 * disabled tab's (disabled wins), merged shallowly. Equal inputs give the same object, so the icon does not see a
 * change on every render.
 */
export function tabIconFx(moduleFx: IconFxConfig | undefined, design: Record<string, unknown> | undefined, active: boolean, disabled: boolean): IconFxConfig | undefined {
  const state = (k: string): Record<string, string | number> => tabFx(isObject(design?.[k]) ? (design![k] as Record<string, unknown>).tab_icon_fx : undefined);
  const mine = { ...tabFx(design?.tab_icon_fx), ...(active ? state('tab_active') : {}), ...(disabled ? state('tab_disabled') : {}) };
  if (!Object.keys(mine).length) return moduleFx;
  const merged = { ...moduleFx, ...mine } as IconFxConfig;
  const key = JSON.stringify(merged);
  let hit = memo.get(key);
  if (!hit) {
    if (memo.size >= MAX_MEMO) memo.clear();
    memo.set(key, (hit = merged));
  }
  return hit;
}
