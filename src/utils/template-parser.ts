const TEMPLATE_REGEX = /\{\{.*?\}\}/gs;
const JINJA_BLOCK_REGEX = /\{%.*?%\}/gs;

export function hasTemplate(text: string | undefined): boolean {
  if (!text) return false;
  return TEMPLATE_REGEX.test(text) || JINJA_BLOCK_REGEX.test(text);
}

export function extractEntityIds(template: string): string[] {
  const entityRegex = /states\[\s*['"]([a-z_]+\.[a-z0-9_]+)['"]\s*\]/g;
  const stateAttrRegex = /state_attr\(\s*['"]([a-z_]+\.[a-z0-9_]+)['"]/g;
  const isStateRegex = /is_state\(\s*['"]([a-z_]+\.[a-z0-9_]+)['"]/g;

  const ids = new Set<string>();

  for (const regex of [entityRegex, stateAttrRegex, isStateRegex]) {
    let match;
    while ((match = regex.exec(template)) !== null) {
      ids.add(match[1]);
    }
  }

  return Array.from(ids);
}
