// The `custom:<id>` reference of an animation preset: plain string helpers the entry needs while
// the document model lives in the lazy `anim` chunk (src/anim-studio/model.ts re-exports them).

export const CUSTOM_PREFIX = 'custom:';
export const isCustomRef = (preset: unknown): preset is string => typeof preset === 'string' && preset.startsWith(CUSTOM_PREFIX);
export const customRefId = (preset: string): string => preset.slice(CUSTOM_PREFIX.length).trim();
