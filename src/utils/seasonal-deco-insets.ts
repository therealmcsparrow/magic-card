import type { DecoMotif } from './seasonal-scenes';

/** Room (px: top, right, bottom, left) the content keeps from the edge so decorations never cover it. */
export function decoInsets(motifs: readonly DecoMotif[]): [number, number, number, number] | undefined {
  const out: [number, number, number, number] = [0, 0, 0, 0];
  const atLeast = (i: number, v: number) => (out[i] = Math.max(out[i], v));
  for (const m of motifs) {
    if (m === 'lights') for (let i = 0; i < 4; i++) atLeast(i, 20);
    else if (m === 'icicles') atLeast(0, 20);
    else if (m === 'pumpkin') atLeast(2, 30);
    else if (m === 'vine') {
      atLeast(2, 18);
      atLeast(3, 20);
    }
  }
  return out.some((v) => v > 0) ? out : undefined;
}
