// Dev-only entry for dev/anim-v2-d.html: the card-parts layers panel (Task D1) standalone, next to
// real magic-cards (the page loads magic-card.js, which loads the v2 runtime chunk on demand).
import '../src/anim-studio/editors/targets-layers';
import { TILES, tileModule, tileHass } from '../src/anim-studio/tiles';

window.__tiles = { TILES, tileModule, tileHass };
