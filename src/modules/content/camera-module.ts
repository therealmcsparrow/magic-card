import { html, nothing, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, CameraModuleConfig, HassEntity } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderToggleField, renderEntityField, renderSegField, renderNumberField, renderFieldHint } from '../../utils/form-utils';
import { invalidateDependencyCache, type DependencyContext, type ModuleDependencies } from '../../services/card-dependencies';
import { currentRenderContext } from '../../services/render-context';
import { cssAspectRatio, resolveMediaUrl, withRefreshParam } from '../../utils/media';
import { entityDisplayName, isUnavailable } from '../../utils/entity-value';
import { getCardHelpers } from '../advanced/custom-card-module';

const STREAM_TAG = 'ha-camera-stream';
const DEFAULT_REFRESH_S = 10;
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

const refreshMs = (c: CameraModuleConfig) =>
  (Number(c.refresh_interval) > 0 ? Number(c.refresh_interval) : DEFAULT_REFRESH_S) * 1000;

class CameraModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'camera',
    name: 'Camera',
    description: 'Display a camera entity stream',
    category: 'content',
    icon: 'mdi:camera-outline',
  };

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

  private _snapshot(c: CameraModuleConfig, hass: HomeAssistant | undefined, stateObj: HassEntity, name: string): TemplateResult {
    const picture = stateObj.attributes.entity_picture;
    if (typeof picture !== 'string' || !picture) return this._fallback(name, 'mdi:cctv-off');
    const src = withRefreshParam(resolveMediaUrl(hass, picture), refreshMs(c));
    return html`<img class="mc-camera-snapshot" src=${src} alt=${name} />`;
  }

  private _fallback(text: string, icon = 'mdi:cctv'): TemplateResult {
    return html`<div class="mc-camera-fallback"><ha-icon icon=${icon}></ha-icon>${text}</div>`;
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as CameraModuleConfig;
    const stateObj = c.entity && hass ? hass.states[c.entity] : undefined;
    const name = stateObj ? entityDisplayName(hass, stateObj) : c.entity || 'No camera';
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
      body = html`<ha-camera-stream
        class="mc-camera-stream"
        .hass=${hass}
        .stateObj=${stateObj}
        .controls=${c.show_controls !== false}
        .muted=${true}
        .fitMode=${'cover'}
        allow-exoplayer
      ></ha-camera-stream>`;
    } else {
      body = this._snapshot(c, hass, stateObj, name);
    }

    return html`
      <div class="mc-module mc-camera" style="aspect-ratio: ${cssAspectRatio(c.aspect_ratio)}">${body}</div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const c = config as CameraModuleConfig;
    const syncCtx = this._buildSyncContext(config, template);
    const live = c.camera_view === 'live';
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Camera entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, 'camera', 'entity', syncCtx)}
        ${renderSegField('View', live ? 'live' : 'snapshot', [
          { label: 'Live', value: 'live' },
          { label: 'Snapshot', value: 'snapshot' },
        ], (v) => onChange({ ...c, camera_view: v as CameraModuleConfig['camera_view'] }), 'camera_view', syncCtx)}
        ${live
          ? html`
              ${renderToggleField('Show controls', c.show_controls !== false, (v) => onChange({ ...c, show_controls: v }), 'show_controls', syncCtx,
                'Play, pause, sound and full screen on the live stream.')}
              ${renderFieldHint('The studio canvas shows a snapshot; the dashboard plays the stream (muted).')}
            `
          : nothing}
        ${renderNumberField(live ? 'Snapshot refresh (seconds)' : 'Refresh every (seconds)', c.refresh_interval,
          (v) => onChange({ ...c, refresh_interval: Number.isFinite(v) && v > 0 ? v : undefined }),
          { min: 1, max: 3600, optional: true, placeholder: String(DEFAULT_REFRESH_S) }, 'refresh_interval', syncCtx)}
        ${live ? renderFieldHint('Used until the stream player is available.') : nothing}
        ${renderTextField('Aspect ratio', c.aspect_ratio === undefined ? undefined : String(c.aspect_ratio),
          (v) => onChange({ ...c, aspect_ratio: v }), 'aspect_ratio', syncCtx, { placeholder: '16:9' })}
      </div>
    `;
  }
}

ModuleRegistry.register(new CameraModule());
