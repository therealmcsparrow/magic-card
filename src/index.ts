// Lazy chunks (magic-card-anim-runtime.js) load next to this file, wherever HA serves it from
// (/hacsfiles/magic-card/, /local/...): a module script has no document.currentScript, so webpack's
// automatic public path cannot find it. Imports are hoisted and run before this line; that is fine
// because nothing loads a chunk while the modules evaluate (only after a card renders).
__webpack_public_path__ = new URL('.', import.meta.url).href;

import { VERSION } from './version';
import { CARD_TAG, CARD_NAME, CARD_DESCRIPTION } from './utils/constants';

// Card
import './card/magic-card';

// Editor: a lazy chunk (magic-card-editor.js), loaded by MagicCard.getConfigElement() and
// window.MagicCard.loadEditor() through src/utils/editor-loader.ts, never imported here

// Modules - self-register on import
import './modules';
import { publishContract } from './utils/window-contract';

// Register with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_TAG,
  name: CARD_NAME,
  description: CARD_DESCRIPTION,
  preview: true,
  documentationURL: 'https://github.com/therealmcsparrow/magic-card',
});

// Contract for the magic-card-utils panel (merged, so other keys on an existing object survive)
publishContract();

console.info(
  `%c MAGIC-CARD %c v${VERSION} `,
  'color: white; background: #6366f1; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;',
  'color: #6366f1; background: #e0e7ff; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;',
);
