import type { ActionConfig } from '../types';

/**
 * Whether an action would do something when run: its type is set (not `none`) and it has what that
 * type needs (navigate a path, url a URL, perform-action a service, toggle / more-info an entity,
 * the action's own or `entity` when `use_module_entity` allows it, popup an ID).
 */
export function isRunnableAction(action: ActionConfig | undefined, entity?: string): boolean {
  if (!action || typeof action !== 'object' || !action.action || action.action === 'none') return false;
  const has = (v: unknown) => typeof v === 'string' && v.trim() !== '';
  switch (action.action) {
    case 'navigate':
      return has(action.navigation_path);
    case 'url':
      return has(action.url_path);
    case 'perform-action':
      return has(action.service);
    case 'toggle':
    case 'more-info':
      return has(action.entity) || (action.use_module_entity !== false && has(entity));
    case 'popup':
      return has(action.hash);
    default:
      return true;
  }
}
