import type { Dictionary } from './types';

export const en = {
  nav: {
    home: 'Home',
    services: 'Services',
    portfolio: 'Portfolio',
    blog: 'Blog',
    tools: 'Tools',
    about: 'About',
    contact: 'Contact',
  },
  footer: {
    tagline: 'Freelance consultant with 12+ years of experience: websites, AI, automation, and SEO.',
    linksHeading: 'Links',
    contactHeading: 'Contact',
    privacyPolicy: 'Privacy Policy',
    copyright: '© {year} Ricardo Tatagiba. All rights reserved.',
  },
  languageSwitcher: {
    label: 'Language',
  },
  home: {
    meta: {
      title: 'Ricardo Tatagiba — Websites, AI, Automation and SEO',
      description:
        'Freelance consultant with 12+ years of experience: website creation, AI implementation, automation, and SEO to grow your business on Google.',
    },
    hero: {
      eyebrow: '// What I do',
      title: 'Be the brand your customers find first',
      subtitle: 'SEO consultant, 12 years of experience, helping businesses rank on Google and in AI.',
      stats: [
        { value: '300+', label: 'Websites delivered' },
        { value: '12+', label: 'Years of experience' },
        { value: '5', label: 'Integrated disciplines' },
      ],
      pillLabel: 'What would you like to do?',
      cta: 'Book a meeting',
    },
    about: {
      eyebrow: '// Who I am',
      title: 'Ricardo Tatagiba',
      paragraphs: [
        'Freelance consultant with 12+ years of experience, working with businesses that want to grow on Google — and now in AI answers too — without relying solely on paid ads.',
        "I combine technical SEO with full-stack development and automation, which means I don't just diagnose the problem: I build the solution. No middlemen, no generic reports — every project gets direct attention and a strategy built for your business.",
      ],
      link: 'See my background',
      stats: [
        { value: '12+', label: 'Years of experience' },
        { value: '300+', label: 'Websites delivered' },
        { value: '100%', label: 'Direct with me, no middlemen' },
        { value: '5', label: 'Integrated disciplines: website, SEO, AI, automation and ads' },
      ],
    },
    faq: {
      eyebrow: '// Frequently asked questions',
      title: 'SEO consulting, in detail',
      q1: {
        question: 'What is SEO consulting?',
        paragraphs: [
          'SEO consulting is the service of analyzing, planning, and implementing everything that makes a website rank better on Google and, increasingly, appear in answers from tools like ChatGPT and Gemini. It covers the technical side (speed, indexing, structure), content (what to write and how), and authority (who talks about your business online).',
          "And it's not just about today's Google: more people are asking AI before ever opening a website, and those answers only cite businesses that already have authority and structured content online. Investing in SEO now means making sure AI finds and cites your business — not the competitor next door.",
        ],
      },
      q2: {
        question: 'What does an SEO consultant do?',
        paragraphs: [
          'Audits the site for technical errors that block Google from crawling it, defines a content structure around the questions your customers actually ask, and tracks competitors to see where they are gaining ground.',
          'Also measures results with real data — organic traffic, rankings, clicks — instead of generic reports that say nothing about the business. In the end, it delivers concrete actions: what to change on the site, what content to publish, which technical issue to fix first.',
        ],
      },
      q3: {
        question: 'Freelance consultant or SEO agency?',
        subA: {
          heading: 'Why a consultant',
          paragraphs: [
            'An agency usually spreads your account across several junior analysts, managed by an account manager who never touches the code or the content directly.',
            "With a freelance consultant working solo, it's the same person who analyzes the problem, writes the content, and implements the technical fix — without going through three layers of communication before a change happens.",
          ],
        },
        subB: {
          heading: 'Advantages over an agency',
          paragraphs: [
            "Lower cost, because you're not paying for the office structure, sales team, and account managers an agency has to build into its price.",
            'Direct communication — you always talk to the person doing the work, never a middleman relaying the message. And flexibility: priorities shift in a conversation, no scheduled meeting or scope approval needed.',
          ],
        },
      },
    },
    blogTeaser: {
      eyebrow: '// Latest articles',
      title: 'Recent articles',
      subtitle: 'Practical content about SEO, digital marketing, and online visibility.',
      viewAll: 'View all articles',
    },
    cta: {
      eyebrow: '// Next step',
      title: 'Ready to take the next step?',
      subtitle: "Let's talk about your business and how I can help with your website, automation, AI, or SEO.",
      link: 'Get in touch',
    },
  },
  services: {
    meta: {
      title: 'SEO Services — Ricardo Tatagiba',
      description:
        'Put 10+ years of SEO and full-stack development experience to work for your business. Strategic SEO, local SEO, Google Ads, content, and AI automation.',
    },
    hero: {
      title: 'Full-Stack Marketing',
      subtitle:
        'Put 10+ years of SEO and full-stack development experience to work for your business. Streamline internal processes, speed up your testing, and cut costs — all while scaling your results sustainably.',
    },
    specialties: {
      title: 'Specialties',
      subtitle: 'The tools that matter most, lean and straight to the point.',
    },
    list: [
      {
        title: 'Strategic SEO',
        description:
          'A complete audit plus a custom action plan. Technical, content, and authority analysis to find opportunities and remove the blockers keeping your site from ranking.',
      },
      {
        title: 'Local SEO',
        description:
          'Own your region. Google My Business optimization, local signal building, and geo-specific keyword strategy so you show up when customers search nearby.',
      },
      {
        title: 'Google Ads',
        description:
          'Paid campaigns that convert. Google Ads is a vital tool in your visibility strategy — it puts potential customers on your site fast, at the right moment.',
      },
      {
        title: 'Google My Business',
        description:
          'Essential for owning your region. GMB is a key ally for winning more visits from everyone searching for a service in your area.',
      },
      {
        title: 'SEO Content Creation',
        description:
          'Content that ranks and converts. Articles, service pages, and landing pages optimized for buyer-intent keywords, written for humans but loved by Google.',
      },
      {
        title: 'AI Automation',
        description:
          'Scale without raising costs. Automated AI workflows for customer service, lead qualification, and content distribution — your business can run even when you are not available.',
      },
      {
        title: 'Social Media',
        description:
          'Show up for the people who matter. A social presence strategy built on precise targeting — from people who work or live nearby to those who need to know you have the solution.',
      },
      {
        title: 'Full-Stack Marketing',
        description:
          'Put 10+ years of SEO and full-stack development experience to work for your business. Streamline internal processes, speed up your testing, and cut costs while scaling your results.',
      },
    ],
    cta: {
      title: 'Ready to get started?',
      subtitle: "Every project is unique. Let's talk about your goals and build a strategy made for you.",
      button: 'Request a proposal',
    },
  },
  about: {
    meta: {
      title: 'About — Ricardo Tatagiba',
      description:
        'Meet Ricardo Tatagiba, a freelance SEO consultant with 10+ years of experience in SEO and full-stack development. Specialist in organic growth for businesses.',
    },
    title: 'About me',
    intro:
      "I'm Ricardo Tatagiba, a freelance SEO consultant with 10+ years of experience in SEO and full-stack development. I work with businesses that want to grow on Google sustainably — without relying exclusively on paid ads.",
    approach: {
      title: 'My approach',
      paragraph:
        "I believe effective SEO goes beyond keywords and meta tags. It means deeply understanding the client's business, market, and customers. That's why I combine rigorous technical analysis with content strategy and user-behavior data to build plans that actually work.",
    },
    experience: {
      title: 'Experience',
      items: [
        '**10+ years** of experience in SEO and digital marketing',
        'Specialist in **local SEO** for small and medium businesses',
        'Experience in **full-stack development** — I understand the technical side of your site',
        'I work with businesses in tourism, hospitality, local services, and e-commerce',
        'Google-certified, with experience in tools like Search Console, Semrush, and Ahrefs',
      ],
    },
    whyWork: {
      title: 'Why work with me?',
      paragraphs: [
        'As a freelancer, you have direct access to me at all times — no middlemen, no generic reports. Every project gets personalized attention and strategies built specifically for your business.',
        'By combining technical SEO knowledge with development skills, I can not only spot problems but also implement the solutions — which speeds up results and cuts costs.',
      ],
    },
    cta: { talk: 'Talk to me', services: 'View services' },
  },
  contact: {
    meta: {
      title: 'Contact — Ricardo Tatagiba',
      description:
        'Get in touch with Ricardo Tatagiba to discuss your SEO project. Freelance SEO consultant available in Lisbon, Portugal.',
    },
    title: "Let's talk?",
    subtitle:
      "If you want to boost your business's visibility on Google and attract more customers organically, I'm here to help. Message me on WhatsApp.",
    locationLabel: 'Location',
    locationValue: 'Lisbon, Portugal',
    whatsappCta: 'Chat on WhatsApp',
    whatsappMessage: "Hi, I'd like to know more about SEO and website creation",
  },
} satisfies Dictionary;
