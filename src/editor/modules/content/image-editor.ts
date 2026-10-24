import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { ImageModuleConfig } from '../../../types';
import { renderTextField, renderToggleField, renderAttributeField, renderSelectField, renderMediaField, renderFieldHint, renderSyncMark } from '../../../utils/form-utils';
import { cssAspectRatio } from '../../../utils/aspect-ratio';
import { entityFor, buildSyncContext } from '../base-editor';
import { t, tc } from '../../i18n';
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
        ${renderEntitySourceField(t('Entity'), c, onChange, hass, scope, { syncCtx })}
        ${!c.attribute
          ? renderToggleField(t('Use entity picture'), c.entity_picture, (v) =>
              onChange({ ...c, entity_picture: v }), 'entity_picture', syncCtx,
              t("Shows the entity's picture (person, image, camera, media player)."))
          : nothing}
        ${renderAttributeField(t('Image from attribute'), c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, eid, 'attribute', syncCtx, attributeCaption(scope))}
        ${eid && c.attribute ? renderFieldHint(t('The attribute holds the image URL; it replaces the entity picture and the image URL.')) : nothing}
        ${withImageTools(
          () => html`<div class="mc-field">
            <mc-library-image-field .hass=${hass} .value=${c.image ?? ''} .module=${c} .hideSource=${plain} .label=${t('Image')} @image-change=${(e: CustomEvent<{ keys: Record<string, unknown> }>) => onChange(applyKeys(c, e.detail.keys))}></mc-library-image-field>
            ${syncCtx ? renderSyncMark('image', syncCtx) : nothing}
          </div>`,
          () => (plain ? html`` : renderMediaField(t('Image URL'), c.image, (v) => onChange({ ...c, image: v }), hass, 'image', 'image', syncCtx)),
        )}
        ${renderTextField(t('Aspect ratio'), c.aspect_ratio === undefined ? undefined : String(c.aspect_ratio), (v) =>
          onChange({ ...c, aspect_ratio: v }), 'aspect_ratio', syncCtx, { placeholder: '16:9' })}
        ${c.aspect_ratio !== undefined && c.aspect_ratio !== '' && cssAspectRatio(c.aspect_ratio, '') === ''
          ? renderFieldHint(t('Use a ratio like 16:9, 4/3, 1.5 or 56.25%. 16:9 is used until then.'))
          : nothing}
        ${renderSelectField(
          t('Fit'),
          c.fit,
          [
            { label: t('Cover'), value: 'cover' },
            { label: t('Contain'), value: 'contain' },
            { label: tc('fit', 'Fill'), value: 'fill' },
            { label: t('None'), value: 'none' },
          ],
          (v) => onChange({ ...c, fit: v as ImageModuleConfig['fit'] }), 'fit', syncCtx)}
      </div>
    `;
  },
};
