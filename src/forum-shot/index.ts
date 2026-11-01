import { FORUM_SHOT_TAG } from '../contracts/forum-shot';
import { MagicCardForumShot } from './element';

// Entry of dist/magic-card-forum-shot.js, loaded by the magic-card-utils panel, never by a dashboard.
// Defines only its own element, guarded.
if (!customElements.get(FORUM_SHOT_TAG)) customElements.define(FORUM_SHOT_TAG, MagicCardForumShot);

export { MagicCardForumShot };
