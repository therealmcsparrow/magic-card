import { css, html, nothing } from 'lit';
import type { RetryableLazyChunk } from '../contracts/lazy-module';
import { BUILD_VERSION, notifyChunks } from '../utils/lazy-chunk';
import { t } from './i18n';

/** The failure notice of a lazy chunk: an icon, a message and a 44 px button in the card's shadow root. */
export const noticeStyles = css`
  .mc-n {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    box-sizing: border-box;
    width: 100%;
    padding: 8px;
    background: var(--mc-bg, #fff);
    color: var(--mc-text, #212121);
    border: 1px solid var(--mc-border, currentColor);
    border-radius: var(--mc-radius, 8px);
  }
  .mc-n ha-icon {
    --mdc-icon-size: 18px;
    color: var(--error-color, #db4437);
  }
  .mc-n span {
    flex: 1 1 12em;
  }
  .mc-n button {
    min-height: 44px;
    padding: var(--mc-button-padding, 10px 16px);
    border: 1px solid var(--mc-text, currentColor);
    border-radius: var(--mc-button-radius, 8px);
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
  .mc-n button:focus {
    outline: 2px solid var(--mc-text, #212121);
    outline-offset: 2px;
  }
  .mc-u {
    display: grid;
    padding: 0;
  }
  .mc-u > * {
    grid-area: 1 / 1;
  }
  .mc-u button {
    min-height: 44px;
    width: 100%;
    padding: 18px 7em 10px 16px;
    text-align: start;
    border: 0;
    border-radius: var(--mc-radius, 8px);
  }
  .mc-u button:focus {
    outline: 2px solid var(--mc-text, #212121);
    outline-offset: -4px;
  }
  .mc-uv {
    align-self: start;
    justify-self: end;
    margin: 4px 8px;
    font-size: 0.75em;
    opacity: 1;
    user-select: text;
    -webkit-user-select: text;
    -webkit-touch-callout: default;
  }
  .mc-v {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
`;

/** Written out so the i18n extractor sees every id; the fallback names no part. */
const part = (name: string): string => {
  const anim = t('card.chunk-notice.the-animation');
  const slider = t('card.chunk-notice.the-slider');
  return (
    {
      anim,
      'anim-runtime': anim,
      particles: anim,
      'shape-custom': t('card.chunk-notice.the-custom-shape'),
      seasonal: t('card.chunk-notice.the-seasonal-effect'),
      layers: t('card.chunk-notice.the-background'),
      'flow-look': t('card.chunk-notice.the-flow-style'),
      'slider-look': slider,
      slider,
      markdown: t('card.chunk-notice.the-text-block'),
      'svg-icon': t('card.chunk-notice.the-icon'),
    }[name as 'slider'] ?? t('card.chunk-notice.part-of-this-card')
  );
};

const reload = (): void => location.reload();

const CACHE_HELP = 'https://github.com/therealmcsparrow/magic-card/blob/main/documentation/loading-and-size/README.md#clear-the-browser-cache';

/** True when the last tap on the update tile already reloaded into this same version. */
const reloadedHere = (): boolean => {
  try {
    return sessionStorage.getItem('mc-reload') === BUILD_VERSION;
  } catch {
    return false;
  }
};

/** Remembers the tap, asks the server for the entry file past the cache (3 s at most), then reloads. */
async function update(): Promise<void> {
  try {
    sessionStorage.setItem('mc-reload', BUILD_VERSION);
  } catch {
    /* storage denied: the first wording shows again */
  }
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 3000);
    await fetch(import.meta.url, { cache: 'reload', signal: ctl.signal }).finally(() => clearTimeout(timer));
  } catch {
    /* offline or slow: reload anyway */
  }
  reload();
}

/** What one chunk's notice shows right now: shown (past its empty first frame), busy, asked twice, the "loaded" text. */
interface Seen {
  shown?: boolean;
  busy?: boolean;
  again?: boolean;
  done?: string;
}
const seen = new WeakMap<RetryableLazyChunk, Seen>();

/** The chunk has shown (or is about to show) a notice: its status container stays for the "loaded" text. */
export const hasNotice = (c: RetryableLazyChunk): boolean => seen.has(c);

/** When a Try again button was last pressed (Date.now()): a pop-up asked for before it may still open. */
export let retried = 0;

/** One extra attempt. Focus on the button moves to the status container, because the button goes when the chunk loads. */
async function retry(c: RetryableLazyChunk, s: Seen, e: Event): Promise<void> {
  if (s.busy) return;
  const box = (e.currentTarget as Element).closest<HTMLElement>('[role=status]')!;
  const held = box.contains((box.getRootNode() as ShadowRoot).activeElement);
  s.busy = true;
  retried = Date.now();
  notifyChunks();
  const ok = await c.retry();
  s.busy = false;
  s.again = !ok;
  if (ok && held) {
    box.tabIndex = -1;
    box.focus();
    box.addEventListener('blur', () => box.removeAttribute('tabindex'), { once: true });
  }
  notifyChunks();
}

/** The notice of a chunk: render it wherever the chunk's failure belongs; it re-renders on every chunk change. */
export function chunkNotice(c: RetryableLazyChunk) {
  let s = seen.get(c);
  if (!s) seen.set(c, (s = {}));
  const mismatch = c.failure() === 'mismatch';
  const id = 'mc-m-' + c.name;
  if (s.shown && !c.failed()) {
    s.shown = s.busy = s.again = false;
    s.done = t('card.chunk-notice.part-loaded', { part: part(c.name) });
    setTimeout(() => ((s.done = ''), notifyChunks()), 1500);
  } else if (c.failed() && !s.shown) {
    requestAnimationFrame(() => ((s.shown = c.failed()), notifyChunks()));
  }
  const tile = mismatch && s.shown && c.failed();
  if (tile) {
    const again = reloadedHere();
    return html`<div role="status" aria-live="polite" aria-busy="false"
      ><div class="mc-n mc-u">
        ${again
          ? html`<p id=${id}>
              ${t('card.chunk-notice.still-the-old-version-clear-the-browser-cache-then-reload')}
              <a href=${CACHE_HELP} target="_blank" rel="noopener">${t('card.chunk-notice.how-to-clear-the-cache')}</a>
            </p>`
          : html`<button type="button" @click=${update}>${t('card.chunk-notice.magic-card-updated-tap-to-reload')}</button>`}
        <span class="mc-uv">${BUILD_VERSION}</span>
      </div></div
    >`;
  }
  return html`<div role="status" aria-live="polite" aria-busy=${s.busy ? 'true' : 'false'}>${s.shown && c.failed()
      ? html`<div class="mc-n">
          <ha-icon icon="mdi:alert-circle-outline" aria-hidden="true"></ha-icon>
          <span id=${id}
            >${s.again
              ? t('card.chunk-notice.still-not-loading-try-again-in-a-moment')
              : t('card.chunk-notice.part-did-not-load-the-rest-of-this-card', { part: part(c.name) })}</span
          >
          <button type="button" aria-describedby=${id} aria-disabled=${s.busy ? 'true' : nothing} @click=${(e: Event) => retry(c, s, e)}>
            ${t('card.chunk-notice.try-again')}
          </button>
          ${s.again ? html`<button type="button" aria-describedby=${id} @click=${reload}>${t('card.chunk-notice.reload-page')}</button>` : nothing}
        </div>`
      : s.done
        ? html`<span class="mc-v">${s.done}</span>`
        : nothing}</div>`;
}
