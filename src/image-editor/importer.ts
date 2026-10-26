import { html, nothing, type TemplateResult } from 'lit';
import { MAX_IMAGE_IMPORT_BYTES } from '../contracts/image-editor';
import { button } from '../ui-kit/templates';
import { t } from './i18n';
import type { Doc } from '../svg-editor/model';
import type { ImageExt } from './chunk';

/* Importing an .svg file: what the sanitiser took out, and the window that says so. */

export interface Imported {
  /** The file name, when the file came from a picker. */
  name?: string;
  /** What was removed (kinds, not counts: the sanitiser lists each part once). */
  kinds: string[];
  /** Parts the editor cannot edit are kept as locked layers. */
  kept: boolean;
  /** A file that gave nothing to draw: the reason, with no Continue. */
  error?: string;
}

/** Plain words for the parts the sanitiser listed (`element` or `element@attribute`). */
export function removedKinds(stripped: readonly string[]): string[] {
  const kinds = new Set<string>();
  for (const s of stripped) {
    const [el, at = ''] = s.split('@');
    kinds.add(el === 'script' ? t('scripts') : /^on/i.test(at) ? t('event handlers') : /href$/i.test(at) ? t('links to another site') : el === 'image' ? t('embedded pictures') : t('other parts an image cannot use'));
  }
  return [...kinds];
}

export function summary(name: string | undefined, stripped: readonly string[], doc: Doc): Imported {
  return { name, kinds: removedKinds(stripped), kept: doc.shapes.some((s) => s.look?.part) };
}

/** Checks the file before reading it; returns the reason it is refused. */
export function refuse(f: { name: string; type: string; size: number }): string | undefined {
  if (!/\.svg$/i.test(f.name) && f.type !== 'image/svg+xml') return t('Choose an SVG file.');
  return f.size > MAX_IMAGE_IMPORT_BYTES ? t('That file is too big to open (over 8 MB). Try a smaller copy.') : undefined;
}

export async function importFile(x: ImageExt, file: File): Promise<void> {
  const why = refuse(file);
  if (why) x.imp = { name: file.name, kinds: [], kept: false, error: why };
  else x.importSvg(await file.text(), file.name);
  x.shell.requestUpdate();
}

/** The question before a file takes the place of a drawing that has content. */
export function replaceWin(x: ImageExt): TemplateResult {
  return html`<mc-ui-window variant="alert" size="m" heading=${t('Replace your drawing?')} closeLabel=${t('Close')} @mc-window-close=${() => x.cancelReplace()}>
    <div class="dlg"><p>${t("Importing '{name}' replaces everything on the canvas. You can undo it.", { name: x.replacing!.name })}</p></div>
    <div slot="footer" class="foot">
      ${button({ label: t('Keep my drawing'), variant: 'text', size: 'md', onClick: () => x.cancelReplace() })}${button({ label: t('Replace'), variant: 'danger', size: 'md', onClick: () => x.confirmReplace() })}
    </div>
  </mc-ui-window>`;
}

export function importWin(x: ImageExt): TemplateResult {
  const i = x.imp!;
  const done = (): void => x.closeImport();
  const more = (): void => x.shell.renderRoot.querySelector<HTMLInputElement>('#img-import')?.click();
  return html`<mc-ui-window variant=${i.error ? 'alert' : 'dialog'} size="m" heading=${i.name ? t("Imported '{name}'", { name: i.name }) : t('Imported file')} closeLabel=${t('Close')} @mc-window-close=${done}>
    <div class="dlg">
      ${i.error ? html`<p role="alert">${i.error}</p>` : html`<p>${i.kinds.length ? t('Removed {list}.', { list: i.kinds.join(', ') }) : t('Nothing was removed.')}</p>`}
      ${i.kept ? html`<p class="help">${t('Some parts cannot be edited, such as clipped ones. They are kept as locked layers.')}</p>` : nothing}
    </div>
    <div slot="footer" class="foot">
      ${i.error ? html`${button({ label: t('Close'), variant: 'text', size: 'md', onClick: done })}${button({ label: t('Choose another file'), variant: 'primary', size: 'md', onClick: more })}` : button({ label: t('Continue'), variant: 'primary', size: 'md', onClick: done })}
    </div>
  </mc-ui-window>`;
}
