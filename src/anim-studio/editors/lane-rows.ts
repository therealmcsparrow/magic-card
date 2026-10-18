import type { TemplateResult } from 'lit';
import type { LayerKey, LayerView } from '../../contracts/studio-layers';
import type { AnimationDoc, TargetRef } from '../model';
import type { StudioSelection } from '../slots';
import { laneAts, lanesOf } from '../layer-view';
import { LANE_BY_ID, type LaneId } from './keyframes-utils';
import type { LayerRows } from './layer-row';

/*
 * Keyframe tracks as lane rows (design 08 section 6): under a target row (card part, icon part, group,
 * shape) a disclosure lists one row per animated property. The disclosure state is `LayerView.open`
 * (keyed by the target row); a lane has hide / solo / lock but no order and no move. Choosing one
 * selects that track in the timeline.
 */

export const laneKey = (target: TargetRef, lane: string): LayerKey => `lane:${target}|${lane}`;

export function splitLane(key: LayerKey): { target: TargetRef; lane: LaneId } {
  const at = key.lastIndexOf('|');
  return { target: key.slice(5, at) as TargetRef, lane: key.slice(at + 1) as LaneId };
}

/** "Opacity", "Rotate", "Move X". */
export const laneName = (key: LayerKey): string => LANE_BY_ID[splitLane(key).lane]?.label ?? key;

/** Whether a target's tracks are open (`view.open` holds its row key); undefined when it has none. */
export const tracksOpen = (doc: AnimationDoc, view: LayerView, target: TargetRef, key: LayerKey): boolean | undefined =>
  lanesOf(doc, target).length ? view.open.includes(key) : undefined;

/** Select every key of a lane: the timeline shows that track and the inspector its easing. */
export function selectLane(host: HTMLElement, doc: AnimationDoc, key: LayerKey): void {
  const { target, lane } = splitLane(key);
  const keys = laneAts(doc, target, lane).map((at) => ({ target, lane, at, id: `${lane}@${at}` }));
  const selection: StudioSelection = { kind: 'keys', keys, target, targets: [target] };
  host.dispatchEvent(new CustomEvent('selection-change', { detail: { selection }, bubbles: true, composed: true }));
}

/** The lane rows of an open target, one level under it. */
export function trackRows(list: LayerRows, doc: AnimationDoc, selection: StudioSelection | undefined, target: TargetRef, level: 2 | 3): TemplateResult[] {
  return lanesOf(doc, target).map((lane) => {
    const key = laneKey(target, lane);
    const n = laneAts(doc, target, lane).length;
    const on = selection?.kind === 'keys' && !!selection.keys?.length && selection.keys.every((k) => k.target === target && k.lane === lane);
    return list.row({ key, name: laneName(key), bare: true, level, badge: `${n} key${n === 1 ? '' : 's'}`, describe: 'keyframe track', selected: on, title: `${laneName(key)}: ${n} key${n === 1 ? '' : 's'}` });
  });
}
