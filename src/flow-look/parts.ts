/*
 * The plug-in list of the flow-look chunk: one side-effect import per part that registers itself in
 * the registry (src/flow-look/registry.ts) before install() runs. './shapes/register'
 * replaces registry.shapes, './colour-ends' adds the stroke with gradients, the ends and the colour modes.
 * Nothing else imports the parts, so adding one never touches the line modules.
 */
import './shapes/register';
import './colour-ends';
