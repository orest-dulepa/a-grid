import { ReturnResult } from '@/types';
import {
  AccountIdOrgNameMap,
  AppAudienceDefinition,
  AudienceSpendRow,
  AudienceStats,
  MatchedAudiencesTraffic,
  PublisherTraffic,
} from '@/store/types';
import { MatchedAudiences } from '../../../functions/types';
import { NUMBER_OF_DAYS } from '@/store/values';

export const successResponse = <T>(
  message: string,
  data?: T
): ReturnResult<T> => {
  return { type: 'success', message, data };
};

export const errorResponse = (
  message: string,
  code?: string
): ReturnResult<undefined> => {
  return { type: 'error', message, code, data: undefined };
};

export const isAudienceStatsMissingRecentTraffic = (
  audienceStats: AudienceStats | undefined,
  daysForCheck: number
): boolean => {
  if (typeof audienceStats === 'undefined') {
    return false;
  }

  const { publisherTraffic } = audienceStats;

  const lastDaysTraffic = publisherTraffic.reduce((a, traffic) => {
    return a + (traffic.daysAgo <= daysForCheck ? traffic.traffic : 0);
  }, 0);
  const totalTraffic = publisherTraffic.reduce((a, traffic) => {
    return a + traffic.traffic;
  }, 0);
  return lastDaysTraffic === 0 && totalTraffic !== 0;
};

export const formatOverviewStats = (
  orgNamesByOwner: AccountIdOrgNameMap,
  audienceDefinitions: AppAudienceDefinition[],
  audienceStats: AudienceStats,
  audienceSpends: AudienceSpendRow[]
): AudienceStats => {
  const audienceDefinitionsById = audienceDefinitions.reduce(
    (
      acc: Record<string, AppAudienceDefinition>,
      audience: AppAudienceDefinition
    ) => {
      return {
        ...acc,
        [audience.id]: {
          id: audience.id,
          status: audience.status,
          name: audience.name,
          type: audience.type,
          owner: orgNamesByOwner[audience.owner],
        },
      };
    },
    {}
  );

  const audienceSpendsByAudienceId = audienceSpends.reduce(
    (acc: Record<string, number>, spend: AudienceSpendRow) => {
      return {
        ...acc,
        [spend.audienceId]: (acc[spend.audienceId] || 0) + spend.spend,
      };
    },
    {}
  );

  const matchedAudiencesByAudienceId = audienceStats.matchedAudiences.reduce(
    (acc: Record<string, MatchedAudiences>, audience: MatchedAudiences) => {
      const matchedAudienceValues = acc[audience.audienceId] || {
        pageViews: 0,
        uniques: 0,
      };
      const audienceDefinition = audienceDefinitionsById[audience.audienceId];
      return {
        ...acc,
        [audience.audienceId]: {
          ...audience,
          ...audienceDefinition,
          pageViews: matchedAudienceValues.pageViews + audience.pageViews,
          uniques: matchedAudienceValues.uniques + audience.uniques,
          spend: {
            value: audienceSpendsByAudienceId[audience.audienceId] || 0,
            currency: '$',
          },
        },
      };
    },
    {}
  );

  const audienceSpendsByDaysAgo = audienceSpends.reduce(
    (
      acc: Record<number, { spend: number; impressions: number }>,
      spend: AudienceSpendRow
    ) => {
      const daySpend = acc[spend.daysAgo] || {
        spend: 0,
        impressions: 0,
      };
      return {
        ...acc,
        [spend.daysAgo]: {
          spend: spend.spend + spend.spend,
          impressions: spend.impressions + spend.impressions,
        },
      };
    },
    {}
  );

  const matchedAudiencesStats = audienceDefinitions.map(
    (audience: AppAudienceDefinition) => {
      return {
        ...audience,
        ...(matchedAudiencesByAudienceId[audience.id] || {
          pageViews: 0,
          uniques: 0,
          impressions: 0,
          spend: {
            value: audienceSpendsByAudienceId[audience.id] || 0,
            currency: '$',
          },
          ...audienceDefinitionsById[audience.id],
        }),
      };
    }
  );

  const matchedAudiencesStatsByDaysAgo = audienceStats.matchedAudiences.reduce(
    (
      acc: Record<string, MatchedAudiencesTraffic>,
      audience: MatchedAudiences
    ) => {
      if (audience.daysAgo === undefined) return acc;
      const matchedAudienceForDay = acc[audience.daysAgo] || {
        pageViews: 0,
        uniques: 0,
      };

      return {
        ...acc,
        [audience.daysAgo]: {
          pageViews: matchedAudienceForDay.pageViews + audience.pageViews,
          uniques: matchedAudienceForDay.uniques + audience.uniques,
          spend: audienceSpendsByDaysAgo[audience.daysAgo]?.spend || 0,
          impressions:
            audienceSpendsByDaysAgo[audience.daysAgo]?.impressions || 0,
          daysAgo: audience.daysAgo,
        },
      };
    },
    {}
  );

  const matchedAudiencesStatsByDays = new Array(NUMBER_OF_DAYS)
    .fill(null)
    .map((_, index) => {
      const emptyMatchedAudiences: MatchedAudiencesTraffic = {
        pageViews: 0,
        uniques: 0,
        spend: 0,
        impressions: 0,
        daysAgo: index,
      };
      return matchedAudiencesStatsByDaysAgo[index] || emptyMatchedAudiences;
    })
    .sort((a, b) => {
      return b.daysAgo - a.daysAgo;
    });

  const publisherTrafficByDayAgo = audienceStats.publisherTraffic.reduce(
    (acc: Record<number, PublisherTraffic>, traffic: PublisherTraffic) => {
      return { ...acc, [traffic.daysAgo]: traffic };
    },
    {}
  );

  const publisherTrafficByDay = new Array(NUMBER_OF_DAYS)
    .fill(null)
    .map((_, index) => {
      return (
        publisherTrafficByDayAgo[index] || {
          publisherId: '',
          accountId: '',
          spend: 0,
          daysAgo: index,
          traffic: 0,
          eligibleTraffic: 0,
          adsSupported: 0,
          cookiesSupported: 0,
          consentGranted: 0,
        }
      );
    });

  const publisherTraffic: PublisherTraffic[] = publisherTrafficByDay
    .map((traffic: PublisherTraffic) => {
      return {
        ...traffic,
        spend: audienceSpendsByDaysAgo[traffic.daysAgo]?.spend || 0,
      };
    })
    .sort((a, b) => {
      return b.daysAgo - a.daysAgo;
    });

  return {
    id: '',
    matchedAudiences: matchedAudiencesStats,
    matchedAudiencesByDays: matchedAudiencesStatsByDays,
    publisherTraffic,
    currency: '$',
    impressions: 0,
    uniqueUsers: 0,
  };
};
