import {
  AudienceStats,
  PlatformAudienceDefinition,
} from '../../src/store/types';

export interface AudienceSpend {
  spend: number;
  id: string;
}

export interface AudienceInfoQueryParams {
  audiencesIds: string[];
  xandrId: string;
  overNumberOfDays: number;
}

export interface AudienceQueryParams {
  audiencesIds: string[];
  accountId: string;
}

export interface AudienceInfoQueryResults {
  audiencesStats: AudienceStats[];
  audiencesSpends: AudienceSpend[];
}

export interface MatchedAudiencesInfo {
  accountId: string;
  publisherId: string;
  audienceId: string;
  pageViews: number;
  uniques: number;
  daysAgo?: number;
}

export interface MatchedAudiences extends MatchedAudiencesInfo {
  id: PlatformAudienceDefinition['id'];
  name: PlatformAudienceDefinition['name'];
  type: PlatformAudienceDefinition['type'];
  owner: PlatformAudienceDefinition['owner'];
  status: PlatformAudienceDefinition['status'];
  spend: {
    currency: string;
    value: number;
  };
}

export interface PublisherTraffic {
  day: string;
  publisherId: string;
  traffic: number;
  eligibleTraffic: number;
  adsSupported: number;
  cookiesSupported: number;
  consentGranted: number;
  spend: number;
}

export interface AudienceSpendAndImpressions {
  day: string;
  id: string;
  name: string;
  pageViews: number | null;
  impressions: number | null;
  spend: number | null;
  uniques: number | null;
}

export interface AudienceOverlap {
  name: string;
  overlap: number;
}
