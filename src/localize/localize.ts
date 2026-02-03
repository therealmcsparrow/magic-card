import en from './translations/en.json';
import nl from './translations/nl.json';

const translations: Record<string, Record<string, unknown>> = {
  en,
  nl,
};

let currentLanguage = 'en';

export function setLanguage(lang: string): void {
  currentLanguage = translations[lang] ? lang : 'en';
}

export function localize(key: string): string {
  const parts = key.split('.');
  let current: unknown = translations[currentLanguage] || translations['en'];

  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      // Fallback to English
      current = translations['en'];
      for (const p of parts) {
        if (current && typeof current === 'object' && p in (current as Record<string, unknown>)) {
          current = (current as Record<string, unknown>)[p];
        } else {
          return key;
        }
      }
      break;
    }
  }

  return typeof current === 'string' ? current : key;
}
