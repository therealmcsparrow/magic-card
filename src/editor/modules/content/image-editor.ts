import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { ImageModuleConfig } from '../../../types';
import { renderTextField, renderToggleField, renderAttributeField, renderSelectField, renderMediaField, renderFieldHint, renderSyncMark } from '../../../utils/form-utils';
import { cssAspectRatio } from '../../../utils/aspect-ratio';
import { entityFor, buildSyncContext } from '../base-editor';
import { t } from '../../i18n';
import { attributeCaption, renderEntitySourceField } from '../../components/entity-source';
import { applyKeys, withImageTools } from '../../image-tools-loader';

export const imageEditor: ModuleEditor = {
  type: 'image',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const c = config as ImageModuleConfig;
    const eid = entityFor(c, scope);
    const syncCtx = buildSyncContext(config, template);
    /** The picture comes from an entity: the image source is not shown. */
    const plain = !!c.entity_picture || !!(eid && c.attribute);
    return html`
      <div class="mc-tab-content">
        ${renderEntitySourceField(t('card-editor.image-editor.entity'), c, onChange, hass, scope, { syncCtx })}
        ${!c.attribute
          ? renderToggleField(t('card-editor.image-editor.use-entity-picture'), c.entity_picture, (v) =>
              onChange({ ...c, entity_picture: v }), 'entity_picture', syncCtx,
              t("card-editor.image-editor.shows-the-entity-s-picture-person-image"))
          : nothing}
        ${renderAttributeField(t('card-editor.image-editor.image-from-attribute'), c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, eid, 'attribute', syncCtx, attributeCaption(scope))}
        ${eid && c.attribute ? renderFieldHint(t('card-editor.image-editor.the-attribute-holds-the-image-url-it')) : nothing}
        ${withImageTools(
          () => html`<div class="mc-field">
            <mc-library-image-field .hass=${hass} .value=${c.image ?? ''} .module=${c} .hideSource=${plain} .label=${t('card-editor.image-editor.image')} @image-change=${(e: CustomEvent<{ keys: Record<string, unknown> }>) => onChange(applyKeys(c, e.detail.keys))}></mc-library-image-field>
            ${syncCtx ? renderSyncMark('image', syncCtx) : nothing}
          </div>`,
          () => (plain ? html`` : renderMediaField(t('card-editor.image-editor.image-url'), c.image, (v) => onChange({ ...c, image: v }), hass, 'image', 'image', syncCtx)),
        )}
        ${renderTextField(t('card-editor.image-editor.aspect-ratio'), c.aspect_ratio === undefined ? undefined : String(c.aspect_ratio), (v) =>
          onChange({ ...c, aspect_ratio: v }), 'aspect_ratio', syncCtx, { placeholder: '16:9' })}
        ${c.aspect_ratio !== undefined && c.aspect_ratio !== '' && cssAspectRatio(c.aspect_ratio, '') === ''
          ? renderFieldHint(t('card-editor.image-editor.use-a-ratio-like-16-9-4-3-1-5-or-56-25'))
          : nothing}
        ${renderSelectField(
          t('card-editor.image-editor.fit'),
          c.fit,
          [
            { label: t('card-editor.image-editor.cover'), value: 'cover' },
            { label: t('card-editor.image-editor.contain'), value: 'contain' },
            { label: t('card-editor.image-editor.fill'), value: 'fill' },
            { label: t('card-editor.image-editor.none'), value: 'none' },
          ],
          (v) => onChange({ ...c, fit: v as ImageModuleConfig['fit'] }), 'fit', syncCtx)}
      </div>
    `;
  },
};
