<template>
  <div class="analytics-chart-overlap">
    <div class="analytics-chart-header overlap-header">
      <label>Audience overlap</label>
    </div>
    <hr />
    <div class="analytics-chart-content">
      <chart-summary :stats="summary"> </chart-summary>
      <highcharts class="chart" :options="chartOptions"> </highcharts>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ComputedRef, onBeforeMount } from 'vue';
import Highcharts from 'highcharts';
import { createHighcharts } from 'vue-highcharts';
import { useStore } from 'vuex';
import { AudienceOverlap } from '../../../../../functions/types';
import { GetterTypes } from '@/store/getters';
import { ActionTypes } from '@/store/actions';
import { NAMESPACE as ANALYTICS_NAMESPACE } from '@/store/modules/analytics';

import { DefaultChartOptions } from '@/utils/highcharts-custom';

export default defineComponent({
  name: 'AnalyticsChartOverlap',
  props: {
    audienceId: {
      type: String,
      required: true,
    },
  },
  components: {
    Highcharts: createHighcharts('Highcharts', Highcharts),
  },
  setup(props) {
    const store = useStore();

    onBeforeMount(async () => {
      await store.dispatch(ActionTypes.SET_OVERLAP, {
        audienceId: props.audienceId,
      });
    });

    const overlapRows: ComputedRef<AudienceOverlap[]> = computed(() => {
      const overlaps = store.getters[
        `${ANALYTICS_NAMESPACE}/${GetterTypes.GET_OVERLAP}`
      ](props.audienceId);

      if (!overlaps) return [];
      return overlaps.map((overlap: AudienceOverlap) => ({
        name: overlap.name,
        y: overlap.overlap,
      }));
    });

    const chartOptions = computed(() => ({
      ...DefaultChartOptions(['0']),
      chart: {
        type: 'column',
      },
      plotOptions: {
        series: {
          states: {
            hover: {
              enabled: false,
            },
          },
          pointWidth: 88,
        },
      },
      tooltip: {
        enabled: false,
      },
      accessibility: {
        announceNewData: {
          enabled: true,
        },
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        max: 1.0,
        title: {
          text: '',
        },
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          colorByPoint: true,
          data: overlapRows.value,
        },
      ],
    }));

    return {
      chartOptions,
    };
  },
});
</script>

<style lang="scss" scoped></style>
