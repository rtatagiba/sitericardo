export const SITE_URL = 'https://ricardotatagiba.com.br';
export const SITE_NAME = 'Ricardo Tatagiba';
export const SITE_DESCRIPTION =
  'Consultor SEO Freelancer com mais de 10 anos de experiência. Ajudo empresas a crescer no Google com estratégias de SEO eficazes.';

export const AUTHOR = {
  name: 'Ricardo Tatagiba',
  email: 'contato@ricardotatagiba.com.br',
  jobTitle: 'Consultor SEO',
  knowsAbout: [
    'SEO',
    'Marketing Digital',
    'Google Ads',
    'SEO Local',
    'Otimização de Sites',
    'Análise de Palavras-chave',
  ],
  // Add public profile URLs here (LinkedIn, Instagram, YouTube…) to emit sameAs
  sameAs: [] as string[],
};

export const DEFAULT_OG_IMAGE = '/images/og-default.jpg';

/** Absolute URL from a path, using the canonical site origin. */
export function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : new URL(path, SITE_URL).href;
}
