import { RootState, AppAudienceDefinition } from '../types';
import {
  AudienceSpendAndImpressions,
  PublisherTraffic,
  AudienceOverlap,
} from '../../../functions/types';
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import {
  getAudiencesSpendAndImpressions,
  sendErrorNotification,
  getAudienceOverlap,
} from '../api';
import { ActionTypes } from '../actions';
import { GetterTypes } from '../getters';
import { MutationTypes } from '../mutations';
import { NAMESPACE as AUTH_NAMESPACE } from './auth';
import { NAMESPACE as AUDIENCES_NAMESPACE } from './audiences';
import ResponseHandler from '@/utils/response-handler';
import { MissingAnalyticsDataError } from '../errors';

export const NAMESPACE = 'analytics';

interface State {
  analytics: AudienceSpendAndImpressions[] | undefined;
  traffic: PublisherTraffic[] | undefined;
  overlap: { [id: string]: AudienceOverlap | undefined };
  isAnalyticsLoaded: boolean;
  isAnalyticsError: string | undefined;
}

const mutations: MutationTree<State> = {
  [MutationTypes.SET_ANALYTICS](
    state,
    { analytics, traffic, isAnalyticsLoaded, isAnalyticsError }
  ) {
    state.analytics = analytics;
    state.traffic = traffic;
    state.isAnalyticsLoaded = isAnalyticsLoaded;
    state.isAnalyticsError = isAnalyticsError;
  },
  [MutationTypes.SET_OVERLAP](state, { audienceId, overlap }) {
    state.overlap[audienceId] = overlap;
  },
};

const groupBy = <T>(
  list: T[],
  keyGetter: (item: T) => string
): Map<string, T[]> => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

const getters: GetterTree<State, RootState> = {
  [GetterTypes.GET_SPEND_AND_IMPRESSIONS]: (state) => state.analytics,
  [GetterTypes.GET_TRAFFIC]: (state) => state.traffic,
  [GetterTypes.GET_IS_ANALYTICS_LOADED]: (state) => state.isAnalyticsLoaded,
  [GetterTypes.GET_IS_ANALYTICS_ERROR]: (state) => state.isAnalyticsError,
  [GetterTypes.GET_SPEND_AND_IMPRESSIONS_BY_ID]: (state) => (id: string) => {
    if (!state.analytics) return [];
    const analyticsByAudienceId = groupBy(state.analytics, (i) => i.id);
    return analyticsByAudienceId.get(id) || [];
  },
  [GetterTypes.GET_AUDIENCES_TABLE_RAW_DATA]: (state, __, ___, rootGetters) => {
    const audiences =
      rootGetters[`${AUDIENCES_NAMESPACE}/${GetterTypes.GET_AUDIENCES}`];
    if (!audiences || !state.analytics) return [];

    const analyticsByAudienceId = groupBy(state.analytics, (i) => i.id);

    return audiences.map((audience: AppAudienceDefinition) => {
      const audienceSpendAndImpressions =
        analyticsByAudienceId.get(audience.id) || [];

      const sumSpendAndImpressions = audienceSpendAndImpressions.reduce(
        (acc, row: AudienceSpendAndImpressions) => ({
          spend: acc.spend + (row.spend ?? 0),
          impressions: acc.impressions + (row.impressions ?? 0),
          uniques: acc.uniques + (row.uniques ?? 0),
          pageViews: acc.pageViews + (row.pageViews ?? 0),
        }),
        {
          spend: 0,
          impressions: 0,
          uniques: 0,
          pageViews: 0,
        }
      );
      return {
        spend: sumSpendAndImpressions.spend,
        impressions: sumSpendAndImpressions.impressions,
        uniqueUsers: sumSpendAndImpressions.uniques,
        pageViews: sumSpendAndImpressions.pageViews,
        ...audience,
      };
    });
  },
  [GetterTypes.GET_OVERLAP]: (state) => (id: string) => {
    if (!state.overlap[id]) return undefined;
    return state.overlap[id];
  },
};

const actions: ActionTree<State, RootState> = {
  async [ActionTypes.SET_ANALYTICS.replace(`${NAMESPACE}/`, '')]({
    state,
    commit,
    rootGetters,
  }) {
    const user = await rootGetters[
      `${AUTH_NAMESPACE}/${GetterTypes.GET_USER_OBJECT}`
    ];

    const audiencesIds =
      rootGetters[`${AUDIENCES_NAMESPACE}/${GetterTypes.GET_AUDIENCES_IDS}`];

    const isAudiencesLoaded =
      rootGetters[
        `${AUDIENCES_NAMESPACE}/${GetterTypes.GET_IS_AUDIENCES_LOADED}`
      ];

    if (!user || state.analytics !== undefined) {
      return;
    }

    if (audiencesIds.length === 0 && isAudiencesLoaded) {
      commit(MutationTypes.SET_ANALYTICS, {
        analytics: [],
        isAnalyticsLoaded: true,
      });
      return;
    }

    const { xandrId } = rootGetters[
      `${AUTH_NAMESPACE}/${GetterTypes.GET_USER_OBJECT}`
    ];

    const audiencesDataframeResult = await getAudiencesSpendAndImpressions({
      audiencesIds,
      buyerMemberId: parseInt(xandrId, 10),
    });

    const isLoadedSuccessfully =
      ResponseHandler.checkType(audiencesDataframeResult) &&
      ResponseHandler.isAudienceAnalyticsMissingData(audiencesDataframeResult);

    if (!isLoadedSuccessfully) {
      await sendErrorNotification(
        'Audiences analytics error',
        'Audiences analytics not loaded successfully'
      );
    }

    commit(MutationTypes.SET_ANALYTICS, {
      analytics: audiencesDataframeResult.data?.analytics || [],
      traffic: audiencesDataframeResult.data?.traffic || [],
      isAnalyticsLoaded: true,
      isAnalyticsError: isLoadedSuccessfully
        ? new MissingAnalyticsDataError()
        : undefined,
    });
  },
  async [ActionTypes.SET_OVERLAP.replace(`${NAMESPACE}/`, '')](
    { commit, getters: moduleGetters },
    { audienceId }: { audienceId: string }
  ) {
    if (moduleGetters[GetterTypes.GET_OVERLAP](audienceId)) return;
    const overlapResult = await getAudienceOverlap({ audienceId });
    commit(MutationTypes.SET_OVERLAP, {
      audienceId,
      overlap: overlapResult.data || [],
    });
  },
};

const state: State = {
  analytics: undefined,
  traffic: undefined,
  overlap: {},
  isAnalyticsLoaded: false,
  isAnalyticsError: undefined,
};

export const analytics: Module<State, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
