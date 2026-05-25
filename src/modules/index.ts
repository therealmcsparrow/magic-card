// Module registry and types
export { ModuleRegistry } from './module-registry';
export { BaseMagicModule } from './base-module';
export type { MagicModule, MagicModuleMetadata } from './module-types';

// Content modules
import './content/text-module';
import './content/icon-module';
import './content/info-module';
import './content/image-module';
import './content/markdown-module';
import './content/bar-module';
import './content/graphs-module';
import './content/camera-module';
import './content/slider-module';

// Control modules
import './controls/button-module';
import './controls/slider-module';
import './controls/spinbox-module';
import './controls/dropdown-module';
import './controls/light-module';
import './controls/gauge-module';

// Layout modules
import './layout/horizontal-module';
import './layout/vertical-module';
import './layout/row-module';
import './layout/tabs-module';
import './layout/separator-module';
import './layout/slider-layout-module';

// Advanced modules
import './advanced/clock-module';
import './advanced/weather-module';
import './advanced/forecast-module';
import './advanced/video-bg-module';
import './advanced/custom-card-module';
