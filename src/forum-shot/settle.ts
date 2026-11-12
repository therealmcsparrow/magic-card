// Settled card for the forum shot: mounts a Magic Card paused and offscreen on a scrubbed hass copy, waits until it is still.
import { FORUM_SHOT_WIDTH } from '../contracts/forum-shot';
import type { ForumShotErrorCode, ForumShotNotice } from '../contracts/forum-shot';
import { aliasFontValue, aliasInText, loadGoogleFontsLib } from './font-address';
import { deepElements, findRemoteAssets, scrubHass, sweepRemote } from './remote';

const CARD_TAG = 'magic-card';
const IMAGE_WAIT_MS = 4000;

/** An Error carrying a forum-shot error code. */
export function forumShotError(code: ForumShotErrorCode): Error & { code: ForumShotErrorCode } {
  return Object.assign(new Error(code), { code });
}

export interface SettleOptions {
  /** Element the offscreen card is placed in (a themed wrapper); defaults to document.body. */
  container?: HTMLElement;
  /** Quiet time after the card and its pictures are ready, for template results (default 300). */
  settleMs?: number;
  /** CSS width of the card (default FORUM_SHOT_WIDTH). */
  width?: number;
  /** Real (lower-case) Google families a face was prepared for (none when omitted); a template result naming another stops the run with `font_unavailable`. */
  preparedFamilies?: ReadonlySet<string>;
}

export interface SettledCard {
  card: HTMLElement;
  notices: ForumShotNotice[];
  /** Removes the card and its offscreen box. */
  dispose: () => void;
}

interface PausableCard extends HTMLElement {
  previewPaused: boolean;
  hass?: unknown;
  setConfig(config: unknown): void;
  updateComplete?: Promise<unknown>;
}

const frame = () => new Promise<void>((res) => requestAnimationFrame(() => res()));
const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

/** Resolves when every picture under `root` has loaded or failed, or after IMAGE_WAIT_MS; its listeners are removed either way. */
async function picturesReady(root: ParentNode): Promise<void> {
  const pending = deepElements(root).filter((el): el is HTMLImageElement => el.localName === 'img' && !(el as HTMLImageElement).complete);
  if (!pending.length) return;
  const cleanups: (() => void)[] = [];
  const loads = pending.map(
    (img) =>
      new Promise<void>((res) => {
        const done = () => res();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
        cleanups.push(() => {
          img.removeEventListener('load', done);
          img.removeEventListener('error', done);
        });
      }),
  );
  await Promise.race([Promise.all(loads), wait(IMAGE_WAIT_MS)]);
  for (const off of cleanups) off();
}

/** Ends every finite animation inside `root` (a line draw, a cross-fade) at its end state, so the picture never shows an icon part-drawn; looping ones stay as they are. */
function finishOneShots(root: ParentNode): void {
  const all = (document as { getAnimations?: () => Animation[] }).getAnimations?.() ?? [];
  if (!all.length) return;
  const inside = new Set<Element>(deepElements(root));
  for (const anim of all) {
    const target = (anim.effect as { target?: Element | null } | null)?.target;
    const end = anim.effect?.getComputedTiming().endTime;
    if (!target || !inside.has(target) || typeof end !== 'number' || !Number.isFinite(end)) continue;
    try {
      anim.finish();
    } catch {
      // an animation that cannot finish stays as it is
    }
  }
}

/**
 * Mounts the card with previewPaused set before its first render, hands it a hass copy without off-origin URLs, and waits for
 * fonts, pictures and one quiet period. A config naming a remote asset throws `remote_asset` before anything mounts.
 */
export async function settleCard(hass: object, config: Record<string, unknown>, options: SettleOptions = {}): Promise<SettledCard> {
  const origin = location.origin;
  await loadGoogleFontsLib();
  if (findRemoteAssets(config, origin).length) throw forumShotError('remote_asset');
  const Ctor = customElements.get(CARD_TAG);
  if (!Ctor) throw forumShotError('card_not_defined');

  let fontMissing = false;
  const prepared = options.preparedFamilies ?? new Set<string>();
  const scrubbed = scrubHass(
    hass,
    origin,
    (text) => aliasInText(text, prepared, () => (fontMissing = true)),
    (value) => aliasFontValue(value, prepared, () => (fontMissing = true)),
  );
  const box = document.createElement('div');
  box.setAttribute('aria-hidden', 'true');
  box.setAttribute('inert', '');
  box.style.cssText = `position:fixed;left:-100000px;top:0;width:${options.width ?? FORUM_SHOT_WIDTH}px;pointer-events:none;`;
  const card = new (Ctor as new () => PausableCard)();
  const dispose = () => box.remove();
  try {
    card.previewPaused = true;
    card.setConfig(config);
    card.hass = scrubbed.hass;
    box.append(card);
    (options.container ?? document.body).append(box);
    await card.updateComplete;
    await frame();
    if (document.fonts?.ready) await document.fonts.ready;
    await picturesReady(card.shadowRoot ?? card);
    await wait(options.settleMs ?? 300);
    await frame();
    finishOneShots(card.shadowRoot ?? card);
    await frame();
    finishOneShots(card.shadowRoot ?? card);
    if (fontMissing) throw forumShotError('font_unavailable');
    const swept = sweepRemote(card.shadowRoot ?? card, origin);
    return { card, notices: scrubbed.removed() || swept ? ['remote_placeholder'] : [], dispose };
  } catch (e) {
    dispose();
    throw e;
  }
}
