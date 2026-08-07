export const locales = ['pt', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt';

/** BCP-47 para <html lang> e hreflang. */
export const htmlLang: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
};

/** og:locale exige um código regional (Facebook), diferente do hreflang. */
export const ogLocale: Record<Locale, string> = {
  pt: 'pt_BR',
  en: 'en_US',
  es: 'es_ES',
};
