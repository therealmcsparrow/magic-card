import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { googleFontsAllowed, googleFontsChunk } from '../../utils/google-fonts';
import { t } from '../i18n';

/** Whether a font value names a Google family, answered once per value by the lazy catalogue chunk. */
const named = new Map<string, boolean>();

async function namesGoogleFont(value: string): Promise<boolean> {
  const known = named.get(value);
  if (known !== undefined) return known;
  let result: boolean;
  try {
    const m = await googleFontsChunk();
    result = (await m.resolveGoogleFonts(m.fontCandidates(value))).length > 0;
  } catch {
    result = false;
  }
  named.set(value, result);
  return result;
}

/** One plain line under a font field: the font is a Google font, but Google Fonts are not available. */
@customElement('mc-font-nudge')
export class FontNudge extends LitElement {
  @property() value = '';
  @state() private _shown = false;
  private _checked = '';

  static styles = css`
    :host { display: block; }
    .nudge { margin: 6px 0 0; font-size: 12px; line-height: 1.4; color: var(--secondary-text-color); }
  `;

  protected willUpdate(): void {
    if (this._checked === this.value) return;
    this._checked = this.value;
    this._shown = false;
    if (googleFontsAllowed() || !this.value) return;
    const asked = this.value;
    void namesGoogleFont(asked).then((yes) => {
      if (yes && asked === this.value) this._shown = true;
    });
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._shown || googleFontsAllowed()) return nothing;
    const utils = (window as unknown as { magicCardUtils?: unknown }).magicCardUtils !== undefined;
    return html`<p class="nudge" role="note">${utils ? t('card-editor.font-picker.nudge-utils-off') : t('card-editor.font-picker.nudge-utils-missing')}</p>`;
  }
}

/** The nudge for a font field's value; renders nothing while Google Fonts are allowed. */
export function renderFontNudge(value: string): TemplateResult | typeof nothing {
  return googleFontsAllowed() ? nothing : html`<mc-font-nudge .value=${value}></mc-font-nudge>`;
}
