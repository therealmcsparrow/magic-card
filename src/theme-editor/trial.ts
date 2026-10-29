import { THEME_TRIAL_BAR_TAG, TRIAL_STYLE_ID } from '../contracts/theme-editor';
import type { ThemeDoc, ThemeMode } from '../contracts/theme-editor';
import { kindOf } from './catalogue';
import { hexToRgb, previewVars, validateValue } from './model';
import { HA_DARK_DEFAULTS } from './dark-defaults';
import { readHaDefaults } from './preview';
import { t } from './i18n';
import { browserMode, docFromHass, hassOf } from './util';
import './trial-bar';

/*
 * Try on dashboards: the draft's variables applied to Home Assistant in this browser tab
 * only, with a Revert bar that stays on screen after the editor panel is left.
 *
 * Mechanism: one <style id="mc-theme-trial"> in document.head holding a single `html {}` rule. The
 * declarations are written through the rule's CSSOM (setProperty with 'important'), never by building
 * CSS text, so a value like `red;}body{display:none` can only ever be one declaration or be refused.
 * Nothing is stored. The module is a singleton, so the trial outlives the editor element.
 *
 * The trial ends by Revert, Discard, a successful save (stopTrial 'saved'), the theme being changed in
 * the profile, 10 minutes without an edit, or a page reload. Known gaps (documented): views and cards
 * with their own `theme:`, and other tabs and devices.
 */

export const TRIAL_IDLE_MS = 10 * 60 * 1000;

export type TrialEnd = 'revert' | 'saved' | 'discard' | 'idle' | 'theme-changed';

export interface TrialState {
  name: string;
  /** The browser's HA mode when the trial started; the draft is resolved for it. */
  mode: ThemeMode;
  /** Where "Open editor" goes: the panel path and query the trial started from. */
  editorUrl: string;
  /** How many draft values were left out because they are not valid. */
  skipped: number;
}

/** What a screen reader hears when a trial ends, in the language. */
export const trialEndText = (reason: TrialEnd): string =>
  reason === 'saved'
    ? t('theme-editor.trial.saved-this-tab-now-uses-the-saved-theme')
    : reason === 'idle'
      ? t('theme-editor.trial.trial-ended-after-10-minutes')
      : reason === 'theme-changed'
        ? t('theme-editor.trial.trial-ended-because-the-theme-changed')
        : t('theme-editor.trial.reverted-this-tab-shows-your-own-theme');

type Listener = (state: TrialState | null, reason?: TrialEnd) => void;

let state: TrialState | null = null;
let styleEl: HTMLStyleElement | null = null;
let decl: CSSStyleDeclaration | null = null;
let barEl: HTMLElement | null = null;
let idleTimer: ReturnType<typeof setTimeout> | undefined;
let baselineDoc: ThemeDoc | undefined;
let lastDoc: ThemeDoc | undefined;
let lastHass: unknown;
let htmlObserver: MutationObserver | undefined;
let darkQuery: MediaQueryList | undefined;
let applied = new Map<string, string>();
const listeners = new Set<Listener>();

export const getTrial = (): TrialState | null => (state ? { ...state } : null);
export const isTrialActive = (): boolean => state !== null;

/** Calls `fn` on every start, update and end (end: state null plus the reason). Returns the unsubscribe. */
export function subscribeTrial(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const notify = (reason?: TrialEnd): void => {
  const snapshot = getTrial();
  for (const fn of [...listeners]) fn(snapshot, reason);
};

/**
 * The variables of the draft for a mode, plus how many were left out. Values typed in the editor are
 * validated; values that equal the imported or saved baseline pass unchanged, as HA applies them.
 */
function trialVars(doc: ThemeDoc, mode: ThemeMode, baseline?: ThemeDoc): { vars: Record<string, string>; skipped: number } {
  const vars: Record<string, string> = {};
  const known = baseline ? previewVars(baseline, mode) : undefined;
  let skipped = 0;
  for (const [k, v] of Object.entries(previewVars(doc, mode))) {
    // Without a baseline everything is validated; with one, values equal to it pass as HA applies them.
    const typed = (known === undefined || known[k] !== v) && validateValue(kindOf(k) ?? 'text', v) !== null;
    if (!k.startsWith('rgb-') && typed) {
      skipped++;
      continue;
    }
    vars[k] = v;
  }
  return { vars, skipped };
}

/** The keys (with derived rgb-*) the profile's active theme sets in this mode. HA's own inline defaults are not among them. */
function profileKeys(hass: unknown, mode: ThemeMode): string[] {
  const themes = hassOf(hass).themes;
  const name = themes?.theme;
  const raw = name && name !== 'default' ? themes?.themes?.[name] : undefined;
  return raw ? Object.keys(previewVars(docFromHass(raw), mode)) : [];
}

/**
 * The value a key goes back to. Dark mode: the dark table, and for `rgb-<base>` the triplet of the dark
 * default of `<base>` (HA derives it the same way). Then the stylesheet's light value, then `initial`.
 */
function resetValue(key: string, mode: ThemeMode, defaults: Record<string, string>): string {
  if (mode === 'dark') {
    const dark = HA_DARK_DEFAULTS[key] ?? (key.startsWith('rgb-') ? hexToRgb(HA_DARK_DEFAULTS[key.slice(4)] ?? '') : undefined);
    if (dark) return dark;
  }
  return defaults[key] || 'initial';
}

/**
 * The draft over a reset of every key the profile's active theme sets that the draft lacks. A reset goes
 * to HA's default for the mode (dark table in dark mode, the stylesheet's light value otherwise), and to
 * `initial` when HA has no default for the key.
 */
function withReset(vars: Record<string, string>, mode: ThemeMode): Record<string, string> {
  const defaults = readHaDefaults();
  const out: Record<string, string> = {};
  for (const key of profileKeys(lastHass, mode)) if (!(key in vars)) out[key] = resetValue(key, mode, defaults);
  return { ...out, ...vars };
}

function ensureStyle(): CSSStyleDeclaration | null {
  if (decl && styleEl?.isConnected) return decl;
  styleEl?.remove();
  styleEl = document.createElement('style');
  styleEl.id = TRIAL_STYLE_ID;
  styleEl.textContent = 'html {}';
  document.head.appendChild(styleEl);
  const rule = styleEl.sheet?.cssRules?.[0] as CSSStyleRule | undefined;
  decl = rule?.style ?? null;
  applied = new Map();
  return decl;
}

function writeVars(draftVars: Record<string, string>, mode: ThemeMode): void {
  const style = ensureStyle();
  if (!style) return;
  style.setProperty('color-scheme', mode, 'important');
  const vars = withReset(draftVars, mode);
  for (const key of [...applied.keys()]) {
    if (!(key in vars)) {
      style.removeProperty(`--${key}`);
      applied.delete(key);
    }
  }
  for (const [key, value] of Object.entries(vars)) {
    if (applied.get(key) === value) continue;
    style.setProperty(`--${key}`, value, 'important');
    applied.set(key, value);
  }
}

function armIdle(): void {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => stopTrial('idle'), TRIAL_IDLE_MS);
}

/** A hidden live region so the end of a trial is spoken even though the bar is gone. */
function announce(text: string): void {
  const region = document.createElement('div');
  region.setAttribute('role', 'status');
  region.setAttribute('aria-live', 'polite');
  region.style.cssText = 'position:fixed;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap';
  document.body.appendChild(region);
  setTimeout(() => {
    region.textContent = text;
  }, 50);
  setTimeout(() => region.remove(), 6000);
}

const onSetTheme = (): void => stopTrial('theme-changed');

/**
 * Follows HA's mode while a trial runs, whether or not the editor is mounted (on a dashboard the editor
 * panel is gone and gets no hass). Triggers: HA rewriting the inline theme on <html> (also when the mode
 * stays), and the OS colour scheme. The mode is read from <home-assistant>.hass. The trial writes to its own
 * <style>, never to html.style, so this does not trigger itself.
 */
function followPage(): void {
  if (!state || !lastDoc) return;
  const hass = (document.querySelector('home-assistant') as { hass?: unknown } | null)?.hass;
  if (hass === undefined) return;
  lastHass = hass;
  const mode = browserMode(hass);
  const { vars, skipped } = trialVars(lastDoc, mode, baselineDoc);
  const modeChanged = mode !== state.mode;
  state = { ...state, mode, skipped };
  writeVars(vars, mode);
  if (modeChanged) notify();
}

function watchPage(): void {
  htmlObserver = new MutationObserver(followPage);
  htmlObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
  if (typeof matchMedia === 'function') {
    darkQuery = matchMedia('(prefers-color-scheme: dark)');
    darkQuery.addEventListener?.('change', followPage);
  }
}

function unwatchPage(): void {
  htmlObserver?.disconnect();
  htmlObserver = undefined;
  darkQuery?.removeEventListener?.('change', followPage);
  darkQuery = undefined;
}

/**
 * Starts a trial with the draft (or updates one that is running, keeping its name). The draft is
 * resolved for the browser's current mode, not the editor's preview mode.
 */
export function startTrial(opts: { name: string; doc: ThemeDoc; hass?: unknown; baseline?: ThemeDoc }): TrialState {
  const mode = opts.hass === undefined ? (state?.mode ?? 'light') : browserMode(opts.hass);
  const { vars, skipped } = trialVars(opts.doc, mode, opts.baseline);
  const fresh = state === null;
  if (opts.hass !== undefined) lastHass = opts.hass;
  lastDoc = opts.doc;
  state = {
    name: opts.name,
    mode,
    editorUrl: state?.editorUrl ?? `${location.pathname}${location.search}`,
    skipped,
  };
  baselineDoc = opts.baseline;
  writeVars(vars, mode);
  armIdle();
  if (fresh) {
    document.addEventListener('settheme', onSetTheme, true);
    watchPage();
    barEl = document.createElement(THEME_TRIAL_BAR_TAG);
    document.body.prepend(barEl);
  }
  notify();
  return { ...state };
}

/** Pushes an edited draft to the dashboard. No-op when no trial runs. Counts as an edit for the idle timer. */
export function updateTrial(doc: ThemeDoc): void {
  if (!state) return;
  lastDoc = doc;
  const { vars, skipped } = trialVars(doc, state.mode, baselineDoc);
  state = { ...state, skipped };
  writeVars(vars, state.mode);
  armIdle();
  notify();
}

/** Follows a change of the browser's mode (hass.themes.darkMode) without counting as an edit. */
export function syncTrialMode(doc: ThemeDoc, hass: unknown): void {
  if (!state) return;
  lastDoc = doc;
  lastHass = hass;
  const mode = browserMode(hass);
  if (mode === state.mode) return;
  const { vars, skipped } = trialVars(doc, mode, baselineDoc);
  state = { ...state, mode, skipped };
  writeVars(vars, mode);
  notify();
}

/** Ends the trial: removes the style and the bar, tells listeners why, and announces it. */
export function stopTrial(reason: TrialEnd = 'revert'): void {
  if (!state) return;
  state = null;
  clearTimeout(idleTimer);
  document.removeEventListener('settheme', onSetTheme, true);
  unwatchPage();
  styleEl?.remove();
  styleEl = null;
  decl = null;
  applied = new Map();
  baselineDoc = undefined;
  lastDoc = undefined;
  lastHass = undefined;
  barEl?.remove();
  barEl = null;
  announce(trialEndText(reason));
  notify(reason);
}

/** Opens the editor again (the panel path the trial started from) without a page load. */
export function openEditor(): void {
  const url = state?.editorUrl;
  if (!url) return;
  history.pushState(null, '', url);
  window.dispatchEvent(new CustomEvent('location-changed'));
}

/**
 * "Use this theme": selects a saved theme for the signed-in user in this browser, the way the
 * profile page does (HA's `settheme` event on <home-assistant>, which also stores the choice in
 * the user's profile). Never the global frontend.set_theme. Ends a running trial first. Returns false
 * when Home Assistant's root element is not on the page, so the caller can say "pick it in your profile".
 */
export function useTheme(name: string): boolean {
  const root = document.querySelector('home-assistant');
  if (!root) return false;
  stopTrial('saved');
  root.dispatchEvent(
    new CustomEvent('settheme', { detail: { theme: name, primaryColor: undefined, accentColor: undefined }, bubbles: true, composed: true }),
  );
  return true;
}
