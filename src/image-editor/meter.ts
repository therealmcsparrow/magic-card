import { IMAGE_MAX_BYTES } from '../contracts/mcu-library-images';

export type MeterLevel = 'small' | 'big' | 'full' | 'over';

export const METER_BIG_BYTES = 96 * 1024;
export const METER_FULL_BYTES = 224 * 1024;
export const METER_MAX_KIB = IMAGE_MAX_BYTES / 1024;

/** small under 96 KiB, big from 96, full from 224, over above 256 KiB (256 itself still saves). */
export const meterLevel = (bytes: number): MeterLevel => (bytes > IMAGE_MAX_BYTES ? 'over' : bytes >= METER_FULL_BYTES ? 'full' : bytes >= METER_BIG_BYTES ? 'big' : 'small');

/** Whole KiB for the sentence; an over-size image never shows as exactly 256. */
export const kibShown = (bytes: number): number => (bytes > IMAGE_MAX_BYTES ? Math.ceil(bytes / 1024) : Math.round(bytes / 1024));

/** Size in bytes of the saved text: the markup plus the compact JSON of the connections (no key when there are none). */
export const savedBytes = (svg: string, bindings: readonly unknown[]): number => {
  const enc = new TextEncoder();
  return enc.encode(svg).length + (bindings.length ? enc.encode(JSON.stringify(bindings)).length : 0);
};
