<template>
  <div class="audience-detail-analytics-container">
    <div class="audience-detail-analytics">
      <div class="analytics-chart">
        <box>
          <analytics-chart-scale :audienceId="audienceId" />
        </box>
      </div>
      <div class="analytics-chart chart-columns">
        <box>
          <analytics-chart-overlap :audienceId="audienceId">
          </analytics-chart-overlap>
        </box>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

import Box from '@/components/layout/Box.vue';
import AnalyticsChartScale from './Chart/AnalyticsChartScale.vue';
import AnalyticsChartOverlap from './Chart/AnalyticsChartOverlap.vue';

export default defineComponent({
  name: 'AudienceDetailAnalytics',
  components: {
    AnalyticsChartScale,
    AnalyticsChartOverlap,
    Box,
  },
  setup() {
    const router = useRoute();

    return {
      audienceId: router.params.id,
    };
  },
});
</script>

<style lang="scss">
@import '@/styles/colors';

.audience-detail-analytics-container {
  display: flex;
  margin-top: 48px;
  justify-content: center;

  .audience-detail-analytics {
    box-sizing: border-box;
    height: min-content;
    width: 1216px;
    .analytics-chart {
      &:first-child {
        margin-bottom: 32px;
      }
    }

    .analytics-chart-header {
      margin-bottom: 24px;

      label {
        font-weight: 600;
        font-size: 18px;
        color: $dark-grey-4;
      }
    }

    .analytics-chart-content {
      margin-top: 32px;
    }
  }
}
</style>
