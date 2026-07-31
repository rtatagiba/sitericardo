/**
 * Fonte única dos serviços oferecidos. Consumido pelo hero da home
 * (HeroServices.astro) e pelo JSON-LD da home.
 */

export type ServiceId = 'sites' | 'ia' | 'automacoes' | 'seo' | 'auditoria';

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

export const services: Service[] = [
  {
    id: 'sites',
    label: 'Criação de sites',
    headline: 'Sites rápidos que o Google adora',
    desc: 'Design próprio, performance de topo e estrutura pronta para ranquear desde o primeiro dia.',
    href: '/servicos',
  },
  {
    id: 'ia',
    label: 'Implementação de IA',
    headline: 'IA a trabalhar no teu negócio',
    desc: 'Assistentes, chatbots e geração de conteúdo ligados aos teus dados reais.',
    href: '/servicos',
  },
  {
    id: 'automacoes',
    label: 'Automações',
    headline: 'Menos trabalho manual, mais resultado',
    desc: 'Fluxos que capturam, qualificam e respondem a leads sozinhos, 24/7.',
    href: '/servicos',
  },
  {
    id: 'seo',
    label: 'SEO',
    headline: 'Ser a resposta, no Google e nas IAs',
    desc: 'Estratégia técnica, conteúdo e autoridade para dominar as buscas do teu setor.',
    href: '/servicos',
  },
  {
    id: 'auditoria',
    label: 'Auditoria de Sites',
    headline: 'Descobre o que trava o teu site',
    desc: 'Diagnóstico completo com plano de ação priorizado por impacto.',
    href: '/servicos',
  },
];

/** O serviço pré-selecionado ao carregar a home. */
export const defaultServiceId: ServiceId = 'sites';
