import { MatchedAudiences, PublisherTraffic } from '../../functions/types';

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

export interface PlatformAudienceDefinition {
  id: string;
  owner: string | 'platform';
  name: string;
  type: AudienceType;
  pausedBySellers: string[];
  status: AudienceStatus;
  deleted?: boolean;
  version?: number;
  definition: {
    ttl: number;
    lookBack: number;
    confidence: number;
  };
}

export interface AppAudienceDefinition
  extends Omit<
    PlatformAudienceDefinition,
    'pausedBySellers' | 'deleted' | 'version' | 'definition'
  > {
  ttl: number;
  lookBack: number;
  confidence: number;
}

export interface UserInfo {
  email: string;
  fullName: string;
  xandrId: string;
  accountId: string;
  isSeller: boolean;
  isBuyer: boolean;
}

export interface AccountInfo {
  orgEmailDomain: string;
  orgName: string;
  dsps: string[] | null;
  ssps: string[] | null;
  isSeller: boolean;
  isBuyer: boolean;
}

export interface RootState {
  audiencesDefinitions?: AppAudienceDefinition[];
  audiencesStats?: AudienceStats | null;
  user?: UserInfo;
  error?: {
    message: string;
  };
}

export interface MatchedAudiencesTraffic {
  pageViews: number;
  uniques: number;
  spend: number;
  impressions: number;
  daysAgo: number;
}

export type AccountIdOrgNameMap = Record<string, string>;

export type AudienceSpendRow = {
  spend: number;
  impressions: number;
  currency: string;
  audienceId: string;
  daysAgo: number;
};

export interface AudienceStats {
  id: string;
  matchedAudiences: MatchedAudiences[];
  matchedAudiencesByDays: MatchedAudiencesTraffic[];
  publisherTraffic: PublisherTraffic[];
  currency: string;
  impressions: number;
  uniqueUsers: number;
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

export type ChartSummaryStats = Record<
  string,
  { bulletClass?: string; statLabel: string }
>;

export interface IAudiencesData {
  audienceStats: AudienceStats;
  audienceSpends: AudienceSpendRow[];
  isLoadedSuccessfully: boolean;
}

export type AudiencesTableRow = {
  type: string;
  owner: string;
  name: string;
  uniqueUsers: number;
  pageViews: number;
  spend: number;
  status: string;
};
