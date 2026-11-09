import { IMAGE_LEGACY_MAX_BYTES } from '../contracts/mcu-library-images';

export type MeterLevel = 'small' | 'big' | 'full' | 'over';

export const METER_BIG_SHARE = 0.375;
export const METER_FULL_SHARE = 0.875;

/** small under 37.5% of the cap, big from there, full from 87.5%, over above the cap (the cap itself still saves). */
export const meterLevel = (bytes: number, cap: number = IMAGE_LEGACY_MAX_BYTES): MeterLevel => (bytes > cap ? 'over' : bytes >= cap * METER_FULL_SHARE ? 'full' : bytes >= cap * METER_BIG_SHARE ? 'big' : 'small');

/** Whole KiB for the sentence; an over-size image never shows as exactly the cap. */
export const kibShown = (bytes: number, cap: number = IMAGE_LEGACY_MAX_BYTES): number => (bytes > cap ? Math.ceil(bytes / 1024) : Math.round(bytes / 1024));

/** Size in bytes of the saved text: the markup plus the compact JSON of the connections (no key when there are none) and of the animation. */
export const savedBytes = (svg: string, bindings: readonly unknown[], animation?: unknown): number => {
  const enc = new TextEncoder();
  return enc.encode(svg).length + (bindings.length ? enc.encode(JSON.stringify(bindings)).length : 0) + (animation ? enc.encode(JSON.stringify(animation)).length : 0);
};
