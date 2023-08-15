import { RootState, AppAudienceDefinition, AudienceStatus } from '../types';
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import {
  getAudienceDefinitions,
  updateAudienceStatus,
  updateAudienceDefinitionProp,
} from '../api';
import { ActionTypes } from '../actions';
import { GetterTypes } from '../getters';
import { MutationTypes } from '../mutations';
import { NAMESPACE as AUTH_NAMESPACE } from './auth';
import { deduplicateArray } from '@/utils';

export const NAMESPACE = 'audiences';

interface State {
  audiences: AppAudienceDefinition[] | undefined;
  isAudiencesLoaded: boolean;
  isAudienceSettingsSavingNeeded: boolean | null;

  isTTLSettingsUpdated: boolean;
  isLookbackSettingsUpdated: boolean;
  isConfidenceSettingsUpdated: boolean;
}

const getters: GetterTree<State, RootState> = {
  [GetterTypes.GET_AUDIENCES]: (state) => state.audiences,
  [GetterTypes.GET_AUDIENCES_IDS]: (state) =>
    state.audiences
      ? deduplicateArray(
          state.audiences
            .map((audience) => audience.id)
            .filter((audienceId) => audienceId)
        )
      : [],
  [GetterTypes.GET_IS_AUDIENCES_LOADED]: (state) => state.isAudiencesLoaded,
  [GetterTypes.GET_LIVE_AUDIENCE_COUNT]: (state) =>
    state.audiences
      ? state.audiences.reduce(
          (acc, i) => (i.status === AudienceStatus.LIVE ? acc + 1 : acc),
          0
        )
      : 0,
  [GetterTypes.GET_IS_AUDIENCES_LOADED]: (state) => state.isAudiencesLoaded,
  [GetterTypes.GET_AUDIENCE_BY_ID]: (state) => (id: string) =>
    state.audiences?.find((audience) => {
      return audience.id === id;
    }),
  [GetterTypes.GET_AUDIENCE_STATUS]: (_, moduleGetters) => (id: string) =>
    moduleGetters[GetterTypes.GET_AUDIENCE_BY_ID](id).status,
  [GetterTypes.GET_AUDIENCE_TYPE]: (_, moduleGetters) => (id: string) =>
    moduleGetters[GetterTypes.GET_AUDIENCE_BY_ID](id).type,
  [GetterTypes.GET_AUDIENCE_TTL]: (_, moduleGetters) => (id: string) =>
    moduleGetters[GetterTypes.GET_AUDIENCE_BY_ID](id).ttl,
  [GetterTypes.GET_AUDIENCE_LOOKBACK]: (_, moduleGetters) => (id: string) =>
    moduleGetters[GetterTypes.GET_AUDIENCE_BY_ID](id).lookBack,
  [GetterTypes.GET_AUDIENCE_CONFIDENCE]: (_, moduleGetters) => (id: string) =>
    moduleGetters[GetterTypes.GET_AUDIENCE_BY_ID](id).confidence,
  [GetterTypes.GET_AUDIENCE_NAME]: (_, moduleGetters) => (id: string) =>
    moduleGetters[GetterTypes.GET_AUDIENCE_BY_ID](id).name,
  [GetterTypes.GET_AUDIENCE_OWNER]: (_, moduleGetters) => (id: string) =>
    moduleGetters[GetterTypes.GET_AUDIENCE_BY_ID](id).owner,
  [GetterTypes.GET_AUDIENCE_PAUSED_BY_SELLERS]: (_, moduleGetters) => (
    id: string
  ) => moduleGetters[GetterTypes.GET_AUDIENCE_BY_ID](id).pausedBySellers,
  [GetterTypes.GET_IS_AUDIENCE_SETTINGS_UPDATED]: (state) =>
    state.isTTLSettingsUpdated &&
    state.isLookbackSettingsUpdated &&
    state.isConfidenceSettingsUpdated,
};

const mutations: MutationTree<State> = {
  [MutationTypes.SET_AUDIENCES](state, { audiences, isAudiencesLoaded }) {
    state.audiences = audiences;
    state.isAudiencesLoaded = isAudiencesLoaded;
  },
  [MutationTypes.SET_AUDIENCE_STATUS](state, { id, status }) {
    if (state.audiences) {
      const audienceIndex = state.audiences.findIndex(
        (audience) => audience.id === id
      );
      if (audienceIndex !== -1) {
        state.audiences[audienceIndex].status = status;
      }
    }
  },
  [MutationTypes.SET_AUDIENCE_TTL](state, { id, ttl }) {
    if (state.audiences) {
      const audienceIndex = state.audiences.findIndex(
        (audience) => audience.id === id
      );
      if (audienceIndex !== -1) {
        state.audiences[audienceIndex].ttl = ttl;
        state.isTTLSettingsUpdated = true;
      }
    }
  },
  [MutationTypes.SET_AUDIENCE_LOOKBACK](state, { id, lookBack }) {
    if (state.audiences) {
      const audienceIndex = state.audiences.findIndex(
        (audience) => audience.id === id
      );
      if (audienceIndex !== -1) {
        state.audiences[audienceIndex].lookBack = lookBack;
        state.isLookbackSettingsUpdated = true;
      }
    }
  },
  [MutationTypes.SET_AUDIENCE_CONFIDENCE](state, { id, confidence }) {
    if (state.audiences) {
      const audienceIndex = state.audiences.findIndex(
        (audience) => audience.id === id
      );
      if (audienceIndex !== -1) {
        state.audiences[audienceIndex].confidence = confidence;
        state.isConfidenceSettingsUpdated = true;
      }
    }
  },
  [MutationTypes.SET_IS_AUDIENCE_SETTINGS_SAVING_NEEDED](state) {
    state.isAudienceSettingsSavingNeeded = !state.isAudienceSettingsSavingNeeded;
  },
  [MutationTypes.SET_ARE_AUDIENCE_SETTINGS_UPDATED](state) {
    state.isTTLSettingsUpdated = false;
    state.isLookbackSettingsUpdated = false;
    state.isConfidenceSettingsUpdated = false;
  },
};

const actions: ActionTree<State, RootState> = {
  async [ActionTypes.SET_AUDIENCES.replace(`${NAMESPACE}/`, '')]({
    state,
    commit,
    rootGetters,
  }) {
    const user = await rootGetters[
      `${AUTH_NAMESPACE}/${GetterTypes.GET_USER_OBJECT}`
    ];

    if (!user || state.audiences !== undefined) return;

    const audiencesResult = await getAudienceDefinitions(user.accountId);

    commit(MutationTypes.SET_AUDIENCES, {
      audiences: audiencesResult.data || [],
      isAudiencesLoaded: true,
    });
  },
  async [ActionTypes.SET_AUDIENCE_STATUS.replace(`${NAMESPACE}/`, '')](
    { commit },
    { id, status }
  ) {
    const result = await updateAudienceStatus(id, status);
    if (result !== null)
      commit(MutationTypes.SET_AUDIENCE_STATUS, { id, status: result });
  },
  async [ActionTypes.SET_AUDIENCE_TTL.replace(`${NAMESPACE}/`, '')](
    { commit },
    { id, value }
  ) {
    const result = await updateAudienceDefinitionProp(id, 'ttl', value);
    if (result !== null)
      commit(MutationTypes.SET_AUDIENCE_TTL, { id, ttl: value });
  },
  async [ActionTypes.SET_AUDIENCE_LOOKBACK.replace(`${NAMESPACE}/`, '')](
    { commit },
    { id, value }
  ) {
    const result = await updateAudienceDefinitionProp(id, 'lookBack', value);

    if (result !== null) {
      commit(MutationTypes.SET_AUDIENCE_LOOKBACK, {
        id,
        lookBack: value,
      });
    }
  },
  async [ActionTypes.SET_AUDIENCE_CONFIDENCE.replace(`${NAMESPACE}/`, '')](
    { commit },
    { id, value }
  ) {
    const result = await updateAudienceDefinitionProp(id, 'confidence', value);
    if (result !== null)
      commit(MutationTypes.SET_AUDIENCE_CONFIDENCE, {
        id,
        confidence: value,
      });
  },
  [ActionTypes.SET_IS_AUDIENCE_SETTINGS_SAVING_NEEDED.replace(`${NAMESPACE}/`, '')]({
    commit,
  }) {
    commit(MutationTypes.SET_ARE_AUDIENCE_SETTINGS_UPDATED);
    commit(MutationTypes.SET_IS_AUDIENCE_SETTINGS_SAVING_NEEDED);
  },
  [ActionTypes.SET_ARE_AUDIENCE_SETTINGS_UPDATED.replace(`${NAMESPACE}/`, '')]({
    commit,
  }) {
    commit(MutationTypes.SET_ARE_AUDIENCE_SETTINGS_UPDATED);
  },
};

const state: State = {
  audiences: undefined,
  isAudiencesLoaded: false,
  isAudienceSettingsSavingNeeded: null,

  isTTLSettingsUpdated: false,
  isLookbackSettingsUpdated: false,
  isConfidenceSettingsUpdated: false,
};

const audiences: Module<State, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export { audiences };
