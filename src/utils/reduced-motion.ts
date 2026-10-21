/** The viewer asks for less motion (prefers-reduced-motion). Plain code: the card, the pause strip and the sequence player share it. */
export const reducedMotion = (): boolean => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
