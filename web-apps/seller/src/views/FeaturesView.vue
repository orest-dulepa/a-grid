<template>
  <div v-if="isPageCrawlsLoading || isUserLoading">
    <template>
      <base-spinner class="search-models-chart__spinner" />
    </template>
  </div>
  <div v-else>
    <container is-large="true" is-nav-large="true">
      <features-chart
        :stats="stats"
        :is-loaded-successfully="isLoadedSuccessfully"
        :is-integration-check-successful="isIntegrationCheckSuccessful"
      />
    </container>
    <container>
      <features-pages-list
        :crawls="crawls"
        :is-loaded-successfully="isLoadedSuccessfully"
        :show-crawled-features="showCrawledFeatures"
        :is-integration-check-successful="isIntegrationCheckSuccessful"
      />
    </container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Container from '@/components/layout/Container.vue';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import FeaturesChart from '@/views/features/FeaturesChart.vue';
import FeaturesPagesList from '@/views/features/FeaturesPagesList.vue';
import { authHelpers } from '@/store/modules/auth';
import { GetterTypes } from '@/store/getters';
import { PageCrawls, PageCrawlsRow, PageCrawlsStat, UserInfo } from '@/store/types';
import { ActionTypes } from '@/store/actions';
import { pageCrawlsHelper } from '@/store/modules/pageCrawls';
import store from '@/store';

@Component({
  components: {
    BaseSpinner,
    Container,
    FeaturesChart,
    FeaturesPagesList,
  },
  computed: {
    ...authHelpers.mapGetters({
      user: GetterTypes.GET_USER,
    }),
    ...pageCrawlsHelper.mapGetters({
      pageCrawls: GetterTypes.GET_RECENT_PAGE_CRAWLS,
      isPageCrawlsLoading: GetterTypes.GET_RECENT_PAGE_CRAWLS_IS_LOADING,
      isLoadedSuccessfully: GetterTypes.GET_RECENT_PAGE_CRAWLS_HAS_LOADED_SUCCESSFULLY,
    }),
  },
})
export default class FeaturesView extends Vue {
  isUserLoading = true;
  isPageCrawlsLoading?: boolean;
  isLoadedSuccessfully?: boolean;
  pageCrawls?: PageCrawls;
  user?: UserInfo;

  @Watch('user')
  onUserChanged(): void {
    this.loadCrawls();
  }

  created(): void {
    this.loadCrawls();
  }

  async loadCrawls(): Promise<void> {
    if (this.user === undefined) {
      return;
    }
    this.isUserLoading = false;

    if (!this.user.isIntegrationCheckSuccessful || !this.user.showCrawledFeatures) {
      return;
    }

    store.dispatch(ActionTypes.SET_RECENT_PAGE_CRAWLS);
  }

  get stats(): PageCrawlsStat[] {
    return this.pageCrawls ? this.pageCrawls.stats : [];
  }

  get crawls(): PageCrawlsRow[] {
    return this.pageCrawls ? this.pageCrawls.crawls : [];
  }

  get isIntegrationCheckSuccessful(): boolean {
    return !!this.user?.isIntegrationCheckSuccessful;
  }

  get showCrawledFeatures(): boolean {
    return !!this.user?.showCrawledFeatures;
  }
}
</script>

<style lang="scss" scoped></style>
