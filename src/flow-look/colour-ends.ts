import { flowLookRegistry } from './registry';
import { gradientStroke } from './colour';
import { ends } from './ends';

/* Gradient paint and the ends (caps, arrival effect) plug into the registry. */
flowLookRegistry.stroke = gradientStroke;
flowLookRegistry.ends = ends;
