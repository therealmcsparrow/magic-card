import { LitElement, html, css } from 'lit';
import type { PropertyDeclarations, PropertyValues, TemplateResult } from 'lit';
import { FORUM_SHOT_CONTRACT_VERSION } from '../contracts/forum-shot';
import type { LocaleHassLike } from '../contracts/i18n';
import { setI18nLocale } from '../i18n/runtime';
import { t } from './i18n';

/** <magic-card-forum-shot>: the forum shot host. The panel sets `hass` and `narrow`; the element reads dashboards through hass.callWS only. */
export class MagicCardForumShot extends LitElement {
  static readonly contractVersion = FORUM_SHOT_CONTRACT_VERSION;

  static properties: PropertyDeclarations = {
    hass: { attribute: false },
    narrow: { type: Boolean },
  };

  hass?: LocaleHassLike & { callWS?: <T>(msg: Record<string, unknown>) => Promise<T> };
  narrow = false;

  static styles = css`
    :host {
      display: block;
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
      }
    }
  `;

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('hass')) setI18nLocale(this.hass);
  }

  protected render(): TemplateResult {
    return html`<section role="region" aria-label=${t('forum-shot.element.forum-shot')}></section>`;
  }
}
