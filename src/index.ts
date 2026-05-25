import { VERSION } from './version';
import { CARD_TAG, EDITOR_TAG, CARD_NAME, CARD_DESCRIPTION } from './utils/constants';

// Card
import './card/magic-card';

// Editor
import './editor/magic-card-editor';

// Modules - self-register on import
import './modules';

// Register with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_TAG,
  name: CARD_NAME,
  description: CARD_DESCRIPTION,
  preview: true,
  documentationURL: 'https://github.com/therealmcsparrow/magic-card',
});

console.info(
  `%c MAGIC-CARD %c v${VERSION} `,
  'color: white; background: #6366f1; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;',
  'color: #6366f1; background: #e0e7ff; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;',
);
