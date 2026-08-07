export interface Stat {
  value: string;
  label: string;
}

export interface QaBlock {
  question: string;
  paragraphs: [string, string];
}

export interface Dictionary {
  nav: {
    home: string;
    services: string;
    portfolio: string;
    blog: string;
    tools: string;
    about: string;
    contact: string;
  };
  footer: {
    tagline: string;
    linksHeading: string;
    contactHeading: string;
    privacyPolicy: string;
    /** Use `{year}` as placeholder. */
    copyright: string;
  };
  languageSwitcher: {
    label: string;
  };
  home: {
    meta: { title: string; description: string };
    hero: {
      eyebrow: string;
      title: string;
      subtitle: string;
      stats: [Stat, Stat, Stat];
      pillLabel: string;
      cta: string;
    };
    about: {
      eyebrow: string;
      title: string;
      paragraphs: [string, string];
      link: string;
      stats: [Stat, Stat, Stat, Stat];
    };
    faq: {
      eyebrow: string;
      title: string;
      q1: QaBlock;
      q2: QaBlock;
      q3: {
        question: string;
        subA: { heading: string; paragraphs: [string, string] };
        subB: { heading: string; paragraphs: [string, string] };
      };
    };
    blogTeaser: {
      eyebrow: string;
      title: string;
      subtitle: string;
      viewAll: string;
    };
    cta: {
      eyebrow: string;
      title: string;
      subtitle: string;
      link: string;
    };
  };
  services: {
    meta: { title: string; description: string };
    hero: { title: string; subtitle: string };
    specialties: { title: string; subtitle: string };
    list: { title: string; description: string }[];
    cta: { title: string; subtitle: string; button: string };
  };
  about: {
    meta: { title: string; description: string };
    title: string;
    intro: string;
    approach: { title: string; paragraph: string };
    experience: {
      title: string;
      /** Items may contain `**bold**` markers for the emphasized phrase. */
      items: string[];
    };
    whyWork: { title: string; paragraphs: [string, string] };
    cta: { talk: string; services: string };
  };
  contact: {
    meta: { title: string; description: string };
    title: string;
    subtitle: string;
    locationLabel: string;
    locationValue: string;
    whatsappCta: string;
    whatsappMessage: string;
  };
}
