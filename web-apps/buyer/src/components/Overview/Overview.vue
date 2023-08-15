<template>
  <base-spinner
    v-if="!isLoadedSuccessfully"
    class="search-models-chart__spinner"
  />
  <container v-else :is-large="true">
    <h1 class="heading-2 overview-title">Welcome back</h1>
    <overview-cards
      :publisher-traffic="traffic"
      :live-audiences-count="liveAudiencesCount"
    />
    <overview-chart
      :is-loaded-successfully="isLoadedSuccessfully"
      :publisher-traffic="traffic"
      :matched-audiences-by-days="spendAndImpressions"
      audience-currency="$"
    />
  </container>
</template>

<script lang="ts">
import Container from '@/layouts/Container.vue';
import BaseSpinner from '@/components/Audience/UI/BaseSpinner.vue';
import { computed, defineComponent } from 'vue';
import { GetterTypes } from '@/store/getters';
import { NAMESPACE as ANALYTICS_NAMESPACE } from '@/store/modules/analytics';
import { NAMESPACE as AUDIENCES_NAMESPACE } from '@/store/modules/audiences';
import { NAMESPACE as AUTH_NAMESPACE } from '@/store/modules/auth';
import { useStore } from 'vuex';
import OverviewCards from '@/components/Overview/OverviewCards.vue';
import OverviewChart from '@/components/Overview/OverviewChart.vue';

export default defineComponent({
  name: 'Overview',
  components: {
    BaseSpinner,
    Container,
    OverviewCards,
    OverviewChart,
  },
  setup() {
    const store = useStore();

    const isLoadedSuccessfully = computed(
      () =>
        store.getters[
          `${ANALYTICS_NAMESPACE}/${GetterTypes.GET_IS_ANALYTICS_LOADED}`
        ]
    );
    const spendAndImpressions = computed(
      () =>
        store.getters[
          `${ANALYTICS_NAMESPACE}/${GetterTypes.GET_SPEND_AND_IMPRESSIONS}`
        ]
    );
    const traffic = computed(
      () => store.getters[`${ANALYTICS_NAMESPACE}/${GetterTypes.GET_TRAFFIC}`]
    );
    const user = computed(
      () => store.getters[`${AUTH_NAMESPACE}/${GetterTypes.GET_USER_OBJECT}`]
    );
    const liveAudiencesCount = computed(
      () =>
        store.getters[
          `${AUDIENCES_NAMESPACE}/${GetterTypes.GET_LIVE_AUDIENCE_COUNT}`
        ]
    );

    return {
      spendAndImpressions,
      traffic,
      liveAudiencesCount,
      isLoadedSuccessfully,
      user,
    };
  },
});
</script>
