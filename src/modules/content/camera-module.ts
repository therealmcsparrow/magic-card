import { html, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import type { LazyStubMetadata } from '../module-types';
import { CardModule, CameraModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import type { DependencyContext, ModuleDependencies } from '../../services/card-dependencies';
import { cssAspectRatio } from '../../utils/media';
import { lazyChunks } from '../../utils/lazy-chunks';

export const STREAM_TAG = 'ha-camera-stream';
export const DEFAULT_REFRESH_S = 10;

export const refreshMs = (c: CameraModuleConfig) =>
  (Number(c.refresh_interval) > 0 ? Number(c.refresh_interval) : DEFAULT_REFRESH_S) * 1000;

class CameraModule extends BaseLazyStub {
  readonly metadata: LazyStubMetadata = { type: 'camera', inherit: ['camera'] };

  createDefault(): CameraModuleConfig {
    return {
      id: generateId('camera'),
      type: 'camera',
      aspect_ratio: '16:9',
      camera_view: 'live',
      show_controls: true,
    };
  }

  /**
   * Snapshots refresh on the card's timer: snapshot view, the studio canvas, and the live view
   * until the stream player is defined. A playing stream needs no re-render.
   */
  getDependencies(config: CardModule, ctx?: DependencyContext): ModuleDependencies {
    const c = config as CameraModuleConfig;
    if (!c.entity) return {};
    const streaming = c.camera_view === 'live' && !ctx?.editMode && typeof customElements !== 'undefined' && !!customElements.get(STREAM_TAG);
    return streaming ? {} : { refreshInterval: refreshMs(c) };
  }

  /** The camera's box at its aspect ratio, so the layout does not move when the view arrives. */
  placeholder(config: CardModule): TemplateResult {
    const c = config as CameraModuleConfig;
    return html`<div class="mc-module mc-camera" data-mc-flow-end style="aspect-ratio: ${cssAspectRatio(c.aspect_ratio)}"></div>`;
  }
}

ModuleRegistry.registerLazy(new CameraModule(), lazyChunks['modules-extra']);
