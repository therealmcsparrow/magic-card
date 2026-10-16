export interface LayoutOption {
  label: string;
  value: string;
}

function layoutFromWeights(weights: number[]): string {
  return weights.map((w) => Math.max(1, Math.round(w))).join('-');
}

function equalWeights(colCount: number): number[] {
  return Array.from({ length: Math.max(colCount, 1) }, () => 1);
}

export function layoutOptions(colCount: number): LayoutOption[] {
  const options: LayoutOption[] = [];
  const seen = new Set<string>();

  const add = (label: string, weights: number[]) => {
    if (weights.length !== colCount) return;
    const value = layoutFromWeights(weights);
    if (seen.has(value)) return;
    seen.add(value);
    options.push({ label, value });
  };

  add('Balanced', equalWeights(colCount));

  if (colCount > 1) {
    add('Left focus', [2, ...Array.from({ length: colCount - 1 }, () => 1)]);
    add('Right focus', [...Array.from({ length: colCount - 1 }, () => 1), 2]);
  }

  if (colCount >= 3) {
    const center = Math.floor(colCount / 2);
    const centerWeights = equalWeights(colCount);
    centerWeights[center] = 2;
    add('Center focus', centerWeights);
  }

  if (colCount >= 4) {
    const splitWeights = equalWeights(colCount);
    splitWeights[0] = 2;
    splitWeights[colCount - 1] = 2;
    add('Dual focus', splitWeights);
  }

  return options;
}

export function layoutWeights(layout: string, colCount: number): number[] {
  if (/^\d+(?:-\d+)*$/.test(layout)) {
    const weights = layout.split('-').map((segment) => Math.max(Number(segment) || 1, 1));
    if (weights.length === colCount) return weights;
  }
  return equalWeights(colCount);
}
