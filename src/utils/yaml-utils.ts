import * as jsYaml from 'js-yaml';

// js-yaml 5 no longer resolves `<<` merge keys by default
const LOAD_SCHEMA = jsYaml.CORE_SCHEMA.withTags(jsYaml.mergeTag);

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
    return jsYaml.load(yaml, { schema: LOAD_SCHEMA }) as T;
  } catch {
    return null;
  }
}

export function isValidYaml(yaml: string): boolean {
  try {
    jsYaml.load(yaml, { schema: LOAD_SCHEMA });
    return true;
  } catch {
    return false;
  }
}
