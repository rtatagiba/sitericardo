export interface SiteEntry {
  /** Raw input from the user (domain or sitemap URL) */
  input: string;
  /** Normalized hostname, used as column label */
  host: string;
  /** True for the first site (the user's own site) */
  isUser: boolean;
}

export interface SiteResult extends SiteEntry {
  urls: string[];
  error?: string;
}

export interface TopicCluster {
  id: number;
  /** Human-readable label derived from the slug tokens */
  label: string;
  tokens: Set<string>;
  /** URLs grouped by site index (same order as the input sites) */
  urlsBySite: string[][];
  /** Number of competitor sites (index > 0) that cover this topic */
  competitorCount: number;
  /** Whether the user's site (index 0) covers this topic */
  userHas: boolean;
}

export interface FetchOptions {
  maxUrls: number;
  maxChildSitemaps: number;
  timeoutMs: number;
}
