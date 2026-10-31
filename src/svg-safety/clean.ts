import type { SvgPolicy, SvgValueKind } from '../contracts/svg-safety';
import { cleanImageValue } from './image-values';
import { cleanIconValue } from './values';

// The value to keep for an attribute of the given kind under the policy, or undefined to drop (and list) it.
export const cleanValue = (kind: SvgValueKind, raw: string, policy: SvgPolicy): string | undefined =>
  policy.name === 'image' ? cleanImageValue(kind, raw, policy) : cleanIconValue(kind, raw, policy);
