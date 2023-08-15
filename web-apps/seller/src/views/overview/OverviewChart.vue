<template>
  <div class="custom-chart custom-chart--white overview-chart">
    <div v-if="summary" class="chart-header">
      <div class="chart-header__title">
        <div class="heading-2">Overview</div>
        <div class="filters">
          <base-dropdown
            :items="filterPeriodItems"
            :value="chartPeriod"
            v-on:selected-value="onSelectedPeriod"
          />
        </div>
      </div>
      <chart-summary-overview :stats="summary" v-on:item-click="onSummaryItemClick" />
    </div>
    <chart :options="chartOptions" class="chart" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BaseDropdown from '@/components/ui/BaseDropdown.vue';
import BaseOverlay from '@/components/ui/BaseOverlay.vue';
import ChartSummaryOverview from '@/components/ui/ChartSummaryOverview.vue';
import Cog from '@/assets/icons/cog.svg?inline';
import SimpleCircle from '@/components/ui/icons/SimpleCircle.vue';
import { Chart } from 'highcharts-vue';
import ErrorOverlay from '@/components/ui/ErrorOverlay.vue';
import {
  DefaultChartOptions,
  FormatLabelsXAxis,
  ShowPlotBandOnHover,
  TooltipFormatter,
} from '@/utils/highcharts-custom';
import { MatchedAudiencesTraffic, PublisherTraffic } from '@/store/types';
import { currency, dashOnEmpty, formatNumber } from '@/utils/filters';
import Highcharts, { SeriesOptionsType } from 'highcharts';
import { round } from '@/utils';

const CHARTS_COUNT = 7;
const PLOT_SIZE_TO_SERIES_LENGTH_RATIO = 55;

type SeriesData = { y: number; text: string };

type OverviewSummary = Record<
  string,
  {
    bulletClass: string;
    label: string;
    value: string;
    active?: boolean;
    switchable?: boolean;
    seriesData?: SeriesData[];
    yAxis: number;
  }
>;

@Component({
  components: {
    BaseDropdown,
    BaseOverlay,
    Chart,
    ChartSummaryOverview,
    Cog,
    ErrorOverlay,
    SimpleCircle,
  },
})
export default class OverviewChart extends Vue {
  @Prop({ type: Array, required: true }) publisherTraffic!: PublisherTraffic[];
  @Prop({ type: Array, required: true }) matchedAudiencesByDays!: MatchedAudiencesTraffic[];
  @Prop({ type: Boolean, required: true }) isLoadedSuccessfully!: boolean;
  @Prop({ type: String, required: true }) audienceCurrency!: string;
  chartOptions: Highcharts.Options | null = null;
  chartPeriod = '30';
  secondChartSeries = 'revenue';

  created(): void {
    this.updateChart();
  }

  get filterPeriodItems(): { [key: string]: string } {
    return {
      '30': 'Last 30 days',
      '14': 'Last 14 days',
      '7': 'Last 7 days',
    };
  }

  onSelectedPeriod(period: string): void {
    this.chartPeriod = period;
    this.updateChart();
  }

  get summary(): OverviewSummary {
    const publisherTraffic = this.publisherTrafficForPeriod;
    const matchedAudiencesByDays = this.matchedAudiencesByDaysForPeriod;

    const trafficCount = publisherTraffic.reduce((acc, e) => acc + e.traffic, 0);
    const traffic = dashOnEmpty(formatNumber(trafficCount, 0));
    const totalRevenueValue = matchedAudiencesByDays.reduce((acc, e) => acc + e.revenue, 0);
    const totalRevenue = totalRevenueValue
      ? currency({
          currency: this.audienceCurrency,
          value: totalRevenueValue,
        })
      : '-';
    const totalImpressionsValue = matchedAudiencesByDays.reduce((acc, e) => acc + e.impressions, 0);
    const totalImpressions = dashOnEmpty(formatNumber(totalImpressionsValue));
    const totalUsersPredicted = dashOnEmpty(
      formatNumber(matchedAudiencesByDays.reduce((acc, e) => acc + e.uniques, 0))
    );
    const totalAudiencePageViews = dashOnEmpty(
      formatNumber(matchedAudiencesByDays.reduce((acc, e) => acc + e.pageViews, 0))
    );
    const averageCPM =
      totalRevenueValue && totalImpressionsValue
        ? currency({
            currency: '$',
            value: totalRevenueValue / (totalImpressionsValue / 1000),
          })
        : '-';

    return {
      traffic: {
        label: 'Traffic',
        bulletClass: 'highcharts-color-0',
        value: traffic,
        switchable: false,
        active: true,
        yAxis: 1,
      },
      revenue: {
        label: 'Revenue',
        bulletClass: 'highcharts-color-1',
        value: totalRevenue,
        active: this.secondChartSeries === 'revenue',
        seriesData:
          this.secondChartSeries === 'revenue' ? this.summaryItemSeriesData('revenue') : [],
        yAxis: 2,
      },
      impressions: {
        label: 'Impressions sold',
        bulletClass: 'highcharts-color-2',
        value: totalImpressions,
        active: this.secondChartSeries === 'impressions',
        seriesData:
          this.secondChartSeries === 'impressions' ? this.summaryItemSeriesData('impressions') : [],
        yAxis: 3,
      },
      'users-predicted': {
        label: 'Users predicted',
        bulletClass: 'highcharts-color-3',
        value: totalUsersPredicted,
        active: this.secondChartSeries === 'users-predicted',
        seriesData:
          this.secondChartSeries === 'users-predicted'
            ? this.summaryItemSeriesData('users-predicted')
            : [],
        yAxis: 4,
      },
      'audience-pageviews': {
        label: 'Audience pageviews',
        bulletClass: 'highcharts-color-4',
        value: totalAudiencePageViews,
        active: this.secondChartSeries === 'audience-pageviews',
        seriesData:
          this.secondChartSeries === 'audience-pageviews'
            ? this.summaryItemSeriesData('audience-pageviews')
            : [],
        yAxis: 5,
      },
      'average-cpm': {
        label: 'Average CPM',
        bulletClass: 'highcharts-color-5',
        value: averageCPM,
        active: this.secondChartSeries === 'average-cpm',
        seriesData:
          this.secondChartSeries === 'average-cpm' ? this.summaryItemSeriesData('average-cpm') : [],
        yAxis: 6,
      },
    };
  }

  onSummaryItemClick(id: string): void {
    this.secondChartSeries = id;
    this.updateChart();
  }

  get publisherTrafficForPeriod(): PublisherTraffic[] {
    const { publisherTraffic } = this;
    return publisherTraffic.slice(
      publisherTraffic.length - parseInt(this.chartPeriod, 10),
      publisherTraffic.length
    );
  }

  get matchedAudiencesByDaysForPeriod(): MatchedAudiencesTraffic[] {
    const { matchedAudiencesByDays } = this;
    return matchedAudiencesByDays.slice(
      matchedAudiencesByDays.length - parseInt(this.chartPeriod, 10),
      matchedAudiencesByDays.length
    );
  }

  summaryItemSeriesData(series: string): SeriesData[] {
    const publisherTraffic = this.publisherTrafficForPeriod;
    const matchedAudiencesByDays = this.matchedAudiencesByDaysForPeriod;

    let seriesData: { y: number; text: string }[];
    switch (series) {
      case 'impressions':
        seriesData = matchedAudiencesByDays.map((e) => {
          return {
            y: e.impressions,
            text: dashOnEmpty(formatNumber(e.impressions)),
          };
        });
        break;
      case 'users-predicted':
        seriesData = matchedAudiencesByDays.map((e) => {
          return {
            y: e.uniques,
            text: dashOnEmpty(formatNumber(e.uniques)),
          };
        });
        break;
      case 'audience-pageviews':
        seriesData = matchedAudiencesByDays.map((e) => {
          return {
            y: e.pageViews,
            text: dashOnEmpty(formatNumber(e.pageViews)),
          };
        });
        break;
      case 'average-cpm':
        seriesData = matchedAudiencesByDays.map((e) => {
          const cpm = e.impressions ? e.revenue / (e.impressions / 1000) : 0;
          return {
            y: cpm,
            text: currency({ currency: '$', value: cpm }),
          };
        });
        break;
      case 'revenue':
      default:
        seriesData = publisherTraffic.map((e) => {
          return {
            y: e.revenue,
            text: currency({ currency: this.audienceCurrency, value: e.revenue }),
          };
        });
        break;
    }
    return seriesData;
  }

  updateChart(): void {
    if (!this.publisherTraffic) return;
    const publisherTraffic = this.publisherTrafficForPeriod;
    const plotSize = round(parseInt(this.chartPeriod, 10) / PLOT_SIZE_TO_SERIES_LENGTH_RATIO, 2);

    const traffic = publisherTraffic.map((e) => {
      return {
        y: e.traffic,
        text: dashOnEmpty(formatNumber(e.traffic)),
      };
    });

    const categories = publisherTraffic.map(({ daysAgo }) => {
      return daysAgo.toString();
    });

    if (!this.isLoadedSuccessfully) {
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
            plotLines: [{}],
          },
          xAxis: {
            ...DefaultChartOptions(categories).xAxis,
            labels: FormatLabelsXAxis(publisherTraffic.length),
          },
          series: [
            {
              type: 'line',
              name: '',
              data: traffic.map((e) => {
                return { ...e, y: 0.5 };
              }),
              marker: { enabled: false },
            },
            {
              type: 'line',
              name: '',
              data: traffic.map((e) => {
                return { ...e, y: 0.05 };
              }),
              marker: { enabled: false },
            },
          ],
        },
      };
      return;
    }

    const series: SeriesOptionsType[] = [];
    Object.values(this.summary).forEach((summary) => {
      if (summary.switchable !== false) {
        series.push({
          visible: !!summary.active,
          states: {
            hover: {
              halo: {
                size: 8,
              },
            },
          },
          yAxis: summary.yAxis,
          marker: {
            radius: 3,
          },
          clip: false,
          type: 'spline',
          name: summary.label,
          data: summary.seriesData,
          point: { events: ShowPlotBandOnHover(plotSize) },
        });
      }
    });

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
        yAxis: new Array(CHARTS_COUNT).fill(null).map(() => {
          return {
            tickAmount: 4,
            title: {
              text: '',
            },
            labels: {
              enabled: false,
            },
          };
        }),
        xAxis: {
          ...DefaultChartOptions(categories).xAxis,
          labels: FormatLabelsXAxis(publisherTraffic.length),
        },
        series: [
          ...[
            {
              visible: true,
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
              yAxis: 1,
              clip: false,
              type: 'spline',
              name: 'Traffic',
              data: traffic,
              point: { events: ShowPlotBandOnHover(plotSize) },
            } as SeriesOptionsType,
          ],
          ...series,
        ],
      },
    };
  }
}
</script>

<style lang="scss" scoped>
.overview-chart {
  padding: 64px;
  background: $white;
  border-radius: 10px;

  .chart-header {
    .chart-header__title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      .heading-2 {
        font-size: 32px;
      }

      .filters {
        margin-top: 16px;
      }
    }
  }
}
</style>
