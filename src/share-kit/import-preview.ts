import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { EntityPlaceholder } from '../contracts/share-kit';
import type { TransferItem, TransferKind } from '../contracts/preset-transfer';
import type { ThemeDoc } from '../contracts/theme-editor';
import { demoStates, demoText } from './demo-states';
import { t } from './i18n';
import { NEUTRAL_PATTERN, previewSafe, wallTabletLabels, wallTabletVars } from './preview';

// The preview of an import, drawn from previewSafe copies and demo states: an address that is not an embedded image
// never reaches an element, so showing it contacts no other host.

const DATA_SVG_RE = /^<svg[\s>][^]*<\/svg>\s*$/i;

/** An embedded picture of an icon or image item (shown in an <img>, where a script never runs), or undefined. */
function picture(kind: TransferKind, data: unknown): string | undefined {
  const svg = (data as { svg?: unknown } | undefined)?.svg;
  return (kind === 'icon' || kind === 'image') && typeof svg === 'string' && DATA_SVG_RE.test(svg) ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : undefined;
}

export function importPreview(kind: TransferKind, items: readonly TransferItem[], placeholders: readonly EntityPlaceholder[], wallTablet: boolean, onWallTablet: () => void): TemplateResult {
  const demo = Object.values(demoStates(placeholders));
  return html`<div data-import-preview>
    <strong>${t('share-kit.import-preview.preview-heading')}</strong>
    ${kind === 'theme'
      ? html`<button type="button" class="tablet-toggle" data-wall-tablet-toggle aria-pressed=${wallTablet ? 'true' : 'false'} @click=${onWallTablet}>${t('share-kit.import-preview.wall-tablet-toggle')}</button>`
      : nothing}
    ${items.map((i) => {
      const safe = previewSafe(kind, i.data as never);
      const src = picture(kind, safe);
      return html`<figure role="group" aria-label=${t('share-kit.import-preview.preview-of-name', { name: i.name })} style="margin:8px 0">
        ${src ? html`<img src=${src} alt="" width="56" height="56" />` : html`<div aria-hidden="true" style=${`width:56px;height:56px;border-radius:8px;background:${NEUTRAL_PATTERN}`}></div>`}
        <figcaption>${i.name}</figcaption>
        ${kind === 'animation' ? html`<mc-anim-preview .doc=${safe}></mc-anim-preview>` : nothing}
        ${kind === 'theme'
          ? wallTablet
            ? (['light', 'dark'] as const).map((m) => html`<mc-wall-tablet .vars=${wallTabletVars(safe as ThemeDoc, m)} .labels=${wallTabletLabels(m)}></mc-wall-tablet>`)
            : nothing
          : nothing}
      </figure>`;
    })}
    ${demo.length ? html`<p class="help">${t('share-kit.import-preview.demo-states-help')}</p><ul>${demo.map((d) => html`<li><span class="mono">${d.entity_id}</span> ${demoText(d)}</li>`)}</ul>` : nothing}
  </div>`;
}
