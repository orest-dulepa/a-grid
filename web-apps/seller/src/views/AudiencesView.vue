<template>
  <div>
    <div v-if="isLoading">
      <base-spinner class="search-models-chart__spinner" />
    </div>
    <div v-else>
      <container is-large="true" is-nav-large="true">
        <audiences-chart
          :stats="publisherTraffic"
          :audience-currency="audienceCurrency"
          :is-loaded-successfully="isLoadedSuccessfully"
          :is-integration-check-successful="isIntegrationCheckSuccessful"
        />
      </container>
      <container is-large="true" is-nav-large="true">
        <audiences-list
          :stats="matchedAudiences"
          :is-stats-active="isStatsActive"
          :is-loaded-successfully="isLoadedSuccessfully"
          :is-integration-check-successful="isIntegrationCheckSuccessful"
        />
      </container>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Container from '@/components/layout/Container.vue';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import AudiencesChart from '@/views/audiences/AudiencesChart.vue';
import AudiencesList from '@/views/audiences/AudiencesList.vue';
import { PublisherTraffic, AudienceStats, MatchedAudiences, UserInfo } from '@/store/types';
import store from '@/store';
import { ActionTypes } from '@/store/actions';
import { audienceStatHelper } from '@/store/modules/audienceStat';
import { GetterTypes } from '@/store/getters';
import { authHelpers } from '@/store/modules/auth';

@Component({
  components: {
    BaseSpinner,
    Container,
    AudiencesChart,
    AudiencesList,
  },
  computed: {
    ...authHelpers.mapGetters({
      user: GetterTypes.GET_USER,
    }),
    ...audienceStatHelper.mapGetters({
      audienceStats: GetterTypes.GET_AUDIENCE_STATS,
      isLoading: GetterTypes.GET_AUDIENCE_STATS_IS_LOADING,
      isLoadedSuccessfully: GetterTypes.GET_AUDIENCE_STATS_HAS_LOADED_SUCCESSFULLY,
    }),
  },
})
export default class AudiencesView extends Vue {
  matchedAudiences: MatchedAudiences[] | null = null;
  publisherTraffic: PublisherTraffic[] | null = null;
  audienceCurrency: string | null = null;
  audienceStats?: AudienceStats;
  isLoading?: boolean;
  isLoadedSuccessfully?: boolean;
  isStatsActive = false;
  user?: UserInfo;
  @Watch('audienceStats')
  onAudienceChanged(): void {
    this.loadAudienceStats();
  }
  @Watch('user')
  onUserChanged(): void {
    this.loadAudienceStats();
  }
  created(): void {
    this.loadAudienceStats();
  }
  loadAudienceStats(): void {
    if (this.user === undefined) {
      return;
    }
    if (this.audienceStats === undefined) {
      store.dispatch(ActionTypes.SET_AUDIENCE_STATS);
      return;
    }
    const { matchedAudiences, publisherTraffic, currency } = this.audienceStats;
    this.matchedAudiences = matchedAudiences;
    if (!this.user.isIntegrationCheckSuccessful) {
      this.publisherTraffic = [];
      this.audienceCurrency = '';
      return;
    }
    this.publisherTraffic = publisherTraffic;
    this.audienceCurrency = currency;
    this.isStatsActive = !!matchedAudiences.length;
  }
  get isIntegrationCheckSuccessful(): boolean {
    return !!this.user?.isIntegrationCheckSuccessful;
  }
}
</script>

<style lang="scss" scoped></style>
