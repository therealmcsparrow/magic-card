import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { ImageModuleConfig } from '../../../types';
import { renderTextField, renderToggleField, renderEntityField, renderAttributeField, renderSelectField, renderMediaField, renderFieldHint } from '../../../utils/form-utils';
import { cssAspectRatio } from '../../../utils/media';
import { buildSyncContext } from '../base-editor';

export const imageEditor: ModuleEditor = {
  type: 'image',
  general(config, hass, onChange, template) {
    const c = config as ImageModuleConfig;
    const syncCtx = buildSyncContext(config, template);
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${!c.attribute
          ? renderToggleField('Use entity picture', c.entity_picture, (v) =>
              onChange({ ...c, entity_picture: v }), 'entity_picture', syncCtx,
              "Shows the entity's picture (person, image, camera, media player).")
          : nothing}
        ${renderAttributeField('Image from attribute', c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, c.entity, 'attribute', syncCtx)}
        ${c.entity && c.attribute ? renderFieldHint('The attribute holds the image URL; it replaces the entity picture and the image URL.') : nothing}
        ${!c.entity_picture && !(c.entity && c.attribute)
          ? renderMediaField('Image URL', c.image, (v) => onChange({ ...c, image: v }), hass, 'image', 'image', syncCtx)
          : nothing}
        ${renderTextField('Aspect ratio', c.aspect_ratio === undefined ? undefined : String(c.aspect_ratio), (v) =>
          onChange({ ...c, aspect_ratio: v }), 'aspect_ratio', syncCtx, { placeholder: '16:9' })}
        ${c.aspect_ratio !== undefined && c.aspect_ratio !== '' && cssAspectRatio(c.aspect_ratio, '') === ''
          ? renderFieldHint('Use a ratio like 16:9, 4/3, 1.5 or 56.25%. 16:9 is used until then.')
          : nothing}
        ${renderSelectField(
          'Fit',
          c.fit,
          [
            { label: 'Cover', value: 'cover' },
            { label: 'Contain', value: 'contain' },
            { label: 'Fill', value: 'fill' },
            { label: 'None', value: 'none' },
          ],
          (v) => onChange({ ...c, fit: v as ImageModuleConfig['fit'] }), 'fit', syncCtx)}
      </div>
    `;
  },
};
