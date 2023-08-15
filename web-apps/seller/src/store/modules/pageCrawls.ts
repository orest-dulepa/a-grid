import { PageCrawls, PageCrawlsStat, RootState } from '@/store/types';
import * as api from '@/store/api';
import { ActionTree, createNamespacedHelpers, GetterTree, Module, MutationTree } from 'vuex';
import { getRecentPageCrawls } from '@/store/api';
import { ActionTypes } from '@/store/actions';
import { GetterTypes } from '@/store/getters';
import { MutationTypes } from '@/store/mutations';
import ResponseHandler from '@/utils/response-handler';

const NAMESPACE = 'pageCrawls';
const CRAWLS_OVER_NUMBER_OF_DAYS = 1;
const STATISTIC_OVER_NUMBER_OF_DAYS = 7;

interface State {
  pageCrawls?: PageCrawls;
  isLoading: boolean;
  isLoadedSuccessfully: boolean;
}

const formatPageCrawls = (pageCrawls: PageCrawls): PageCrawls => {
  const pageCrawlsStat: Record<string, PageCrawlsStat> = {};
  pageCrawls.stats.forEach((stat: PageCrawlsStat) => {
    pageCrawlsStat[stat.daysAgo] = {
      daysAgo: stat.daysAgo,
      pagesCrawled: stat.pagesCrawled,
    };
  });

  // Add days ago if there 0 page crawls on that day.
  const stats: PageCrawlsStat[] = new Array(STATISTIC_OVER_NUMBER_OF_DAYS)
    .fill(null)
    .map((_, index) => {
      const { pagesCrawled } = pageCrawlsStat[index] || { pagesCrawled: 0 };
      return {
        daysAgo: index,
        pagesCrawled,
      };
    });

  return {
    ...pageCrawls,
    stats,
  };
};

const mutations: MutationTree<State> = {
  [MutationTypes.SET_RECENT_PAGE_CRAWLS](state, { pageCrawls, isLoadedSuccessfully }) {
    state.pageCrawls = pageCrawls;
    state.isLoadedSuccessfully = isLoadedSuccessfully;
    state.isLoading = false;
  },
  [MutationTypes.SET_RECENT_PAGE_CRAWLS_IS_LOADING](state, isLoading: boolean) {
    state.isLoading = isLoading;
  },
};

const actions: ActionTree<State, RootState> = {
  async [ActionTypes.SET_RECENT_PAGE_CRAWLS.replace(`${NAMESPACE}/`, '')]({ state, commit }) {
    if (!(await api.isLoggedIn())) {
      return;
    }

    if (state.pageCrawls !== undefined) {
      return;
    }

    commit(MutationTypes.SET_RECENT_PAGE_CRAWLS_IS_LOADING, true);
    const result = await getRecentPageCrawls(
      CRAWLS_OVER_NUMBER_OF_DAYS,
      STATISTIC_OVER_NUMBER_OF_DAYS
    );

    const emptyPageCrawls: PageCrawls = { stats: [], crawls: [] };
    const pageCrawls: PageCrawls = formatPageCrawls(result.data || emptyPageCrawls);

    const isLoadedSuccessfully =
      ResponseHandler.checkType(result) && ResponseHandler.isPageCrawlsMissingData(pageCrawls);

    if (!isLoadedSuccessfully) {
      api.sendErrorNotification('Page crawls error', 'Page crawls not loaded successfully');
    } else if (ResponseHandler.isPageCrawlsMissingRecentCrawls(pageCrawls, 2)) {
      api.sendWarningNotification('Page crawls error', 'Missing data for few days');
    }

    commit(MutationTypes.SET_RECENT_PAGE_CRAWLS, {
      pageCrawls: isLoadedSuccessfully ? pageCrawls : null,
      isLoadedSuccessfully,
    });
  },
};

const getters: GetterTree<State, RootState> = {
  [GetterTypes.GET_RECENT_PAGE_CRAWLS]: (state) => state.pageCrawls,
  [GetterTypes.GET_RECENT_PAGE_CRAWLS_IS_LOADING]: (state) => state.isLoading,
  [GetterTypes.GET_RECENT_PAGE_CRAWLS_HAS_LOADED_SUCCESSFULLY]: (state) =>
    state.isLoadedSuccessfully,
};

const state: State = {
  pageCrawls: undefined,
  isLoading: false,
  isLoadedSuccessfully: true,
};

const pageCrawls: Module<State, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export const pageCrawlsHelper = createNamespacedHelpers(NAMESPACE);

export default pageCrawls;
