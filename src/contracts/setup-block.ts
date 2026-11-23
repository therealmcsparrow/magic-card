import type { ChunkState, SetupSnapshot } from './diagnostics';

// Contract: setup block. Version 1.0.0 (SETUP_BLOCK_CONTRACT). The plain-text block the Copy my setup button copies, block
// format version 1 (the `setup v1` first line). Provider: src/diagnostics/format.ts. English constants only, never through i18n.

export const SETUP_BLOCK_CONTRACT = '1.0.0';
export const SETUP_BLOCK_VERSION = 1;

/** The first line, exactly. */
export const SETUP_BLOCK_HEADER = `setup v${SETUP_BLOCK_VERSION}`;

/** Every line after the header, in this order, each always printed as `<label>: <value>`. */
export const SETUP_BLOCK_LINES = [
  { field: 'card', label: 'card' },
  { field: 'utils', label: 'utils' },
  { field: 'looks', label: 'looks' },
  { field: 'fonts', label: 'fonts' },
  { field: 'firstPaint', label: 'first paint' },
  { field: 'onClick', label: 'on click' },
  { field: 'transport', label: 'transport' },
] as const satisfies readonly { field: keyof SetupSnapshot; label: string }[];

/** A missing value (card null, utils version null, transport null). */
export const UNKNOWN = 'unknown';
/** An empty list. */
export const NONE = 'none';
/** The utils value when Utils is not installed. */
export const NOT_INSTALLED = 'not installed';

/** Appended to a chunk name; a loaded chunk prints its name only. */
export const CHUNK_STATE_SUFFIX: Readonly<Record<ChunkState, string>> = {
  loaded: '',
  pending: ' (pending)',
  failed: ' (failed)',
  'other-release': ' (other release)',
};

export const TRANSPORT_TEXT: Readonly<Record<'secure' | 'not-secure', string>> = { secure: 'secure', 'not-secure': 'not secure' };

/** Between list items (looks as `key=name`, fonts, chunks with their suffix), in the snapshot's order. */
export const LIST_SEPARATOR = ', ';
/** Between lines. The block has no trailing line break and exactly 1 + SETUP_BLOCK_LINES.length lines. */
export const LINE_SEPARATOR = '\n';

/** Total: every snapshot gives a block, never an empty line or a missing one. The clipboard and the fallback box get the same text. */
export type FormatSetupBlock = (snapshot: SetupSnapshot) => string;
