import type { HassEntity, HomeAssistant } from '../types';
import type { AnimationDoc, Clip } from '../anim-studio/model';

/** What the card hands the runtime for one animation document on one module wrapper. */
export interface ApplyCtx {
  hass?: HomeAssistant;
  /** The driving entity's state (the module's entity, or the entry's `entity:` override). */
  stateObj?: HassEntity;
  entityId?: string;
  reducedMotion: boolean;
  /** The card's shadow root (shared animation sheet, part lookups). */
  shadowRoot: ShadowRoot;
  /** The document's run key: its animation name (`mcc-<id>-<hash>`), also in the wrapper's `data-mc-run`. */
  run?: string;
  /** The entry's timing after the name: `<duration> <easing> <delay> <iterations> <direction>`. */
  timing?: string;
  /** The entry plays on the module's icon rather than the whole module. */
  icon?: boolean;
  /**
   * Custom documents by id (clips playing `custom:<id>`). They are UNCHECKED (the card may keep v2
   * fields as stored): never read their v2 fields directly; use compileAnimationDoc(doc, ...).v2
   * (or compileV2 / compileTracks, which re-check leniently).
   */
  lookup?: (id: string) => AnimationDoc | undefined;
}

/** What resolveHints sees: the driving entity (entry `entity:` override, else the module's). */
export interface HintCtx {
  stateObj?: HassEntity;
  states?: Record<string, HassEntity>;
  /** The document's run key (animation name): same key, same document (rig cache, clip memory per document and entity). */
  run?: string;
  /** The entry's timing (`<duration> <easing> <delay> <iterations> <direction>`), for the rig's part animations. */
  timing?: string;
  /**
   * The entry may draw the module's main icon as its rig: a module entry that does not explicitly
   * target the whole module (`target: module`). Without it no rig hint is given.
   */
  icon?: boolean;
  /** The driving entity is on for its domain (isEntityActive; clips `entity_on`). */
  active?: boolean;
  /** Draw the rig at rest (a clip plays instead of the document's own timeline). */
  still?: boolean;
}

/**
 * Decisions that change what the card's Lit render produces, made at resolve time (the render owns
 * the wrapper style and the icon element): the clip that plays (E1) and the icon rig (B1, passed to
 * renderIcon's `rig`).
 */
export interface RuntimeHints {
  clip?: Clip;
  rig?: unknown;
}
