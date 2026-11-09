import type { HomeAssistant } from '../types';
import type { CompiledTrack } from '../anim-studio/compile-v2';
import type { AnimationDoc } from '../anim-studio/model';
import type { ClipWhen, Track } from '../anim-studio/model-v2-core';

// Contract: animation of a library image, stored in its record and played by the image-anim chunk. Version 1.1.0.

export const IMAGE_ANIMATION_CONTRACT = '1.1.0';
/** The `v` of every record this version reads and writes. */
export const IMAGE_ANIMATION_RECORD_VERSION = 1;

export const IMAGE_ANIM_CHUNK = 'image-anim';
export const IMAGE_ANIM_CHUNK_FILE = 'magic-card-image-anim.js';
/** Sanity ceiling (B, minified); the release cap is in tools/size-caps.json. The chunk bundles no track compiler. */
export const IMAGE_ANIM_CHUNK_CEILING = 16_384;

/**
 * The only file that loads the image-anim chunk, inside the svg-image chunk: its lazyChunk('image-anim', …) and import()
 * sit there, not in the card's chunk table, so magic-card.js carries nothing for animated images. It is a registered
 * import() site. It also loads the anim-runtime chunk through src/utils/anim-runtime-loader.ts (loadRuntime) when the
 * record has a clip with tracks, starts both loads together and calls play() once both have settled. Neither load is
 * reported to the card's chunk notice: a failed image-anim load leaves the image still.
 */
export const IMAGE_ANIM_IMPORT_SITE = 'src/svg-image/anim-loader.ts';

/** Clip ids: a slug of at most 48 characters. */
export const IMAGE_CLIP_ID_RE = /^[a-z0-9](?:[a-z0-9-]{0,47})$/;
export const IMAGE_CLIP_NAME_MAX = 64;
export const IMAGE_ANIM_MAX_CLIPS = 16;
/** Per clip; the same caps as the studio v2 document (tracks 24, keyframes 40 per track), which compileTracks enforces. */
export const IMAGE_CLIP_MAX_TRACKS = 24;
export const IMAGE_TRACK_MAX_KEYFRAMES = 40;
export const IMAGE_ANIM_MAX_MORPHS = 64;
export const IMAGE_MORPH_MIN_FRAMES = 2;
export const IMAGE_MORPH_MAX_FRAMES = 32;
/** Longest string in the record other than a frame's `d` and a track's motion path. */
export const IMAGE_ANIM_MAX_STRING_CHARS = 256;
/** Clip duration (s) and iterations: the studio document ranges. */
export const IMAGE_CLIP_DURATION_RANGE = [0.05, 600] as const;
export const IMAGE_CLIP_ITERATIONS_RANGE = [0.01, 1000] as const;
export const IMAGE_CLIP_DELAY_MAX = 600;

/** Refused anywhere in any string of the record (matched case-insensitively), on top of each field's own allow-list. */
export const IMAGE_ANIM_DENY: readonly string[] = ['<!doctype', '<!entity', '<?', '<![cdata[', 'url(', '@', '{', '}', ';', '<', '>'];

/** Path data of a morph frame: the only characters allowed, after other whitespace became U+0020; length checked first. */
export const MORPH_PATH_DATA_RE = /^[MmLlHhVvCcSsQqTtAaZz0-9.,+\-eE ]+$/;
/** A morph segment easing: linear, or a cubic-bezier whose four numbers are all in 0..1 (the keySplines range). */
export const MORPH_EASING_RE = /^(?:linear|cubic-bezier\((?: ?(?:0(?:\.\d{1,6})?|1(?:\.0{1,6})?|\.\d{1,6}) ?,){3} ?(?:0(?:\.\d{1,6})?|1(?:\.0{1,6})?|\.\d{1,6}) ?\))$/;

/** Warning thresholds of the animator; none of them blocks a save. */
export const HEAVY_TARGETS = 150;
export const HEAVY_FILTER_TARGETS = 8;
export const HEAVY_MORPH_POINTS = 20_000;
export const HEAVY_ANIM_BYTES = 524_288;

/** What starts a clip. Priority tap > hover > state > always; one clip plays at a time. */
export type ClipPlay =
  | { on: 'always' }
  | { on: 'hover' }
  | { on: 'tap' }
  | { on: 'state'; entity: string; attribute?: string; when: ClipWhen };

/**
 * A studio v2 track on the whole image (`element`) or on an svg element by id (IMAGE_ID_RE). One track per target per
 * clip; the viewer maps each id to a rig part of its own before compileTracks.
 */
export type ImageTrack = Omit<Track, 'target'> & { target: 'element' | `part:${string}` };

export interface ImageMorphFrame {
  /** Percent of the clip, 0 first and 100 last, strictly rising. */
  at: number;
  /** Path data per MORPH_PATH_DATA_RE; every frame of a morph has one command structure, and a mismatch is refused. */
  d: string;
  /** Easing from this frame to the next; default linear. */
  easing?: string;
}

export interface ImageMorph {
  /** Id of the `<path>` that changes. */
  target: string;
  /**
   * Id of the editor-written `<animate>` child of that path, the SMIL copy: `values` the frames' `d`, keyTimes at / 100,
   * and with any cubic-bezier calcMode spline plus one keySpline per segment (frames − 1); clip dur and repeatCount.
   */
  smil: string;
  frames: ImageMorphFrame[];
}

export interface ImageClip {
  id: string;
  /** 1..IMAGE_CLIP_NAME_MAX characters. */
  name: string;
  play: ClipPlay;
  /** s per iteration. */
  duration: number;
  /** s before the first iteration; default 0. */
  delay?: number;
  /** Track easing, as the studio document's `easing`. */
  easing: string;
  iterations: 'infinite' | number;
  /** A clip with morphs plays `normal` only. */
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  tracks: ImageTrack[];
  morphs?: ImageMorph[];
}

/** `animation` of a library image record (mcu-library images 1.2.0). */
export interface ImageAnimation {
  v: 1;
  clips: ImageClip[];
}

/** The record's animation, checked on the allow-lists above; undefined drops the whole animation and the image shows still. */
export type CheckImageAnimation = (value: unknown, svgIds: ReadonlySet<string>) => ImageAnimation | undefined;

/** The `<animate>` ids a checked animation names; the image sanitiser keeps only these SMIL copies. */
export type ImageMorphIds = (anim: ImageAnimation) => ReadonlySet<string>;

export interface ImageAnimContext {
  hass: HomeAssistant | undefined;
  /**
   * The `<mc-svg-image>` that shows the image. Composed parents lead to the trigger host (passive hover and tap
   * listeners) and the nearest `<magic-card>`, which gets data-mc-pause-want before the first play.
   */
  host: HTMLElement;
}

export interface ImageAnimHandle {
  /** New hass or host state: state clips are matched again. */
  update(ctx: ImageAnimContext): void;
  /** Stops every clip and removes listeners and styles; the card's last animated image also removes data-mc-pause-want. */
  release(): void;
}

/**
 * Compiles the tracks of a studio document into keyframes: the `compileTracks` export of the anim-runtime chunk, which
 * already holds the compiler. The viewer passes a document whose rig maps each track target to a part of its own.
 */
export type ImageTrackCompiler = (doc: AnimationDoc) => readonly CompiledTrack[];

/** What the image-anim chunk exports as `api`. */
export interface ImageAnimChunk {
  readonly version: typeof IMAGE_ANIMATION_CONTRACT;
  /**
   * `svg` is the sanitised, mounted drawing; `anim` has passed CheckImageAnimation. Each morph plays exactly once: the
   * CSS `d` keyframes when the once-per-document effect probe sees CSS `d` move a hidden path's getBBox(), else (or
   * unsure) the SMIL copy through beginElement(). Reduced motion holds both at their first frame and never begins SMIL;
   * card pause and off-screen pause the CSS and call pauseAnimations() together.
   *
   * Synchronous. `compile` is the anim-runtime chunk's compileTracks, already loaded. Without it a clip with tracks does
   * not play at all, morphs included, so a clip never plays in part; a clip with morphs only plays without it.
   */
  play(svg: SVGSVGElement, anim: ImageAnimation, ctx: ImageAnimContext, compile?: ImageTrackCompiler): ImageAnimHandle;
}
