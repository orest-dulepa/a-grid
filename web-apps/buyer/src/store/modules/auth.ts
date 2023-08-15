import { RootState, UserInfo } from '../types';
import {
  ActionTree,
  createNamespacedHelpers,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';
import { signout, getUser } from '../api';
import { ActionTypes } from '../actions';
import { GetterTypes } from '../getters';
import { MutationTypes } from '../mutations';

export const NAMESPACE = 'auth';

interface State {
  user?: UserInfo;
  error?: { message: string };
  signup: {
    email?: string;
    orgName?: string;
    orgEmailDomain?: string;
  };
}

const mutations: MutationTree<State> = {
  [MutationTypes.SET_USER](state, { user }) {
    state.user = user;
  },
  [MutationTypes.SET_AUTH_ERROR](state, { error }) {
    state.error = error;
  },
  [MutationTypes.SET_SIGNUP_INFO](state, signupInfo) {
    state.signup = signupInfo;
  },
};

const actions: ActionTree<State, RootState> = {
  async [ActionTypes.SET_USER.replace(`${NAMESPACE}/`, '')]({ commit }) {
    try {
      const result = await getUser();

      if (result.type !== 'error') {
        commit(MutationTypes.SET_USER, { user: result.data });
      } else {
        commit(MutationTypes.SET_AUTH_ERROR, { error: result });
      }

      return result;
    } catch (error) {
      commit(MutationTypes.SET_AUTH_ERROR, { error });
      return { type: 'error', message: error.message };
    }
  },
  async [ActionTypes.SET_SIGNUP_INFO.replace(`${NAMESPACE}/`, '')](
    { commit },
    { email, orgName, orgEmailDomain }
  ) {
    commit(MutationTypes.SET_SIGNUP_INFO, {
      email,
      orgName,
      orgEmailDomain,
    });
  },
  async [ActionTypes.SIGN_OUT.replace(`${NAMESPACE}/`, '')]({ commit }) {
    try {
      const result = await signout();
      if (result.type !== 'error') {
        commit(MutationTypes.SET_USER, { user: undefined });
      } else {
        commit(MutationTypes.SET_AUTH_ERROR, { error: result });
      }
    } catch (error) {
      commit(MutationTypes.SET_AUTH_ERROR, { error });
    }
  },
};

const getters: GetterTree<State, RootState> = {
  [GetterTypes.GET_AUTH](state) {
    return state;
  },
  [GetterTypes.GET_USER_OBJECT](state) {
    return state.user;
  },
  [GetterTypes.GET_SIGNUP_INFO](state) {
    return state.signup;
  },
};

const state: State = {
  user: undefined,
  error: undefined,
  signup: {
    email: undefined,
    orgName: undefined,
    orgEmailDomain: undefined,
  },
};

const auth: Module<State, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export const authHelper = createNamespacedHelpers(NAMESPACE);

export { auth };
