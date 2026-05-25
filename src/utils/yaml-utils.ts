import jsYaml from 'js-yaml';

export function toYaml(obj: unknown): string {
  try {
    return jsYaml.dump(obj, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      sortKeys: false,
    });
  } catch {
    return '';
  }
}

export function fromYaml<T = unknown>(yaml: string): T | null {
  try {
    return jsYaml.load(yaml) as T;
  } catch {
    return null;
  }
}

export function isValidYaml(yaml: string): boolean {
  try {
    jsYaml.load(yaml);
    return true;
  } catch {
    return false;
  }
}
