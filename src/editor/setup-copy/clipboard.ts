// Clipboard port: writes plain text with navigator.clipboard.writeText and maps every failure to blocked.
// Version 1.0.0 of the clipboard-port Contract (src/contracts/clipboard-port.ts).

import type { ClipboardPort, CopyOutcome } from '../../contracts/clipboard-port';

/** Starts the write in the caller's own task so the user activation holds; never rejects or throws. */
export function createClipboardPort(): ClipboardPort {
  return {
    writeText(text: string): Promise<CopyOutcome> {
      try {
        if (!window.isSecureContext) return Promise.resolve('blocked');
        const clipboard = navigator.clipboard;
        if (typeof clipboard?.writeText !== 'function') return Promise.resolve('blocked');
        return Promise.resolve(clipboard.writeText(text)).then(
          (): CopyOutcome => 'copied',
          (): CopyOutcome => 'blocked',
        );
      } catch {
        return Promise.resolve('blocked');
      }
    },
  };
}
