const AMERICAN: Record<string, string> = { colour: 'color', centre: 'center', grey: 'gray', metre: 'meter', customis: 'customiz', behaviour: 'behavior', favourite: 'favorite', maximis: 'maximiz', minimis: 'minimiz', organis: 'organiz' };

/**
 * Search folding for pickers outside the card editor (icon library, preset grid, step picker, animation
 * library): lower case, and the British spellings read as American, so "color" finds "Colour" and the
 * reverse. Fold both the query and the text. The card editor has its own copy in src/editor/i18n.
 */
export const fold = (s: string): string => s.toLowerCase().replace(/colour|centre|grey|metre|customis|behaviour|favourite|maximis|minimis|organis/g, (w) => AMERICAN[w]);
