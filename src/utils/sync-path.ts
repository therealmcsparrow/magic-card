/**
 * Utilities for building and managing property paths for sync tracking
 * Paths use dot notation: e.g., "rows.0.columns.1.modules.2.entity"
 */

export interface SyncContext {
  templateName?: string;
  notSynced: string[];
  basePath?: string;
}

/**
 * Build a property path from components
 */
export function buildPath(...parts: (string | number | undefined)[]): string {
  return parts
    .filter(p => p !== undefined && p !== '')
    .map(p => String(p))
    .join('.');
}

/**
 * Check if a property path is marked as not synced
 */
export function isNotSynced(context: SyncContext, propertyName: string): boolean {
  const fullPath = context.basePath
    ? buildPath(context.basePath, propertyName)
    : propertyName;

  return context.notSynced.includes(fullPath);
}

/**
 * Check if card is linked to a template
 */
export function hasTemplate(context: SyncContext): boolean {
  return !!context.templateName;
}

/**
 * Get the full path for a property
 */
export function getFullPath(context: SyncContext, propertyName: string): string {
  return context.basePath
    ? buildPath(context.basePath, propertyName)
    : propertyName;
}

/**
 * Create a child context with extended base path
 */
export function extendContext(context: SyncContext, ...pathParts: (string | number)[]): SyncContext {
  const newBasePath = context.basePath
    ? buildPath(context.basePath, ...pathParts)
    : buildPath(...pathParts);

  return {
    ...context,
    basePath: newBasePath,
  };
}

/**
 * Parse a path into its components
 * e.g., "rows.0.columns.1.modules.2.entity" -> ["rows", "0", "columns", "1", "modules", "2", "entity"]
 */
export function parsePath(path: string): string[] {
  return path.split('.');
}

/**
 * Get value at a path in an object
 */
export function getValueAtPath(obj: any, path: string): any {
  const parts = parsePath(path);
  let current = obj;

  for (const part of parts) {
    if (current == null) return undefined;
    current = current[part];
  }

  return current;
}

/**
 * Set value at a path in an object (creates nested objects as needed)
 */
export function setValueAtPath(obj: any, path: string, value: any): void {
  const parts = parsePath(path);
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] == null) {
      // Check if next part is a number to create array vs object
      const nextPart = parts[i + 1];
      current[part] = /^\d+$/.test(nextPart) ? [] : {};
    }
    current = current[part];
  }

  const lastPart = parts[parts.length - 1];
  current[lastPart] = value;
}

/**
 * Check if any parent path is not synced
 * e.g., if "rows.0.design" is not synced, then "rows.0.design.color" should also be treated as not synced
 */
export function hasNotSyncedParent(context: SyncContext, propertyName: string): boolean {
  const fullPath = getFullPath(context, propertyName);
  const parts = parsePath(fullPath);

  // Check each parent path
  for (let i = 1; i < parts.length; i++) {
    const parentPath = parts.slice(0, i).join('.');
    if (context.notSynced.includes(parentPath)) {
      return true;
    }
  }

  return false;
}

/**
 * Get all child paths that would be affected by marking a path as not synced
 */
export function getChildPaths(allPaths: string[], parentPath: string): string[] {
  return allPaths.filter(path =>
    path.startsWith(parentPath + '.') || path === parentPath
  );
}

/**
 * Clean up not_synced array by removing child paths when parent is marked
 * e.g., if "rows.0.design" is not synced, remove "rows.0.design.color", "rows.0.design.padding", etc.
 */
export function cleanupNotSynced(notSynced: string[]): string[] {
  const sorted = [...notSynced].sort();
  const result: string[] = [];

  for (const path of sorted) {
    // Check if any existing result is a parent of this path
    const hasParent = result.some(existingPath =>
      path.startsWith(existingPath + '.')
    );

    if (!hasParent) {
      result.push(path);
    }
  }

  return result;
}
