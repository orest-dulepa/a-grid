import Vue from 'vue';
import Vuex from 'vuex';
import { RootState } from '@/store/types';
import { MutationTypes } from '@/store/mutations';
import auth from '@/store/modules/auth';
import audienceStat from '@/store/modules/audienceStat';
import pageCrawls from '@/store/modules/pageCrawls';

Vue.use(Vuex);

const store = new Vuex.Store<RootState>({
  modules: {
    pageCrawls,
    audienceStat,
    auth,
  },
  getters: {
    mobileBannerShowed: (state) => {
      return state.mobileBannerShowed;
    },
  },
  state: {
    mobileBannerShowed: false,
  },
  mutations: {
    [MutationTypes.MOBILE_BANNER_SHOWN](state) {
      state.mobileBannerShowed = true;
    },
  },
});

export default store;
