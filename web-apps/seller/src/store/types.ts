import * as types from '../../functions/types';
import { PublisherTraffic } from '../../functions/types';

export { PublisherTraffic };

export enum AudienceType {
  IAB = 'IAB',
  BUYER = 'BUYER',
}

export enum AudienceStatus {
  READY = 'ready',
  PAUSED = 'paused',
  TRAINING = 'training',
  LIVE = 'live',
}

export interface UserInfo {
  email: string;
  fullName: string;
  orgWebsite: string;
  orgName: string;
  showCrawledFeatures: boolean;
  isIntegrationCheckSuccessful: boolean;
  isXandrIntegrationComplete: boolean;
  xandrId?: string;
  accountId: string;
}

export type AudienceRevenueRow = {
  revenue: number;
  impressions: number;
  currency: string;
  audienceId: string;
  daysAgo: number;
};

export interface MatchedAudiencesTraffic {
  pageViews: number;
  uniques: number;
  revenue: number;
  impressions: number;
  daysAgo: number;
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

export interface PageCrawls {
  crawls: PageCrawlsRow[];
  stats: PageCrawlsStat[];
}

export interface IntegrationCheckResult {
  cdnScriptAdded: boolean;
  preBidAudiencesAdded: boolean;
}

export interface Signup {
  email: string;
  password: string;
  fullName: string;
  orgWebsite: string;
}

export interface Publisher {
  apiKey: string;
  publisherId: string;
}

export type VectorQueryValue = {
  vector: number[];
  threshold: number;
  bias?: number;
};

export interface PlatformAudienceDefinition {
  id: string;
  owner: string | 'platform';
  name: string;
  type: AudienceType;
  pausedBySellers: string[];
  status: AudienceStatus;
  deleted?: boolean;
  version?: number;
}

export type AppAudienceDefinition = Omit<
  PlatformAudienceDefinition,
  'pausedBySellers' | 'deleted' | 'version'
>;

export type ChartSummaryStats = Record<string, { bulletClass?: string; statLabel: string }>;

export type SortDirection = 'asc' | 'desc';

export type SortItem = {
  sort: number;
};

export type FilterItem = {
  value: string;
  id: number;
  owner: string;
  status: string;
  checked: boolean;
  deleted: boolean;
  name: string;
};

export interface MatchedAudiences extends types.MatchedAudiences {
  id: PlatformAudienceDefinition['id'];
  name: PlatformAudienceDefinition['name'];
  type: PlatformAudienceDefinition['type'];
  owner: PlatformAudienceDefinition['owner'];
  status: PlatformAudienceDefinition['status'];
  revenue: {
    currency: string;
    value: number;
  };
}

export interface AudienceStats {
  matchedAudiences: MatchedAudiences[];
  matchedAudiencesByDays: MatchedAudiencesTraffic[];
  publisherTraffic: PublisherTraffic[];
  currency: string;
}

export interface RootState {
  user?: UserInfo;
  audiencesStats?: AudienceStats | null;
  pageCrawls?: PageCrawls;
  mobileBannerShowed: boolean;
}

export type AccountIdOrgNameMap = Record<string, string>;
