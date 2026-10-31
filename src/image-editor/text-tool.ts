import { html, nothing, type TemplateResult } from 'lit';
import type { Pt } from '../contracts/path-model';
import { IMAGE_MAX_TEXT_CHARS } from '../contracts/svg-image';
import { button } from '../ui-kit/templates';
import type { ImageExt } from './chunk';
import { t } from './i18n';
import { cleanText } from './text';
import { middle, newText } from './text-ui';

// The Text tool: a click, tap or Enter on the canvas opens a text field; Enter or Done adds one text layer, Escape or Cancel adds nothing.

const COUNT_FROM = 1900;

/** The words being typed and the drawing point they start at. */
export interface TextField {
  at: Pt;
  s: string;
}

const fieldEl = (x: ImageExt): HTMLTextAreaElement | null => x.shell.renderRoot.querySelector<HTMLTextAreaElement>('#tx-field');
const toView = (x: ImageExt): void => void fieldEl(x)?.scrollIntoView?.({ block: 'nearest' });

function release(x: ImageExt): void {
  if (x.viewport) window.visualViewport?.removeEventListener('resize', x.viewport);
  x.viewport = undefined;
  x.field = undefined;
}

/** Open the field at `p`, or where it already is, or in the middle of the view; words already typed stay. */
export function place(x: ImageExt, p?: Pt): void {
  if (x.readOnly) return;
  const sh = x.shell;
  const cur = x.field;
  x.field = { at: p ?? cur?.at ?? middle(x), s: cur?.s ?? '' };
  if (!x.viewport) {
    x.viewport = () => toView(x);
    window.visualViewport?.addEventListener('resize', x.viewport);
  }
  sh.requestUpdate();
  void sh.updateComplete.then(() => {
    fieldEl(x)?.focus();
    toView(x);
  });
}

export function cancelField(x: ImageExt): void {
  if (!x.field) return;
  release(x);
  x.shell.say(t('image-editor.text-tool.text-cancelled'));
  x.shell.requestUpdate();
  x.shell.canvas()?.focus({ preventScroll: true });
}

/** Add the words as a layer; empty words add nothing. */
export function commitField(x: ImageExt): void {
  const f = x.field;
  if (!f) return;
  const words = cleanText(f.s);
  release(x);
  const sh = x.shell;
  if (!words.trim()) {
    sh.say(t('image-editor.text-tool.no-text-was-added'));
    sh.requestUpdate();
  } else sh.addShape(newText(x, f.at, words));
  sh.canvas()?.focus({ preventScroll: true });
}

export function disposeField(x: ImageExt): void {
  release(x);
}

/** The field, over the canvas at the point it was placed (kept inside the stage), with Done and Cancel beside it. */
export function textField(x: ImageExt): TemplateResult | typeof nothing {
  const f = x.field;
  if (!f) return nothing;
  const v = x.shell.view;
  const left = v.x + f.at[0] * v.zoom;
  const top = v.y + f.at[1] * v.zoom;
  const remaining = IMAGE_MAX_TEXT_CHARS - f.s.length;
  const counting = remaining <= IMAGE_MAX_TEXT_CHARS - COUNT_FROM;
  return html`<div class="txf" style=${`left:clamp(8px,${left}px,calc(100% - 256px));top:clamp(8px,${top}px,calc(100% - 200px))`}>
    <textarea
      id="tx-field"
      class="input"
      rows="3"
      maxlength=${IMAGE_MAX_TEXT_CHARS}
      aria-label=${t('image-editor.text-tool.text-on-the-canvas')}
      aria-describedby=${`tx-field-help${counting ? ' tx-field-count' : ''}`}
      .value=${f.s}
      @input=${(e: Event) => {
        const el = e.target as HTMLTextAreaElement;
        const s = cleanText(el.value);
        if (s !== el.value) el.value = s;
        x.field = { ...f, s };
        x.shell.requestUpdate();
      }}
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          cancelField(x);
        } else if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
          e.preventDefault();
          e.stopPropagation();
          commitField(x);
        }
      }}
    ></textarea>
    <p id="tx-field-help" class="help">${t('image-editor.text-tool.enter-adds-the-text-shift-enter-starts-a')}</p>
    ${counting ? html`<p id="tx-field-count" class="help" role="status">${remaining > 0 ? t('image-editor.text-tool.n-left', { n: remaining }) : t('image-editor.text-tool.that-is-the-longest-text-2048-characters')}</p>` : nothing}
    <div class="actions">
      ${button({ label: t('image-editor.text-tool.done'), variant: 'primary', onClick: () => commitField(x) })}${button({ label: t('image-editor.text-tool.cancel'), variant: 'secondary', onClick: () => cancelField(x) })}
    </div>
  </div>`;
}
