/*
 * The plug-in list of the flow-look chunk: one side-effect import per part that registers itself in
 * the registry (src/flow-look/registry.ts) before install() runs. T4 adds './shapes/register'
 * (replaces registry.shapes), T5 adds './colour-ends' (stroke with gradients, ends, colour modes).
 * Nothing else imports the parts, so adding one never touches the line modules.
 */
export {};
