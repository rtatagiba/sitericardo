import type { Dictionary } from './types';

export const es = {
  nav: {
    home: 'Inicio',
    services: 'Servicios',
    portfolio: 'Portafolio',
    blog: 'Blog',
    tools: 'Herramientas',
    about: 'Sobre mí',
    contact: 'Contacto',
  },
  footer: {
    tagline: 'Consultor freelance con más de 12 años de experiencia: sitios web, IA, automatizaciones y SEO.',
    linksHeading: 'Enlaces',
    contactHeading: 'Contacto',
    privacyPolicy: 'Política de Privacidad',
    copyright: '© {year} Ricardo Tatagiba. Todos los derechos reservados.',
  },
  languageSwitcher: {
    label: 'Idioma',
  },
  home: {
    meta: {
      title: 'Ricardo Tatagiba — Sitios web, IA, Automatizaciones y SEO',
      description:
        'Consultor freelance con más de 12 años de experiencia: creación de sitios web, implementación de IA, automatizaciones y SEO para hacer crecer tu negocio en Google.',
    },
    hero: {
      eyebrow: '// Qué hago',
      title: 'Sé la marca que tus clientes encuentran primero',
      subtitle: 'Consultor de SEO, 12 años de experiencia, ayudando a empresas a posicionarse en Google y en las IAs.',
      stats: [
        { value: '300+', label: 'Sitios entregados' },
        { value: '12+', label: 'Años de experiencia' },
        { value: '5', label: 'Frentes integrados' },
      ],
      pillLabel: '¿Qué te gustaría hacer?',
      cta: 'Agendar una reunión',
    },
    about: {
      eyebrow: '// Quién soy',
      title: 'Ricardo Tatagiba',
      paragraphs: [
        'Consultor freelance con más de 12 años de experiencia, trabajando con empresas que quieren crecer en Google — y ahora también en las respuestas de las IAs — sin depender solo de anuncios pagados.',
        'Combino SEO técnico con desarrollo full stack y automatizaciones, lo que significa que no solo identifico el problema: implemento la solución. Sin intermediarios, sin informes genéricos — cada proyecto recibe atención directa y una estrategia pensada para tu negocio.',
      ],
      link: 'Conocer mi trayectoria',
      stats: [
        { value: '12+', label: 'Años de experiencia' },
        { value: '300+', label: 'Sitios entregados' },
        { value: '100%', label: 'Trato directo conmigo, sin intermediarios' },
        { value: '5', label: 'Frentes integrados: sitio, SEO, IA, automatizaciones y ads' },
      ],
    },
    faq: {
      eyebrow: '// Preguntas frecuentes',
      title: 'Consultoría de SEO, en detalle',
      q1: {
        question: '¿Qué es la consultoría de SEO?',
        paragraphs: [
          'La consultoría de SEO es el servicio de analizar, planificar e implementar todo lo que hace que un sitio web aparezca mejor en Google y, cada vez más, en las respuestas de herramientas como ChatGPT y Gemini. Cubre la parte técnica (velocidad, indexación, estructura), la de contenido (qué escribir y cómo) y la de autoridad (quién habla de tu negocio en línea).',
          'Y no se trata solo del Google de hoy: cada vez más gente le pregunta primero a la IA antes de abrir un sitio web, y esas respuestas solo citan empresas que ya tienen autoridad y contenido estructurado en línea. Invertir en SEO ahora es garantizar que la IA encuentre y cite a tu negocio, y no al de la competencia.',
        ],
      },
      q2: {
        question: '¿Qué hace un consultor de SEO?',
        paragraphs: [
          'Audita el sitio en busca de errores técnicos que bloquean el rastreo de Google, define la estructura de contenido en torno a las preguntas que realmente hacen tus clientes, y monitorea a la competencia para saber dónde está ganando terreno.',
          'También mide resultados con datos reales — tráfico orgánico, posiciones, clics — en lugar de informes genéricos que no dicen nada sobre el negocio. Al final, entrega acciones concretas: qué cambiar en el sitio, qué contenido publicar, qué problema técnico corregir primero.',
        ],
      },
      q3: {
        question: '¿Consultor freelance o agencia de SEO?',
        subA: {
          heading: 'Por qué un consultor',
          paragraphs: [
            'Una agencia normalmente distribuye tu cuenta entre varios analistas junior, gestionados por un account manager que nunca toca el código ni el contenido directamente.',
            'Con un consultor freelance trabajando solo, es la misma persona quien analiza el problema, escribe el contenido e implementa la corrección técnica — sin pasar por tres capas de comunicación antes de que el cambio ocurra.',
          ],
        },
        subB: {
          heading: 'Ventajas frente a una agencia',
          paragraphs: [
            'Costo más bajo, porque no pagas la estructura de oficina, comercial y account managers que una agencia tiene que incluir en el precio.',
            'Comunicación directa — siempre hablas con quien hace el trabajo, nunca con un intermediario que transmite el mensaje. Y flexibilidad: se ajustan prioridades en una conversación, sin reunión programada ni aprobación de alcance.',
          ],
        },
      },
    },
    blogTeaser: {
      eyebrow: '// Últimos artículos',
      title: 'Artículos recientes',
      subtitle: 'Contenido práctico sobre SEO, marketing digital y visibilidad en línea.',
      viewAll: 'Ver todos los artículos',
    },
    cta: {
      eyebrow: '// Próximo paso',
      title: '¿Listo para dar el próximo paso?',
      subtitle: 'Hablemos sobre tu negocio y cómo puedo ayudarte con tu sitio web, automatización, IA o SEO.',
      link: 'Ponerse en contacto',
    },
  },
  services: {
    meta: {
      title: 'Servicios de SEO — Ricardo Tatagiba',
      description:
        'Pon más de 10 años de experiencia en SEO y desarrollo full stack a favor de tu negocio. SEO estratégico, local, Google Ads, contenido y automatización con IA.',
    },
    hero: {
      title: 'Marketing Full-Stack',
      subtitle:
        'Pon más de 10 años de experiencia en SEO y desarrollo full stack a favor de tu negocio. Optimiza procesos internos, acelera tus pruebas y reduce costos — todo mientras escalas tus resultados de forma sostenible.',
    },
    specialties: {
      title: 'Especialidades',
      subtitle: 'Las herramientas más importantes, todo simple y directo al grano.',
    },
    list: [
      {
        title: 'SEO Estratégico',
        description:
          'Auditoría completa más un plan de acción personalizado. Análisis técnico, de contenido y de autoridad para identificar oportunidades y eliminar los bloqueos que impiden que tu sitio se posicione.',
      },
      {
        title: 'SEO Local',
        description:
          'Domina tu región. Optimización de Google My Business, creación de señales locales y estrategia de palabras clave geolocalizadas para aparecer cuando tus clientes buscan cerca de ti.',
      },
      {
        title: 'Google Ads',
        description:
          'Campañas pagadas que convierten. Google Ads es una herramienta de vital importancia en la estrategia de visibilidad — a través de ella, los clientes potenciales acceden rápido a tu sitio en el momento justo.',
      },
      {
        title: 'Google My Business',
        description:
          'Fundamental para dominar tu región. GMB es un aliado clave para ganar más visitas de todos los que buscan un servicio en tu zona de alcance.',
      },
      {
        title: 'Creación de Contenido SEO',
        description:
          'Contenido que posiciona y convierte. Artículos, páginas de servicio y landing pages optimizadas para palabras clave con intención de compra, escritas para personas pero que Google ama.',
      },
      {
        title: 'Automatización con IA',
        description:
          'Escala sin aumentar costos. Creación de flujos automatizados con IA para atención al cliente, calificación de leads y distribución de contenido — tu empresa puede funcionar incluso cuando no estás disponible.',
      },
      {
        title: 'Redes Sociales',
        description:
          'Aparece ante quienes importan. Estrategia de presencia social enfocada en segmentación precisa — desde personas que trabajan o viven cerca de ti hasta quienes necesitan saber que tienes la solución.',
      },
      {
        title: 'Marketing Full-Stack',
        description:
          'Pon más de 10 años de experiencia en SEO y desarrollo full stack a favor de tu negocio. Optimiza procesos internos, acelera tus pruebas y reduce costos mientras escalas tus resultados.',
      },
    ],
    cta: {
      title: '¿Listo para empezar?',
      subtitle: 'Cada proyecto es único. Hablemos sobre tus objetivos y creemos una estrategia personalizada.',
      button: 'Solicitar propuesta',
    },
  },
  about: {
    meta: {
      title: 'Sobre mí — Ricardo Tatagiba',
      description:
        'Conoce a Ricardo Tatagiba, consultor freelance de SEO con más de 10 años de experiencia en SEO y desarrollo full stack. Especialista en crecimiento orgánico para empresas.',
    },
    title: 'Sobre mí',
    intro:
      'Soy Ricardo Tatagiba, consultor freelance de SEO con más de 10 años de experiencia en SEO y desarrollo full stack. Trabajo con empresas que quieren crecer en Google de forma sostenible — sin depender exclusivamente de anuncios pagados.',
    approach: {
      title: 'Mi enfoque',
      paragraph:
        'Creo que un SEO eficaz va más allá de las palabras clave y las meta tags. Implica entender a fondo el negocio del cliente, su mercado y sus clientes. Por eso combino un análisis técnico riguroso con estrategia de contenido y datos de comportamiento del usuario para crear planes que realmente funcionan.',
    },
    experience: {
      title: 'Experiencia',
      items: [
        '**Más de 10 años** de experiencia en SEO y marketing digital',
        'Especialista en **SEO local** para pequeñas y medianas empresas',
        'Experiencia en **desarrollo full stack** — entiendo el lado técnico de tu sitio',
        'Trabajo con empresas de los sectores de turismo, hotelería, servicios locales y e-commerce',
        'Certificado por Google y con experiencia en herramientas como Search Console, Semrush y Ahrefs',
      ],
    },
    whyWork: {
      title: '¿Por qué trabajar conmigo?',
      paragraphs: [
        'Como freelance, tienes acceso directo a mí en todo momento — sin intermediarios, sin informes genéricos. Cada proyecto recibe atención personalizada y estrategias desarrolladas específicamente para tu negocio.',
        'Al combinar conocimiento técnico de SEO con habilidades de desarrollo, no solo identifico problemas sino que también implemento las soluciones — lo que agiliza los resultados y reduce costos.',
      ],
    },
    cta: { talk: 'Hablar conmigo', services: 'Ver servicios' },
  },
  contact: {
    meta: {
      title: 'Contacto — Ricardo Tatagiba',
      description:
        'Ponte en contacto con Ricardo Tatagiba para hablar de tu proyecto de SEO. Consultor freelance de SEO disponible en Lisboa, Portugal.',
    },
    title: '¿Hablamos?',
    subtitle:
      'Si quieres aumentar la visibilidad de tu negocio en Google y atraer más clientes de forma orgánica, estoy aquí para ayudarte. Escríbeme por WhatsApp.',
    locationLabel: 'Ubicación',
    locationValue: 'Lisboa, Portugal',
    whatsappCta: 'Hablar por WhatsApp',
    whatsappMessage: 'Hola, quería saber más información sobre SEO y creación de sitios web',
  },
  blogIndex: {
    title: 'Blog',
    subtitle: 'Contenido práctico sobre SEO, marketing digital y estrategias para crecer en Google.',
    readArticle: 'Leer artículo',
  },
  blogPost: {
    by: 'Por',
    category: 'Categoría',
    published: 'Publicado',
    updated: 'Actualizado',
    readingTime: 'Lectura',
    readNext: 'Sigue leyendo',
    backToBlog: 'Volver al Blog',
    toc: 'Sumario',
    articleInfo: 'Ficha del artículo',
  },
} satisfies Dictionary;
