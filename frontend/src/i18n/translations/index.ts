import type { Locale } from '../ui';
import type { Dictionary } from './types';
import { pt } from './pt';
import { en } from './en';
import { es } from './es';

const dictionaries: Record<Locale, Dictionary> = { pt, en, es };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}
