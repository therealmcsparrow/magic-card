// Formats a setup snapshot as the plain-text setup block (setup-block 1.0.0). Pure and English only.
import type { ChunkEntry, SetupSnapshot } from '../contracts/diagnostics';
import {
  CHUNK_STATE_SUFFIX,
  LINE_SEPARATOR,
  LIST_SEPARATOR,
  NONE,
  NOT_INSTALLED,
  SETUP_BLOCK_HEADER,
  SETUP_BLOCK_LINES,
  TRANSPORT_TEXT,
  UNKNOWN,
  type FormatSetupBlock,
} from '../contracts/setup-block';

const list = (items: readonly string[]): string => (items.length === 0 ? NONE : items.join(LIST_SEPARATOR));

const chunks = (items: readonly ChunkEntry[]): string => list(items.map((c) => c.name + CHUNK_STATE_SUFFIX[c.state]));

const value = (s: SetupSnapshot, field: (typeof SETUP_BLOCK_LINES)[number]['field']): string => {
  switch (field) {
    case 'card':
      return s.card ?? UNKNOWN;
    case 'utils':
      return !s.utils.installed ? NOT_INSTALLED : s.utils.version ?? UNKNOWN;
    case 'looks':
      return list(s.looks.map((l) => `${l.key}=${l.name}`));
    case 'fonts':
      return list(s.fonts);
    case 'firstPaint':
      return chunks(s.firstPaint);
    case 'onClick':
      return chunks(s.onClick);
    case 'transport':
      return s.transport === null ? UNKNOWN : TRANSPORT_TEXT[s.transport];
  }
};

export const formatSetupBlock: FormatSetupBlock = (snapshot) =>
  [SETUP_BLOCK_HEADER, ...SETUP_BLOCK_LINES.map((l) => `${l.label}: ${value(snapshot, l.field)}`)].join(LINE_SEPARATOR);
