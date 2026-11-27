const raw = Number(process.env['MC_TEST_LOAD_FACTOR']);

/* Multiplier for wall-clock budgets and waits in tests; set MC_TEST_LOAD_FACTOR to widen it on a busy machine. */
export const LOAD_FACTOR = Number.isFinite(raw) && raw > 0 ? raw : 5;

export const budget = (ms: number): number => ms * LOAD_FACTOR;
