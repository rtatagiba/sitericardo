/**
 * Fonte única dos serviços oferecidos. Consumido pelo hero da home
 * (HeroServices.astro) e pelo JSON-LD da home.
 */
import type { Locale } from '../i18n/ui';
import { routes } from '../i18n/routes';

export type ServiceId = 'sites' | 'ia' | 'seo' | 'auditoria';

export interface Service {
  id: ServiceId;
  /** Texto da caixa de seleção no hero. */
  label: string;
  /** Título mostrado no painel visual. */
  headline: string;
  /** Uma frase de apoio. */
  desc: string;
  href: string;
}

type ServiceCopy = Record<ServiceId, Pick<Service, 'label' | 'headline' | 'desc'>>;

const copyByLocale: Record<Locale, ServiceCopy> = {
  pt: {
    sites: {
      label: 'Criação de sites',
      headline: 'Sites rápidos que o Google adora',
      desc: 'Design próprio, performance de topo e estrutura pronta para ranquear desde o primeiro dia.',
    },
    ia: {
      label: 'Implementação de IA',
      headline: 'IA a trabalhar no teu negócio',
      desc: 'Assistentes, chatbots e geração de conteúdo ligados aos teus dados reais.',
    },
    seo: {
      label: 'SEO',
      headline: 'Ser a resposta, no Google e nas IAs',
      desc: 'Estratégia técnica, conteúdo e autoridade para dominar as buscas do teu setor.',
    },
    auditoria: {
      label: 'Auditoria de Sites',
      headline: 'Descobre o que trava o teu site',
      desc: 'Diagnóstico completo com plano de ação priorizado por impacto.',
    },
  },
  en: {
    sites: {
      label: 'Website creation',
      headline: 'Fast websites Google loves',
      desc: 'Custom design, top-tier performance, and a structure built to rank from day one.',
    },
    ia: {
      label: 'AI implementation',
      headline: 'AI working for your business',
      desc: 'Assistants, chatbots, and content generation connected to your real data.',
    },
    seo: {
      label: 'SEO',
      headline: 'Be the answer, on Google and in AI',
      desc: 'Technical strategy, content, and authority to dominate search in your industry.',
    },
    auditoria: {
      label: 'Website audit',
      headline: 'Find out what is holding your site back',
      desc: 'A complete diagnosis with an action plan prioritized by impact.',
    },
  },
  es: {
    sites: {
      label: 'Creación de sitios web',
      headline: 'Sitios rápidos que Google ama',
      desc: 'Diseño propio, rendimiento de primer nivel y una estructura lista para posicionar desde el primer día.',
    },
    ia: {
      label: 'Implementación de IA',
      headline: 'IA trabajando para tu negocio',
      desc: 'Asistentes, chatbots y generación de contenido conectados a tus datos reales.',
    },
    seo: {
      label: 'SEO',
      headline: 'Sé la respuesta, en Google y en las IAs',
      desc: 'Estrategia técnica, contenido y autoridad para dominar las búsquedas de tu sector.',
    },
    auditoria: {
      label: 'Auditoría de sitios',
      headline: 'Descubre qué está frenando tu sitio',
      desc: 'Diagnóstico completo con un plan de acción priorizado por impacto.',
    },
  },
};

const ids: ServiceId[] = ['sites', 'ia', 'seo', 'auditoria'];

export function getServices(lang: Locale): Service[] {
  const copy = copyByLocale[lang];
  return ids.map((id) => ({ id, href: routes.services[lang], ...copy[id] }));
}

/** O serviço pré-selecionado ao carregar a home. */
export const defaultServiceId: ServiceId = 'sites';
