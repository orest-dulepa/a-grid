import {
  AppAudienceDefinition,
  AudienceStatus,
  AudienceStats,
  MatchedAudiences,
  PublisherTraffic,
  AudienceRevenueRow,
  RootState,
  MatchedAudiencesTraffic,
  AccountIdOrgNameMap,
} from '@/store/types';
import * as api from '@/store/api';
import { ActionTree, createNamespacedHelpers, GetterTree, Module, MutationTree } from 'vuex';
import {
  getAudienceDefinitions,
  getAudienceStats,
  getRevenueByAudienceId,
  getOrgNamesByOwner,
} from '@/store/api';
import { ActionTypes } from '@/store/actions';
import { GetterTypes } from '@/store/getters';
import { MutationTypes } from '@/store/mutations';
import ResponseHandler from '@/utils/response-handler';
import { deduplicateArray } from '@/utils';
import { NAMESPACE as AUTH_NAMESPACE } from '@/store/modules/auth';

const NAMESPACE = 'audienceStat';
const OVER_NUMBER_OF_DAYS = 30;

interface State {
  audienceStats?: AudienceStats | null;
  totalRevenue?: number;
  isLoading: boolean;
  isLoadedSuccessfully: boolean;
  liveAudienceCount: number;
}

const getLiveAudiencesCount = (audienceDefinitions: AppAudienceDefinition[]): number => {
  return audienceDefinitions.reduce((a, audienceDefinition) => {
    if (audienceDefinition.status === AudienceStatus.LIVE) {
      return a + 1;
    }
    return a;
  }, 0);
};

const getTotalRevenue = (audienceRevenues?: AudienceRevenueRow[]): number => {
  if (audienceRevenues === undefined) {
    return 0;
  }
  return audienceRevenues.reduce((a, audienceRevenueRow: AudienceRevenueRow) => {
    return a + audienceRevenueRow.revenue;
  }, 0);
};

const formatAudienceStats = (
  orgNamesByOwner: AccountIdOrgNameMap,
  audienceDefinitions: AppAudienceDefinition[],
  audienceStats: AudienceStats,
  audienceRevenues: AudienceRevenueRow[]
): AudienceStats => {
  const audienceDefinitionsById = audienceDefinitions.reduce(
    (acc: Record<string, AppAudienceDefinition>, audience: AppAudienceDefinition) => {
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

  const audienceRevenuesByAudienceId = audienceRevenues.reduce(
    (acc: Record<string, number>, revenue: AudienceRevenueRow) => {
      return {
        ...acc,
        [revenue.audienceId]: (acc[revenue.audienceId] || 0) + revenue.revenue,
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
          revenue: {
            value: audienceRevenuesByAudienceId[audience.audienceId] || 0,
            currency: '$',
          },
        },
      };
    },
    {}
  );

  const audienceRevenuesByDaysAgo = audienceRevenues.reduce(
    (
      acc: Record<number, { revenue: number; impressions: number }>,
      revenue: AudienceRevenueRow
    ) => {
      const dayRevenue = acc[revenue.daysAgo] || {
        revenue: 0,
        impressions: 0,
      };
      return {
        ...acc,
        [revenue.daysAgo]: {
          revenue: dayRevenue.revenue + revenue.revenue,
          impressions: dayRevenue.impressions + revenue.impressions,
        },
      };
    },
    {}
  );

  const matchedAudiencesStats = audienceDefinitions.map((audience: AppAudienceDefinition) => {
    return {
      ...audience,
      ...(matchedAudiencesByAudienceId[audience.id] || {
        pageViews: 0,
        uniques: 0,
        impressions: 0,
        revenue: {
          value: audienceRevenuesByAudienceId[audience.id] || 0,
          currency: '$',
        },
        ...audienceDefinitionsById[audience.id],
      }),
    };
  });

  const matchedAudiencesStatsByDaysAgo = audienceStats.matchedAudiences.reduce(
    (acc: Record<string, MatchedAudiencesTraffic>, audience: MatchedAudiences) => {
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
          revenue: audienceRevenuesByDaysAgo[audience.daysAgo]?.revenue || 0,
          impressions: audienceRevenuesByDaysAgo[audience.daysAgo]?.impressions || 0,
          daysAgo: audience.daysAgo,
        },
      };
    },
    {}
  );

  const matchedAudiencesStatsByDays = new Array(OVER_NUMBER_OF_DAYS)
    .fill(null)
    .map((_, index) => {
      const emptyMatchedAudiences: MatchedAudiencesTraffic = {
        pageViews: 0,
        uniques: 0,
        revenue: 0,
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

  const publisherTrafficByDay = new Array(OVER_NUMBER_OF_DAYS).fill(null).map((_, index) => {
    return (
      publisherTrafficByDayAgo[index] || {
        publisherId: '',
        accountId: '',
        revenue: 0,
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
        revenue: audienceRevenuesByDaysAgo[traffic.daysAgo]?.revenue || 0,
      };
    })
    .sort((a, b) => {
      return b.daysAgo - a.daysAgo;
    });

  return {
    matchedAudiences: matchedAudiencesStats,
    matchedAudiencesByDays: matchedAudiencesStatsByDays,
    publisherTraffic,
    currency: '$',
  };
};

const mutations: MutationTree<State> = {
  [MutationTypes.SET_AUDIENCE_STATS](state, { audienceStats, isLoadedSuccessfully }) {
    state.audienceStats = audienceStats;
    state.isLoadedSuccessfully = isLoadedSuccessfully;
    state.isLoading = false;
  },
  [MutationTypes.CLEAR_AUDIENCE_STATS](state) {
    state.isLoading = true;
    state.isLoadedSuccessfully = false;
    state.audienceStats = undefined;
    state.liveAudienceCount = 0;
  },
  [MutationTypes.SET_LIVE_AUDIENCE_COUNT](state, liveAudienceCount) {
    state.liveAudienceCount = liveAudienceCount;
  },
  [MutationTypes.SET_AUDIENCE_TOTAL_REVENUE](state, totalRevenue: number) {
    state.totalRevenue = totalRevenue;
  },
  [MutationTypes.SET_AUDIENCE_STATUS](state, { id, status }) {
    if (state.audienceStats?.matchedAudiences) {
      const audienceIndex = state.audienceStats.matchedAudiences.findIndex(
        (audience) => audience.id === id
      );
      if (audienceIndex !== -1) {
        state.audienceStats.matchedAudiences[audienceIndex].status = status;
      }
    }
  },
};

const actions: ActionTree<State, RootState> = {
  [ActionTypes.SET_AUDIENCE_STATUS.replace(`${NAMESPACE}/`, '')]({ commit }, { id, status }) {
    commit(MutationTypes.SET_AUDIENCE_STATUS, { id, status });
  },
  [ActionTypes.CLEAR_AUDIENCE_STATS.replace(`${NAMESPACE}/`, '')]({ commit }) {
    commit(MutationTypes.CLEAR_AUDIENCE_STATS);
  },
  async [ActionTypes.SET_AUDIENCE_STATS.replace(`${NAMESPACE}/`, '')]({
    state,
    commit,
    rootGetters,
  }) {
    if (!(await api.isLoggedIn())) {
      return;
    }

    if (state.audienceStats !== undefined) {
      return;
    }

    const { accountId, xandrId, isIntegrationCheckSuccessful } = rootGetters[
      `${AUTH_NAMESPACE}/${GetterTypes.GET_USER}`
    ];

    const audienceDefinitionsResult = await getAudienceDefinitions(accountId);
    let audienceDefinitions = audienceDefinitionsResult.data || [];
    if (!isIntegrationCheckSuccessful) {
      audienceDefinitions = audienceDefinitions.map((audienceDefinition) => ({
        ...audienceDefinition,
        status: AudienceStatus.PAUSED,
      }));
    }
    const audiencesIds = audienceDefinitions.map((audience) => audience.id);
    const audienceOwners = deduplicateArray(
      audienceDefinitions.map((audience) => audience.owner).filter((i) => i !== undefined)
    ) as string[];

    const [audienceStatsResult, audienceRevenues, orgNames] = await Promise.all([
      getAudienceStats({
        audiencesIds,
        accountId: accountId || '',
        overNumberOfDays: OVER_NUMBER_OF_DAYS,
      }),
      getRevenueByAudienceId({
        audiencesIds,
        xandrId: xandrId || '',
        overNumberOfDays: OVER_NUMBER_OF_DAYS,
      }),
      getOrgNamesByOwner(audienceOwners),
    ]);

    commit(MutationTypes.SET_LIVE_AUDIENCE_COUNT, getLiveAudiencesCount(audienceDefinitions));

    const emptyAudienceStats: AudienceStats = {
      matchedAudiences: [],
      matchedAudiencesByDays: [],
      publisherTraffic: [],
      currency: '$',
    };

    const audienceStats = {
      ...formatAudienceStats(
        orgNames.data || {},
        audienceDefinitions,
        audienceStatsResult.data || emptyAudienceStats,
        audienceRevenues.data || []
      ),
      currency: '$',
    };

    const isLoadedSuccessfully =
      ResponseHandler.checkType(audienceDefinitionsResult) &&
      ResponseHandler.checkType(audienceStatsResult) &&
      ResponseHandler.isAudienceStatsMissingData(audienceStats);

    if (!isLoadedSuccessfully) {
      api.sendErrorNotification('Audiences error', 'Audiences not loaded successfully');
    } else if (ResponseHandler.isAudienceStatsMissingRecentTraffic(audienceStats, 2)) {
      api.sendWarningNotification('Audiences error', 'Missing data for few days');
    }

    commit(MutationTypes.SET_AUDIENCE_TOTAL_REVENUE, getTotalRevenue(audienceRevenues.data));

    commit(MutationTypes.SET_AUDIENCE_STATS, {
      audienceStats,
      isLoadedSuccessfully,
    });
  },
};

const getters: GetterTree<State, RootState> = {
  [GetterTypes.GET_AUDIENCE_STATS]: (state) => state.audienceStats,
  [GetterTypes.GET_AUDIENCE_TOTAL_REVENUE]: (state) => state.totalRevenue,
  [GetterTypes.GET_AUDIENCE_STATS_IS_LOADING]: (state) => state.isLoading,
  [GetterTypes.GET_AUDIENCE_STATS_HAS_LOADED_SUCCESSFULLY]: (state) => state.isLoadedSuccessfully,
  [GetterTypes.GET_LIVE_AUDIENCE_COUNT]: (state) => state.liveAudienceCount,
};

const state: State = {
  audienceStats: undefined,
  isLoading: true,
  isLoadedSuccessfully: false,
  liveAudienceCount: 0,
};

const audienceStat: Module<State, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export const audienceStatHelper = createNamespacedHelpers(NAMESPACE);

export default audienceStat;
