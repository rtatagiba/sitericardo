import type { Locale } from './ui';

/**
 * Fonte única das URLs por idioma para as páginas traduzidas. Usado pelo
 * hreflang (BaseLayout), pela Navbar/Footer e pelo LanguageSwitcher.
 */
export const routes = {
  home: { pt: '/', en: '/en', es: '/es' },
  services: { pt: '/servicos', en: '/en/services', es: '/es/servicios' },
  about: { pt: '/sobre', en: '/en/about', es: '/es/sobre-mi' },
  contact: { pt: '/contato', en: '/en/contact', es: '/es/contacto' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;
