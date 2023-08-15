<template>
  <div v-if="isLoadingUser || isLoadingAudienceStats">
    <template>
      <base-spinner class="search-models-chart__spinner" :is-white="false" />
    </template>
  </div>
  <container v-else :is-large="true">
    <h1 class="heading-2 overview-title">Welcome back, {{ user.fullName | getFirstWord }}!</h1>
    <overview-cards :publisher-traffic="publisherTraffic" />
    <overview-chart
      :publisher-traffic="publisherTraffic"
      :matched-audiences-by-days="matchedAudiencesByDays"
      :is-loaded-successfully="isLoadedSuccessfully"
      :audience-currency="audienceCurrency"
    />
  </container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import IntegrationCheck from '@/components/integration/IntegrationCheck.vue';
import Container from '@/components/layout/Container.vue';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import { authHelpers } from '@/store/modules/auth';
import { GetterTypes } from '@/store/getters';
import { AudienceStats, MatchedAudiencesTraffic, PublisherTraffic, UserInfo } from '@/store/types';
import OverviewChart from '@/views/overview/OverviewChart.vue';
import OverviewCards from '@/views/overview/OverviewCards.vue';
import store from '@/store';
import { ActionTypes } from '@/store/actions';
import { audienceStatHelper } from '@/store/modules/audienceStat';
import { getFirstWord } from '@/utils/filters';

@Component({
  components: {
    BaseSpinner,
    Container,
    IntegrationCheck,
    OverviewCards,
    OverviewChart,
  },
  computed: {
    ...authHelpers.mapGetters({
      user: GetterTypes.GET_USER,
      isLoadingUser: GetterTypes.GET_IS_LOADING,
    }),
    ...audienceStatHelper.mapGetters({
      audienceStats: GetterTypes.GET_AUDIENCE_STATS,
      isLoadingAudienceStats: GetterTypes.GET_AUDIENCE_STATS_IS_LOADING,
      isLoadedSuccessfully: GetterTypes.GET_AUDIENCE_STATS_HAS_LOADED_SUCCESSFULLY,
    }),
  },
  filters: {
    getFirstWord,
  },
})
export default class OverviewView extends Vue {
  user?: UserInfo;
  isLoadingUser?: boolean;
  audienceStats?: AudienceStats;
  isLoadingAudienceStats?: boolean;
  isLoadedSuccessfully?: boolean;
  audienceCurrency?: string;
  publisherTraffic: PublisherTraffic[] | null = null;
  matchedAudiencesByDays: MatchedAudiencesTraffic[] | null = null;

  @Watch('user')
  onUserChanged(): void {
    this.loadAudienceStats();
  }

  @Watch('audienceStats')
  onAudienceChanged(): void {
    this.loadAudienceStats();
  }

  created(): void {
    this.loadAudienceStats();
  }

  loadAudienceStats(): void {
    if (!this.user) {
      return;
    }

    if (this.audienceStats === undefined) {
      store.dispatch(ActionTypes.SET_AUDIENCE_STATS);
      return;
    }

    if (this.audienceStats === null) {
      this.publisherTraffic = [];
      return;
    }

    const { matchedAudiencesByDays, publisherTraffic, currency } = this.audienceStats;
    this.publisherTraffic = publisherTraffic;
    this.matchedAudiencesByDays = matchedAudiencesByDays;
    this.audienceCurrency = currency;
  }
}
</script>
