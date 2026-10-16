import { moduleEditors } from './registry';
import { textEditor } from './content/text-editor';
import { iconEditor } from './content/icon-editor';
import { infoEditor } from './content/info-editor';
import { imageEditor } from './content/image-editor';
import { markdownEditor } from './content/markdown-editor';
import { barEditor } from './content/bar-editor';
import { graphsEditor } from './content/graphs-editor';
import { cameraEditor } from './content/camera-editor';

/*
 * Registers every module editor (module-editor 1.0.0). Content modules: T1.5b; controls, layout and
 * advanced follow in T1.5c. Until then the inspector falls back to the dashboard module's tab methods.
 */
for (const editor of [
  textEditor,
  iconEditor,
  infoEditor,
  imageEditor,
  markdownEditor,
  barEditor,
  graphsEditor,
  cameraEditor,
]) {
  moduleEditors.register(editor);
}

export { moduleEditors } from './registry';
