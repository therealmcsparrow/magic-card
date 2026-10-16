import { moduleEditors } from './registry';
import { textEditor } from './content/text-editor';
import { iconEditor } from './content/icon-editor';
import { infoEditor } from './content/info-editor';
import { imageEditor } from './content/image-editor';
import { markdownEditor } from './content/markdown-editor';
import { barEditor } from './content/bar-editor';
import { graphsEditor } from './content/graphs-editor';
import { cameraEditor } from './content/camera-editor';
import { buttonEditor } from './controls/button-editor';
import { sliderEditor } from './controls/slider-editor';
import { spinboxEditor } from './controls/spinbox-editor';
import { dropdownEditor } from './controls/dropdown-editor';
import { lightEditor } from './controls/light-editor';
import { gaugeEditor } from './controls/gauge-editor';
import { horizontalEditor } from './layout/horizontal-editor';
import { verticalEditor } from './layout/vertical-editor';
import { rowEditor } from './layout/row-editor';
import { tabsEditor } from './layout/tabs-editor';
import { separatorEditor } from './layout/separator-editor';
import { sliderLayoutEditor } from './layout/slider-layout-editor';
import { clockEditor } from './advanced/clock-editor';
import { weatherEditor } from './advanced/weather-editor';
import { forecastEditor } from './advanced/forecast-editor';
import { videoBgEditor } from './advanced/video-bg-editor';
import { customCardEditor } from './advanced/custom-card-editor';

/* Registers every module editor (module-editor 1.0.0): one per ModuleRegistry type. */
for (const editor of [
  textEditor,
  iconEditor,
  infoEditor,
  imageEditor,
  markdownEditor,
  barEditor,
  graphsEditor,
  cameraEditor,
  buttonEditor,
  sliderEditor,
  spinboxEditor,
  dropdownEditor,
  lightEditor,
  gaugeEditor,
  horizontalEditor,
  verticalEditor,
  rowEditor,
  tabsEditor,
  separatorEditor,
  sliderLayoutEditor,
  clockEditor,
  weatherEditor,
  forecastEditor,
  videoBgEditor,
  customCardEditor,
]) {
  moduleEditors.register(editor);
}

export { moduleEditors } from './registry';
