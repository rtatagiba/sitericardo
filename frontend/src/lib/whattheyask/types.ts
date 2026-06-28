export type Language = 'pt' | 'en' | 'es';

export type PrefixMap = Record<Language, Record<string, string[]>>;

export interface QueryItem {
  category: string;
  prefix: string;
  query: string;
}

export interface CacheEntry {
  results: Record<string, string[]>;
  timestamp: number;
}
