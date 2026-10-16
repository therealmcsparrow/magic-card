// Dev-only entry for dev/outline.html: mounts <mc-structure-outline> outside the editor shell.
import '../src/modules/index';
import '../src/editor/studio/structure-outline';
import { EditorStateManager } from '../src/editor/state/editor-state';

window.__mcOutline = { EditorStateManager };
