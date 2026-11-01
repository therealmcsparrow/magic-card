import type { StatusController, StatusHost } from '../contracts/card-status';
import { BUILD_VERSION } from '../utils/build-version';
import { createStatusController } from './controller';

/** Chunk entry of dist/magic-card-status.js (contract card-status 1.0.0): the connection and not-updated faces. */

export const BUILD: string = BUILD_VERSION;

export { statusStyles as styles } from './faces';

/** What the card calls into (a plain object, so the entry never imports this file at run time). */
export const api = { create: (host: StatusHost): StatusController => createStatusController(host) } as const;

export function install(): void {}
