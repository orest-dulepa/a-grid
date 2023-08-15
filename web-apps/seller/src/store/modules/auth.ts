import { RootState, UserInfo } from '@/store/types';
import { auth as authFirebase } from '@/firebase';
import * as api from '@/store/api';
import { ActionTree, createNamespacedHelpers, GetterTree, Module, MutationTree } from 'vuex';
import { MutationTypes } from '@/store/mutations';
import { GetterTypes } from '@/store/getters';
import { ActionTypes } from '@/store/actions';

export const NAMESPACE = 'auth';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace SignUpStateMachine {
  export type Step = 'signupForm' | 'signupPrebidForm' | 'signupEmbedCode' | 'signupComplete';
}

interface State {
  user?: UserInfo;
  signUpStep: SignUpStateMachine.Step;
  isLoading: boolean;
}

const getIsOnboardingComplete = (state: State): boolean => {
  return (
    !!state.user &&
    state.user.isIntegrationCheckSuccessful &&
    state.user.isXandrIntegrationComplete &&
    !!state.user.xandrId &&
    !!authFirebase.currentUser &&
    authFirebase.currentUser.emailVerified
  );
};

class SignUpStateMachine {
  static transitions: Record<SignUpStateMachine.Step, SignUpStateMachine.Step> = {
    signupForm: 'signupPrebidForm',
    signupPrebidForm: 'signupEmbedCode',
    signupEmbedCode: 'signupComplete',
    signupComplete: 'signupComplete',
  };
}

const mutations: MutationTree<State> = {
  [MutationTypes.GO_TO_NEXT_SIGN_UP_STEP](state) {
    state.signUpStep = SignUpStateMachine.transitions[state.signUpStep];
  },
  [MutationTypes.UPDATE_USER](state, user: UserInfo) {
    state.user = user;
    localStorage.setItem('isOnboardingComplete', getIsOnboardingComplete(state).toString());
  },
  [MutationTypes.SET_IS_LOADING](state, isLoading: boolean) {
    state.isLoading = isLoading;
  },
};

const actions: ActionTree<State, RootState> = {
  async [ActionTypes.SET_USER.replace(`${NAMESPACE}/`, '')]({ commit }) {
    if (!(await api.isLoggedIn())) {
      return;
    }
    commit(MutationTypes.SET_IS_LOADING, true);

    const result = await api.getUser();
    if (result.type !== 'error') {
      commit(MutationTypes.UPDATE_USER, result.data);
    }

    commit(MutationTypes.SET_IS_LOADING, false);
  },
  async [ActionTypes.SET_INTEGRATION_COMPLETE_SUCCESS.replace(`${NAMESPACE}/`, '')](
    { commit, state },
    isIntegrationCheckSuccessful
  ) {
    commit(MutationTypes.UPDATE_USER, { ...state.user, isIntegrationCheckSuccessful });
  },
};

const getters: GetterTree<State, RootState> = {
  [GetterTypes.GET_USER]: (state) => state.user,
  [GetterTypes.GET_SIGN_UP_STEP]: (state) => state.signUpStep,
  [GetterTypes.GET_IS_LOADING]: (state) => state.isLoading,
  [GetterTypes.GET_IS_ONBOARDING_COMPLETE]: (state) => {
    return getIsOnboardingComplete(state);
  },
};

const state: State = {
  signUpStep: 'signupForm',
  user: undefined,
  isLoading: true,
};

const auth: Module<State, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export const authHelpers = createNamespacedHelpers(NAMESPACE);

export default auth;
