import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-stack';
import type { UiWindowElement } from '../../contracts/ui-kit';
import type { IconData, TransferItem, TransferKind } from '../../contracts/preset-transfer';
import type { HomeAssistant, MagicCardConfig } from '../../types';
import { withDocs } from './animation-copies';
import { cardStateOf, type CardState } from './bridge';
import { openLayer } from './layer';
import { loadTransfer } from '../transfer-loader';
import { librarySource } from './library';
import { t } from '../i18n';

// Opens <mc-library-view> in the top layer with the card's copies as "This card".

/** The card with imported items stored as its own copies (an item with an id replaces the copy with that id). */
export function withImported(c: MagicCardConfig, kind: TransferKind, items: TransferItem[]): MagicCardConfig {
  if (kind === 'shape') return { ...c, custom_shapes: { ...c.custom_shapes, ...Object.fromEntries(items.map((i) => [i.id, i.data])) } } as MagicCardConfig;
  if (kind === 'icon') return { ...c, custom_icons: { ...c.custom_icons, ...Object.fromEntries(items.map((i) => [i.id, (i.data as IconData).svg])) } };
  if (kind !== 'animation') return c;
  return withDocs(c, items.map((i) => ({ ...(i.data as object), id: i.id, name: i.name }) as Record<string, unknown>));
}

/** Phone width: the kit window is a bottom sheet, else the wide picker window. */
const compact = (): boolean => typeof matchMedia === 'function' && matchMedia('(max-width: 599px)').matches;

@customElement('mc-library-sheet')
export class LibrarySheet extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: contents;
      }
      mc-library-view {
        display: block;
      }
    `,
  ];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) kind: TransferKind = 'animation';
  @property({ attribute: false }) onClose?: () => void;
  /** The card editor's state manager (found from the opener: the sheet itself sits on <body>). */
  @property({ attribute: false }) sm?: CardState;
  @state() private _config?: MagicCardConfig;

  protected willUpdate(): void {
    this._config ??= this.sm?.getConfig();
  }

  protected firstUpdated(): void {
    this.renderRoot.querySelector<UiWindowElement>('mc-ui-window')?.show();
  }

  private _import = (e: CustomEvent<{ kind: TransferKind; items: TransferItem[] }>): void => {
    e.stopPropagation();
    const sm = this.sm;
    if (!sm || sm.attached === false) return;
    sm.updateConfig(withImported(sm.getConfig(), e.detail.kind, e.detail.items), true);
    this._config = sm.getConfig();
  };

  render() {
    return html`<mc-ui-window .variant=${compact() ? 'sheet' : 'picker'} heading=${t('card-editor.library-sheet.library')} closeLabel=${t('card-editor.library-sheet.close')} movable resizable maximizable moveLabel=${t('card-editor.library-sheet.move-window')} resizeLabel=${t('card-editor.library-sheet.resize-window')} maximizeLabel=${t('card-editor.library-sheet.maximise')} restoreLabel=${t('card-editor.library-sheet.restore-size')} @mc-window-close=${() => this.onClose?.()}>
      <mc-library-view .hass=${this.hass} .source=${librarySource} .config=${this._config} .inline=${true} .startKind=${this.kind} @mc-transfer-import=${this._import}></mc-library-view>
    </mc-ui-window>`;
  }
}

const toast = (message: string): void =>
  void document.querySelector('home-assistant')?.dispatchEvent(new CustomEvent('hass-notification', { detail: { message } }));

/** Open the library sheet from `opener` (focus returns to it on close). A chunk that cannot load gives a toast. */
export async function openLibrary(opener: HTMLElement, hass: HomeAssistant | undefined, kind: TransferKind): Promise<void> {
  try {
    await loadTransfer();
  } catch {
    toast(t('card-editor.library-sheet.the-library-could-not-load-check-your'));
    return;
  }
  const sheet = document.createElement('mc-library-sheet') as LibrarySheet;
  sheet.hass = hass;
  sheet.kind = kind;
  sheet.sm = cardStateOf(opener);
  const close = openLayer(sheet, undefined, () => sheet.onClose?.());
  sheet.parentElement?.setAttribute('aria-label', t('card-editor.library-sheet.library'));
  sheet.onClose = () => {
    close();
    opener.focus();
  };
}
