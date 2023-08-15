<template>
  <div v-if="chartOptions" class="custom-chart audiences-chart">
    <error-overlay v-if="!isLoadedSuccessfully" />
    <template>
      <div v-if="summary" class="chart-header">
        <div class="chart-header__title">
          <div class="heading-2">Overview</div>
          <p class="paragraph-large">Last 30 days</p>
        </div>
        <chart-summary :stats="summary" />
      </div>
      <charts :options="chartOptions" class="chart" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ChartSummary from '@/components/ui/ChartSummary.vue';
import { PublisherTraffic } from '@/store/types';
import { Chart as Charts } from 'highcharts-vue';
import {
  TooltipFormatter,
  DefaultChartOptions,
  ShowPlotBandOnHover,
  EMPTY_CHART_VALUE,
} from '@/utils/highcharts-custom';
import Highcharts from 'highcharts';
import { formatDaysAgo } from '@/utils';
import { currency, dashOnEmpty, formatNumber } from '@/utils/filters';
import ErrorOverlay from '@/components/ui/ErrorOverlay.vue';
import { audienceStatHelper } from '@/store/modules/audienceStat';
import { GetterTypes } from '@/store/getters';

interface Summary {
  Traffic: { bulletClass: string; statLabel: string };
  Revenue: { bulletClass: string; statLabel: string };
}

@Component({
  components: {
    ChartSummary,
    Charts,
    ErrorOverlay,
  },
  computed: {
    ...audienceStatHelper.mapGetters({
      totalRevenue: GetterTypes.GET_AUDIENCE_TOTAL_REVENUE,
    }),
  },
  filters: {
    currency,
  },
})
export default class AudiencesChart extends Vue {
  @Prop({ type: Array, required: true }) stats!: PublisherTraffic[];
  @Prop({ type: Boolean, required: true }) isIntegrationCheckSuccessful!: boolean;
  @Prop({ type: Boolean, required: true }) isLoadedSuccessfully!: boolean;
  @Prop({ type: String, required: true }) audienceCurrency!: string;

  chartOptions: Highcharts.Options | null = null;
  totalRevenue?: number;

  created(): void {
    this.updateChart();
  }

  get summary(): Summary | null {
    if (!this.stats) return null;

    const trafficCount = this.stats.reduce((acc, e) => acc + e.traffic, 0);
    const traffic = dashOnEmpty(formatNumber(trafficCount, 0));

    return {
      Traffic: { bulletClass: 'highcharts-color-0', statLabel: traffic },
      Revenue: {
        bulletClass: 'highcharts-color-1',
        statLabel: currency({ currency: this.audienceCurrency, value: this.totalRevenue || 0 }),
      },
    };
  }

  updateChart(): void {
    if (!this.stats) return;
    const { stats } = this;
    const traffic = stats.map((e) => {
      return {
        y: e.traffic,
        text: dashOnEmpty(formatNumber(e.traffic)),
      };
    });

    const revenue = stats.map((e) => {
      return {
        y: e.revenue,
        text: currency({ currency: this.audienceCurrency, value: e.revenue }),
      };
    });

    const categories = stats.map(({ daysAgo }) => {
      return daysAgo.toString();
    });

    if (this.stats.length === 0) {
      const seriesData = this.isLoadedSuccessfully ? [EMPTY_CHART_VALUE] : [];
      const line = this.isLoadedSuccessfully ? { value: EMPTY_CHART_VALUE } : {};

      this.chartOptions = {
        ...DefaultChartOptions(['0']),
        ...{
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
            min: 0,
            max: 5,
            plotLines: [line],
          },
          series: [{ type: 'line', name: '', data: [seriesData], marker: { enabled: false } }],
        },
      };
      return;
    }

    this.chartOptions = {
      ...DefaultChartOptions(categories),
      ...{
        tooltip: {
          ...DefaultChartOptions(categories).tooltip,
          ...{
            formatter(this: Highcharts.TooltipFormatterContextObject) {
              return TooltipFormatter(this);
            },
          },
        },
        yAxis: [
          {
            tickAmount: 4,
            title: {
              text: '',
            },
            labels: {
              enabled: false,
            },
          },
          {
            tickAmount: 4,
            title: {
              text: '',
            },
            labels: {
              enabled: false,
            },
            opposite: true,
          },
        ],
        xAxis: {
          ...DefaultChartOptions(categories).xAxis,
          labels: {
            y: 44,
            autoRotation: [0],
            staggerLines: 2,
            formatter(this: Highcharts.AxisLabelsFormatterContextObject<number>): string {
              if (this.value % 2) {
                return '';
              }
              return formatDaysAgo(this.value);
            },
          },
        },
        series: [
          {
            states: {
              hover: {
                halo: {
                  size: 8,
                },
              },
            },
            yAxis: 1,
            marker: {
              radius: 3,
            },
            clip: false,
            type: 'spline',
            name: 'Traffic',
            data: traffic,
            point: { events: ShowPlotBandOnHover(0.6) },
          },
          {
            states: {
              hover: {
                halo: {
                  size: 8,
                },
              },
            },
            marker: {
              radius: 3,
            },
            clip: false,
            type: 'spline',
            name: 'Revenue',
            data: revenue,
            point: { events: ShowPlotBandOnHover(0.6) },
          },
        ],
      },
    };
  }
}
</script>

<style lang="scss" scoped>
.audiences-chart {
  position: relative;
}
</style>
