export interface MatchedAudiences {
  accountId: string;
  publisherId: string;
  audienceId: string;
  pageViews: number;
  uniques: number;
  daysAgo?: number;
}

export interface PublisherTraffic {
  accountId: string;
  publisherId: string;
  daysAgo: number;
  traffic: number;
  eligibleTraffic: number;
  adsSupported: number;
  cookiesSupported: number;
  consentGranted: number;
  revenue: number;
}

export interface PageCrawlsStat {
  daysAgo: number;
  pagesCrawled: number;
}

export interface PageKeywordRow {
  text: string;
  count: number;
  rank: number;
}

export interface PageCrawlsRow {
  timestamp: number;
  url: string;
  pageTitle: string;
  pageKeywords: PageKeywordRow[];
}

export interface AudienceRevenueRow {
  revenue: number;
  impressions: number;
  currency: string;
  audienceId: string;
  daysAgo: number;
}

export interface AudienceInfoQueryParams {
  audiencesIds: string[];
  accountId: string;
  overNumberOfDays: number;
}
