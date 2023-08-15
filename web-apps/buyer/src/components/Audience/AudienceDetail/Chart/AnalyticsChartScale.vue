<template>
  <div class="analytics-chart-scale">
    <div class="analytics-chart-header scale-header">
      <label>Scale</label>
      <base-dropdown :items="filterPeriodItems" :value="chartPeriod">
        <template v-slot:buttonIcon>
          <clock-icon />
        </template>
        <template v-slot:buttonIconHover>
          <clock-blue-icon />
        </template>
      </base-dropdown>
    </div>
    <hr />
    <div class="analytics-chart-content">
      <chart-summary :stats="summary"> </chart-summary>
      <highcharts class="chart" :options="chartOptions"> </highcharts>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ComputedRef,
  ref,
  Ref,
  onBeforeMount,
} from 'vue';
import Highcharts from 'highcharts';
import { createHighcharts } from 'vue-highcharts';
import { useStore } from 'vuex';
import ChartSummary, {
  ChartSummaryType,
} from '@/components/UI/Chart/ChartSummary.vue';
import BaseDropdown from '@/components/UI/BaseDropdown.vue';
import ClockIcon from '@/components/UI/Icons/Clock.vue';
import ClockBlueIcon from '@/components/UI/Icons/ClockBlue.vue';
import { getCurrency, dashOnEmpty, getFormattedNumber } from '@/utils/filters';
import { NAMESPACE as ANALYTICS_NAMESPACE } from '@/store/modules/analytics';
import {
  PublisherTraffic,
  AudienceSpendAndImpressions,
} from '../../../../../functions/types';
import {
  DefaultChartOptions,
  FormatLabelsXAxis,
} from '@/utils/highcharts-custom';
import { GetterTypes } from '@/store/getters';

export default defineComponent({
  name: 'AnalyticsChartScale',
  props: {
    audienceId: {
      type: String,
      required: true,
    },
  },
  components: {
    ChartSummary,
    BaseDropdown,
    Highcharts: createHighcharts('Highcharts', Highcharts),
    ClockIcon,
    ClockBlueIcon,
  },
  setup(props) {
    const store = useStore();

    const spendAndImpressions: ComputedRef<
      AudienceSpendAndImpressions[]
    > = computed(() => {
      const result = store.getters[
        `${ANALYTICS_NAMESPACE}/${GetterTypes.GET_SPEND_AND_IMPRESSIONS_BY_ID}`
      ](props.audienceId);
      if (!result) return [];
      return result;
    });

    const publisherTraffic: ComputedRef<PublisherTraffic[]> = computed(() => {
      const result =
        store.getters[`${ANALYTICS_NAMESPACE}/${GetterTypes.GET_TRAFFIC}`];
      if (!result) return [];
      return result;
    });

    const chartPeriod = ref('30');

    const filterPeriodItems = ref({
      '30': 'Last 30 days',
      '14': 'Last 14 days',
      '7': 'Last 7 days',
      '1': 'Today',
    });

    const secondChartSeries: Ref<string> = ref('revenue');

    const traffic = computed(() =>
      publisherTraffic.value.map((e) => ({
        y: e.traffic ?? 0,
        text: dashOnEmpty(getFormattedNumber(e.traffic ?? 0)),
      }))
    );

    const sumTraffic = computed(() =>
      publisherTraffic.value.reduce((acc, e) => acc + e.traffic, 0)
    );

    const spend = computed(() =>
      spendAndImpressions.value.map((e) => ({
        y: e.spend ?? 0,
        text: dashOnEmpty(getFormattedNumber(e.spend ?? 0)),
      }))
    );

    const sumSpend = computed(() =>
      spendAndImpressions.value.reduce((acc, e) => acc + (e.spend ?? 0), 0)
    );

    const chartOptions = computed(() => ({
      ...DefaultChartOptions(['0']),
      plotOptions: {
        series: {
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
      tooltip: {
        enabled: false,
      },
      yAxis: {
        plotLines: [{}],
      },
      xAxis: {
        ...DefaultChartOptions(publisherTraffic.value.map(({ day }) => day))
          .xAxis,
        labels: FormatLabelsXAxis(spendAndImpressions.value.length),
      },
      series: [
        {
          type: 'line',
          name: 'Revenue',
          data: spend.value,
          marker: { enabled: false },
        },
        {
          type: 'line',
          name: 'Traffic',
          data: traffic.value,
          marker: { enabled: false },
        },
      ],
    }));

    const summary: ComputedRef<ChartSummaryType> = computed(() => {
      return {
        traffic: {
          label: 'Traffic',
          bulletClass: 'highcharts-color-0',
          value: dashOnEmpty(getFormattedNumber(sumTraffic.value, 0)),
          switchable: false,
          active: true,
          yAxis: 1,
        },
        revenue: {
          label: 'Revenue',
          bulletClass: 'highcharts-color-1',
          value: `$${sumSpend.value}`,
          active: secondChartSeries.value === 'revenue',
          seriesData: spendAndImpressions.value.map((e) => {
            return {
              y: e.spend ?? 0,
              text: getCurrency({
                currency: '$',
                value: e.spend ?? 0,
              }),
            };
          }),
          yAxis: 2,
        },
      };
    });

    return {
      summary,
      chartOptions,
      chartPeriod,
      filterPeriodItems,
    };
  },
});
</script>

<style lang="scss" scoped>
.analytics-chart-scale {
  .scale-header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
