import { css, html, type TemplateResult } from 'lit';
import type { LayerKey, LayerView, LayerViewChangeDetail } from '../../contracts/studio-layers';
import type { AnimationDoc } from '../model';
import { unlockKeys } from '../layer-view';
import { t } from '../i18n';

/*
 * The "Locked. Unlock to edit." line at the top of an inspector or editor (design 08, Lock behaviour).
 * The Unlock button removes the locks that hold the rows (own and inherited) and tells the shell through
 * `layer-view-change`. Fields below it are disabled by the owner: values stay readable, nothing is edited.
 */

export const lockBannerStyles = css`
  .lock-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 8px;
    padding: 6px 8px;
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius-sm, 6px);
    font-size: 0.8125rem;
    color: var(--mc-text);
  }
  .lock-banner ha-icon {
    --mdc-icon-size: 16px;
    flex: none;
  }
  .lock-banner .txt {
    flex: 1;
    min-width: 0;
  }
`;

/** Banner for `keys` (the rows being edited); Unlock sends `layer-view-change` from its own button. */
export function lockBanner(doc: AnimationDoc, view: LayerView, keys: LayerKey[]): TemplateResult {
  const unlock = (e: Event): void => {
    const next = unlockKeys(doc, view, keys);
    (e.currentTarget as HTMLElement).dispatchEvent(new CustomEvent<LayerViewChangeDetail>('layer-view-change', { detail: { view: next, announce: t('Unlocked') }, bubbles: true, composed: true }));
  };
  return html`<div class="lock-banner" role="status"><ha-icon icon="mdi:lock-outline"></ha-icon><span class="txt">${t('Locked. Unlock to edit.')}</span><button type="button" class="btn btn-text btn-sm unlock" @click=${unlock}>${t('Unlock')}</button></div>`;
}
