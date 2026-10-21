import { t } from '../i18n';
import { html, TemplateResult } from 'lit';
import { CardModule, HomeAssistant, CameraModuleConfig, HassEntity } from '../../types';
import type { ModuleView } from '../../contracts/lazy-module';
import { invalidateDependencyCache } from '../../services/card-dependencies';
import { currentRenderContext } from '../../services/render-context';
import { cssAspectRatio, safeSnapshotSrc, withRefreshParam } from '../../utils/media';
import { entityDisplayName, isUnavailable } from '../../utils/entity-value';
import { getCardHelpers } from '../../utils/card-helpers';
import { STREAM_TAG, refreshMs } from './camera-module';

/* Chunk-only (magic-card-modules-extra.js): no effects at evaluation. */

const LOAD_TIMEOUT_MS = 10_000;

let _streamLoad: Promise<void> | undefined;
const _streamWaiters = new Set<() => void>();

/** Reset the stream loader (tests). */
export function resetCameraStreamLoader(): void {
  _streamLoad = undefined;
  _streamWaiters.clear();
}

/**
 * HA's `<ha-camera-stream>` (HLS / WebRTC / MJPEG, whatever the camera offers) is part of the
 * frontend's picture cards and only defined once one of them loaded. Creating a picture-glance card
 * through the card helpers loads it; `onReady` runs once it is defined. True when it is there now.
 */
function cameraStreamReady(entityId: string, onReady?: () => void): boolean {
  if (typeof customElements === 'undefined') return false;
  if (customElements.get(STREAM_TAG)) return true;
  if (onReady) _streamWaiters.add(onReady);
  if (!_streamLoad) {
    _streamLoad = (async () => {
      const helpers = getCardHelpers();
      if (!helpers) return;
      (await helpers).createCardElement({ type: 'picture-glance', entities: [], camera_image: entityId });
      let timer: ReturnType<typeof setTimeout> | undefined;
      await Promise.race([
        customElements.whenDefined(STREAM_TAG),
        new Promise<void>((resolve) => {
          timer = setTimeout(resolve, LOAD_TIMEOUT_MS);
        }),
      ]).finally(() => clearTimeout(timer));
    })()
      .catch(() => undefined)
      .then(() => {
        if (!customElements.get(STREAM_TAG)) return;
        // Live cameras stop asking for the snapshot timer (see getDependencies).
        invalidateDependencyCache();
        const waiters = [..._streamWaiters];
        _streamWaiters.clear();
        waiters.forEach((cb) => cb());
      });
  }
  return false;
}

export class CameraView implements ModuleView {
  private _snapshot(c: CameraModuleConfig, hass: HomeAssistant | undefined, stateObj: HassEntity, name: string): TemplateResult {
    const safe = safeSnapshotSrc(hass, stateObj.attributes.entity_picture);
    if (!safe) return this._fallback(name, 'mdi:cctv-off');
    const src = withRefreshParam(safe, refreshMs(c));
    return html`<img class="mc-camera-snapshot" src=${src} alt=${name} />`;
  }

  private _fallback(text: string, icon = 'mdi:cctv'): TemplateResult {
    return html`<div class="mc-camera-fallback"><ha-icon icon=${icon}></ha-icon>${text}</div>`;
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as CameraModuleConfig;
    const stateObj = c.entity && hass ? hass.states[c.entity] : undefined;
    const name = stateObj ? entityDisplayName(hass, stateObj) : c.entity || t('No camera');
    const ctx = currentRenderContext();

    let body: TemplateResult;
    if (!stateObj) {
      body = this._fallback(name);
    } else if (isUnavailable(stateObj)) {
      body = this._fallback(`${name}: ${hass!.formatEntityState?.(stateObj) || stateObj.state}`, 'mdi:cctv-off');
    } else if (
      // Live only when asked: modules from before the option (no camera_view) keep their refreshed snapshot.
      c.camera_view === 'live' &&
      // The studio canvas shows a snapshot: a stream would start a live session per edit.
      !ctx?.editMode &&
      cameraStreamReady(stateObj.entity_id, ctx?.requestUpdate)
    ) {
      body = html`<mc-camera-live .hass=${hass} .stateObj=${stateObj} .controls=${c.show_controls !== false}></mc-camera-live>`;
    } else {
      body = this._snapshot(c, hass, stateObj, name);
    }

    return html`
      <div class="mc-module mc-camera" data-mc-flow-end style="aspect-ratio: ${cssAspectRatio(c.aspect_ratio)}">${body}</div>
    `;
  }
}
