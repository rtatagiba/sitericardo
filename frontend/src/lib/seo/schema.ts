import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, AUTHOR, absoluteUrl } from './site';

export interface BreadcrumbItem {
  name: string;
  /** Absolute or site-relative URL. Omit for the current page (last item). */
  url?: string;
}

export interface GraphOptions {
  /** Canonical URL of the current page. */
  url: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  publishDate?: Date;
  updatedDate?: Date;
  tags?: string[];
  breadcrumbs?: BreadcrumbItem[];
}

const WEBSITE_ID = `${SITE_URL}/#website`;
const PERSON_ID = `${SITE_URL}/#person`;

/**
 * Builds a linked schema.org @graph (WebSite, Person, WebPage, and for
 * articles BlogPosting + BreadcrumbList), entities connected via @id.
 */
export function buildGraph(opts: GraphOptions) {
  const {
    url,
    title,
    description,
    image,
    imageAlt,
    type = 'website',
    publishDate,
    updatedDate,
    tags,
    breadcrumbs,
  } = opts;

  const pageId = `${url}#webpage`;
  const imageUrl = image ? absoluteUrl(image) : undefined;

  const person: Record<string, unknown> = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: AUTHOR.name,
    email: AUTHOR.email,
    jobTitle: AUTHOR.jobTitle,
    url: SITE_URL,
    knowsAbout: AUTHOR.knowsAbout,
  };
  if (AUTHOR.sameAs.length > 0) person.sameAs = AUTHOR.sameAs;

  const website = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: 'pt-BR',
    publisher: { '@id': PERSON_ID },
    copyrightHolder: { '@id': PERSON_ID },
    copyrightYear: new Date().getFullYear(),
  };

  const webpage: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': pageId,
    url,
    name: title,
    description,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': WEBSITE_ID },
    author: { '@id': PERSON_ID },
  };
  if (imageUrl) {
    webpage.primaryImageOfPage = { '@id': `${url}#primaryimage` };
  }
  if (breadcrumbs?.length) {
    webpage.breadcrumb = { '@id': `${url}#breadcrumb` };
  }

  const graph: Record<string, unknown>[] = [website, person, webpage];

  if (imageUrl) {
    graph.push({
      '@type': 'ImageObject',
      '@id': `${url}#primaryimage`,
      url: imageUrl,
      contentUrl: imageUrl,
      ...(imageAlt ? { caption: imageAlt } : {}),
    });
  }

  if (breadcrumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: breadcrumbs.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.name,
        ...(crumb.url ? { item: absoluteUrl(crumb.url) } : {}),
      })),
    });
  }

  if (type === 'article') {
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: title,
      description,
      url,
      isPartOf: { '@id': pageId },
      mainEntityOfPage: { '@id': pageId },
      author: { '@id': PERSON_ID },
      publisher: { '@id': PERSON_ID },
      inLanguage: 'pt-BR',
      ...(publishDate ? { datePublished: publishDate.toISOString() } : {}),
      ...(updatedDate || publishDate
        ? { dateModified: (updatedDate ?? publishDate)!.toISOString() }
        : {}),
      ...(imageUrl ? { image: { '@id': `${url}#primaryimage` } } : {}),
      ...(tags?.length ? { keywords: tags.join(', ') } : {}),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
