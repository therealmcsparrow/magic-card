import type { SvgEditorModuleFacts, SvgEditorSource, SvgSaveDetail } from '../../contracts/svg-editor';
import { SVG_EDITOR_TAG } from '../../contracts/svg-editor';
import type { HomeAssistant, MagicCardConfig } from '../../types';
import { cardStateOf as cardState, type CardState } from './bridge';
import { getIcon, listIcons } from './library';
import { openLayer } from './layer';
import { loadSvgEditor } from './loaders';
import { getFullPath, hasTemplate, type SyncContext } from '../../utils/sync-path';
import { t } from '../i18n';

/*
 * The card editor's side of the SVG editor (svg-editor 1.0.0): "Draw an icon", "Customise this icon" and
 * "Edit icon" open <mc-svg-editor> in the top layer; its `mc-svg-save` is written into the module (`icon:
 * svg` + `svg`, or `icon: mcu:<id>` with an optional kept copy in `custom_icons`). The editor itself
 * saves to the library and handles Escape and focus; it does not close itself, so the layer goes here.
 */

/** The module keys the editor writes; undefined removes the key. */
export interface IconPatch {
  icon?: string;
  svg?: string;
}

export interface IconEditorOpen {
  /** Any element of the card editor: finds the card's state manager, and is where focus returns. */
  from: HTMLElement;
  hass?: HomeAssistant;
  /** The module (or tab) whose icon this is, as stored. */
  module: Record<string, unknown>;
  /** The card is linked to a template. */
  linked: boolean;
  source: SvgEditorSource;
  /** Writes the module's icon keys (a linked card marks them not_synced there). */
  apply(patch: IconPatch): void;
}

/**
 * The module with `patch` merged in (a key set to undefined is removed). Linked card (`syncCtx` with a
 * template): every written key is an override, a removed one too (the template merge keeps it removed),
 * the same as the reset of any other field.
 */
export function applyIconPatch(c: object, patch: object, syncCtx?: SyncContext): Record<string, unknown> {
  const next = { ...c, ...patch } as Record<string, unknown>;
  for (const k of Object.keys(patch)) if (next[k] === undefined) delete next[k];
  if (syncCtx && hasTemplate(syncCtx)) {
    const ns = new Set((c as { not_synced?: string[] }).not_synced ?? []);
    for (const k of Object.keys(patch)) ns.add(getFullPath(syncCtx, k));
    next.not_synced = [...ns];
  }
  return next;
}

const hasText = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';

/** What the editor tells the user about the module before Done (svg-editor.ts SvgEditorModuleFacts). */
export async function moduleFacts(sm: CardState | undefined, module: Record<string, unknown>, linked: boolean): Promise<SvgEditorModuleFacts> {
  const icon = hasText(module.icon) && module.icon !== 'svg' && !module.use_entity_icon ? module.icon : '';
  const facts: SvgEditorModuleFacts = {
    icon,
    hasStateIcons: hasText(module.icon_on) || hasText(module.icon_off),
    pickedAnimation: false,
    followsIcon: false,
    linked,
  };
  const design = module.design as { animations?: unknown } | undefined;
  if (sm && Array.isArray(design?.animations) && design!.animations.length) {
    try {
      const m = await import(/* webpackChunkName: "icon-animator" */ '../components/icon-animator/icon-animator-entry');
      Object.assign(facts, m.iconAnimationFacts(module, sm.getConfig(), sm.getState().templateAnimations));
    } catch {
      /* the notice just leaves the animation lines out */
    }
  }
  return facts;
}

/** Write a card-level change; `fold`: into the previous undo step. */
function writeCard(sm: CardState | undefined, patch: (c: MagicCardConfig) => MagicCardConfig, fold: boolean): void {
  if (!sm || sm.attached === false) return;
  sm.updateConfig(patch(sm.getConfig()), !fold);
}

/** `custom_icons[id] = svg` (or the key removed). */
export function withKeptIcon(c: MagicCardConfig, id: string, svg: string | undefined): MagicCardConfig {
  const copies = { ...(c.custom_icons ?? {}) };
  if (svg === undefined) delete copies[id];
  else copies[id] = svg;
  const out = { ...c };
  if (Object.keys(copies).length) out.custom_icons = copies;
  else delete out.custom_icons;
  return out;
}

/** Applies what Done returned: the module first, then the card's kept copy folded into that step. */
export function applySave(o: Pick<IconEditorOpen, 'apply'>, sm: CardState | undefined, d: SvgSaveDetail): void {
  if (d.target === 'library' && d.saved) {
    const id = d.saved.id;
    o.apply({ icon: `mcu:${id}`, svg: undefined });
    const had = !!sm?.getConfig().custom_icons?.[id];
    // a copy already in the card follows the item it copies; a new one only when asked for
    if (d.keepCopy || had) writeCard(sm, (c) => withKeptIcon(c, id, d.keepCopy ? d.svg : undefined), true);
  } else {
    o.apply({ icon: 'svg', svg: d.svg });
  }
}

const toast = (message: string): void =>
  void document.querySelector('home-assistant')?.dispatchEvent(new CustomEvent('hass-notification', { detail: { message } }));

/**
 * Open the SVG editor. Resolves 'opened', or 'failed' when the chunk did not load (nothing changed;
 * the caller shows the E1 message with a retry).
 */
export async function openIconEditor(o: IconEditorOpen): Promise<'opened' | 'failed'> {
  if (!(await loadSvgEditor())) return 'failed';
  const sm = cardState(o.from);
  const lib = await listIcons(o.hass);
  const el = document.createElement(SVG_EDITOR_TAG) as HTMLElement & {
    hass?: unknown;
    source: SvgEditorSource;
    libraryAvailable: boolean;
    savedId?: string;
    module?: SvgEditorModuleFacts;
  };
  const savedId = o.source.kind === 'library' ? o.source.id : undefined;
  el.hass = o.hass;
  el.source = o.source;
  el.libraryAvailable = lib.state === 'ok';
  if (savedId && lib.state === 'ok') el.savedId = savedId;
  el.module = await moduleFacts(sm, o.module, o.linked);
  // a kept copy is refreshed from the library when the user opens the icon (it may have changed)
  if (savedId && lib.state === 'ok' && sm?.getConfig().custom_icons?.[savedId] !== undefined) {
    void getIcon(o.hass, savedId).then((item) => {
      if (item && sm.getConfig().custom_icons?.[savedId] !== item.svg) writeCard(sm, (c) => withKeptIcon(c, savedId, item.svg), true);
    });
  }
  let close = (): void => undefined;
  el.addEventListener('mc-svg-save', (e) => {
    applySave(o, sm, (e as CustomEvent<SvgSaveDetail>).detail);
    close();
    toast(t('card-editor.icon-host.icon-applied'));
  });
  el.addEventListener('mc-svg-close', () => close());
  close = openLayer(el, { from: o.from, key: 'icon-entry' });
  return 'opened';
}

/** The source for an icon the module already has: its drawing, its saved icon, or none. */
export function sourceOfModule(module: Record<string, unknown>, config: MagicCardConfig | undefined, libraryOk: boolean): SvgEditorSource | undefined {
  const icon = module.icon;
  if (icon === 'svg' && hasText(module.svg)) return { kind: 'svg', svg: module.svg };
  if (typeof icon === 'string' && icon.startsWith('mcu:')) {
    const id = icon.slice(4);
    const kept = config?.custom_icons?.[id];
    if (libraryOk) return { kind: 'library', id };
    if (hasText(kept)) return { kind: 'svg', svg: kept };
  }
  return undefined;
}
