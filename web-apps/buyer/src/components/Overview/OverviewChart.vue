<template>
  <div class="custom-chart custom-chart--white overview-chart">
    <div v-if="true" class="chart-header">
      <div class="chart-header__title">
        <div class="heading-2">Overview</div>
        <div class="filters">
          <base-dropdown
            :items="filterPeriodItems"
            :value="chartPeriod"
            @selected-value="onSelectedPeriod"
          />
        </div>
      </div>
      <chart-summary :stats="summary" @item-click="onSummaryItemClick" />
    </div>
    <Highcharts v-if="chartOptions" :options="chartOptions" class="chart" />
  </div>
</template>

<script lang="ts">
import Highcharts, { SeriesOptionsType } from 'highcharts';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createHighcharts } from 'vue-highcharts';

import BaseDropdown from '@/components/UI/BaseDropdown.vue';
import ChartSummary from '@/components/UI/Chart/ChartSummary.vue';
import {
  DefaultChartOptions,
  FormatLabelsXAxis,
  ShowPlotBandOnHover,
  TooltipFormatter,
} from '@/utils/highcharts-custom';
import { MatchedAudiencesTraffic } from '@/store/types';
import { PublisherTraffic } from '../../../functions/types';
import { getCurrency, dashOnEmpty, getFormattedNumber } from '@/utils/filters';
import { round } from '@/utils';
import { defineComponent, ref, computed, Ref } from 'vue';

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

export default defineComponent({
  name: 'OverviewChart',
  components: {
    BaseDropdown,
    ChartSummary,
    Highcharts: createHighcharts('Highcharts', Highcharts),
  },
  props: {
    publisherTraffic: {
      type: Array as () => PublisherTraffic[],
      required: true,
    },
    matchedAudiencesByDays: {
      type: Array as () => MatchedAudiencesTraffic[],
      required: true,
    },
    isLoadedSuccessfully: { type: Boolean, required: true },
    audienceCurrency: { type: String, required: true },
  },
  setup(props) {
    const chartPeriod = ref('30');

    const filterPeriodItems = computed((): { [key: string]: string } => {
      return {
        '30': 'Last 30 days',
        '14': 'Last 14 days',
        '7': 'Last 7 days',
      };
    });

    const onSelectedPeriod = (period: string): void => {
      chartPeriod.value = period;
      updateChart();
    };

    const secondChartSeries = ref('spend');
    const onSummaryItemClick = (id: string): void => {
      secondChartSeries.value = id;
      updateChart();
    };

    const summaryItemSeriesData = (series: string): SeriesData[] => {
      const publisherTraffic = publisherTrafficForPeriod.value;

      const matchedAudiencesByDays = matchedAudiencesByDaysForPeriod.value;

      let seriesData: { y: number; text: string }[];
      switch (series) {
        case 'impressions':
          seriesData = matchedAudiencesByDays.map((e) => {
            return {
              y: e.impressions,
              text: dashOnEmpty(getFormattedNumber(e.impressions)),
            };
          });
          break;
        case 'users-predicted':
          seriesData = matchedAudiencesByDays.map((e) => {
            return {
              y: e.uniques,
              text: dashOnEmpty(getFormattedNumber(e.uniques)),
            };
          });
          break;
        case 'audience-pageviews':
          seriesData = matchedAudiencesByDays.map((e) => {
            return {
              y: e.pageViews,
              text: dashOnEmpty(getFormattedNumber(e.pageViews)),
            };
          });
          break;
        case 'average-cpm':
          seriesData = matchedAudiencesByDays.map((e) => {
            const cpm = e.impressions ? e.spend / (e.impressions / 1000) : 0;
            return {
              y: cpm,
              text: getCurrency({ currency: '$', value: cpm }),
            };
          });
          break;
        case 'spend':
        default:
          seriesData = publisherTraffic?.map((e) => {
            return {
              y: e.spend,
              text: getCurrency({
                currency: props.audienceCurrency,
                value: e.spend,
              }),
            };
          });
          break;
      }
      return seriesData;
    };

    const publisherTrafficForPeriod = computed((): PublisherTraffic[] => {
      return props.publisherTraffic?.slice(
        props.publisherTraffic.length - parseInt(chartPeriod.value, 10)
      );
    });

    const matchedAudiencesByDaysForPeriod = computed(
      (): MatchedAudiencesTraffic[] => {
        return props.matchedAudiencesByDays?.slice(
          props.matchedAudiencesByDays.length - parseInt(chartPeriod.value, 10)
        );
      }
    );

    const summary = computed(
      (): OverviewSummary => {
        const publisherTraffic = publisherTrafficForPeriod.value;
        const matchedAudiencesByDays = matchedAudiencesByDaysForPeriod.value;

        const trafficCount = publisherTraffic?.reduce(
          (acc, e) => acc + e.traffic,
          0
        );
        const traffic = dashOnEmpty(getFormattedNumber(trafficCount, 0));

        const totalSpendValue = matchedAudiencesByDays?.reduce(
          (acc, e) => acc + e.spend,
          0
        );
        const totalSpend = totalSpendValue
          ? getCurrency({
              currency: props.audienceCurrency,
              value: totalSpendValue,
            })
          : '-';
        const totalImpressionsValue = matchedAudiencesByDays?.reduce(
          (acc, e) => acc + e.impressions,
          0
        );
        const totalImpressions = dashOnEmpty(
          getFormattedNumber(totalImpressionsValue)
        );
        const totalUsersPredicted = dashOnEmpty(
          getFormattedNumber(
            matchedAudiencesByDays?.reduce((acc, e) => acc + e.uniques, 0)
          )
        );
        const totalAudiencePageViews = dashOnEmpty(
          getFormattedNumber(
            matchedAudiencesByDays?.reduce((acc, e) => acc + e.pageViews, 0)
          )
        );
        const averageCPM =
          totalSpendValue && totalImpressionsValue
            ? getCurrency({
                currency: '$',
                value: totalSpendValue / (totalImpressionsValue / 1000),
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
          spend: {
            label: 'Spend',
            bulletClass: 'highcharts-color-1',
            value: totalSpend,
            active: secondChartSeries.value === 'spend',
            seriesData:
              secondChartSeries.value === 'spend'
                ? summaryItemSeriesData('spend')
                : [],
            yAxis: 2,
          },
          impressions: {
            label: 'Impressions bought',
            bulletClass: 'highcharts-color-2',
            value: totalImpressions,
            active: secondChartSeries.value === 'impressions',
            seriesData:
              secondChartSeries.value === 'impressions'
                ? summaryItemSeriesData('impressions')
                : [],
            yAxis: 3,
          },
          'users-predicted': {
            label: 'Unique users',
            bulletClass: 'highcharts-color-3',
            value: totalUsersPredicted,
            active: secondChartSeries.value === 'users-predicted',
            seriesData:
              secondChartSeries.value === 'users-predicted'
                ? summaryItemSeriesData('users-predicted')
                : [],
            yAxis: 4,
          },
          'audience-pageviews': {
            label: 'Audience pageviews',
            bulletClass: 'highcharts-color-4',
            value: totalAudiencePageViews,
            active: secondChartSeries.value === 'audience-pageviews',
            seriesData:
              secondChartSeries.value === 'audience-pageviews'
                ? summaryItemSeriesData('audience-pageviews')
                : [],
            yAxis: 5,
          },
          'average-cpm': {
            label: 'Average CPM',
            bulletClass: 'highcharts-color-5',
            value: averageCPM,
            active: secondChartSeries.value === 'average-cpm',
            seriesData:
              secondChartSeries.value === 'average-cpm'
                ? summaryItemSeriesData('average-cpm')
                : [],
            yAxis: 6,
          },
        };
      }
    );

    const chartOptions: Ref<Highcharts.Options | null> = ref(null);

    const updateChart = (): void => {
      if (!props.publisherTraffic) return;
      const publisherTraffic = publisherTrafficForPeriod.value;
      const plotSize = round(
        parseInt(chartPeriod.value, 10) / PLOT_SIZE_TO_SERIES_LENGTH_RATIO,
        2
      );

      const traffic = publisherTraffic.map((e) => {
        return {
          y: e.traffic,
          text: dashOnEmpty(getFormattedNumber(e.traffic)),
        };
      });

      const categories = publisherTraffic.map(({ day }) => {
        return day;
      });

      if (!props.isLoadedSuccessfully) {
        chartOptions.value = {
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
      Object.values(summary.value).forEach((summaryItem) => {
        if (summaryItem.switchable !== false) {
          series.push({
            visible: !!summaryItem.active,
            states: {
              hover: {
                halo: {
                  size: 8,
                },
              },
            },
            yAxis: summaryItem.yAxis,
            marker: {
              radius: 3,
            },
            clip: false,
            type: 'spline',
            name: summaryItem.label,
            data: summaryItem.seriesData,
            point: { events: ShowPlotBandOnHover(plotSize) },
          });
        }
      });

      chartOptions.value = {
        ...DefaultChartOptions(categories),
        ...{
          tooltip: {
            ...DefaultChartOptions(categories).tooltip,
            ...{
              formatter() {
                return TooltipFormatter(this);
              },
            },
          },
          xAxis: {
            ...DefaultChartOptions(categories).xAxis,
            labels: FormatLabelsXAxis(publisherTraffic.length),
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
    };

    return {
      filterPeriodItems,
      chartPeriod,
      chartOptions,
      summary,
      onSelectedPeriod,
      onSummaryItemClick,
      updateChart,
    };
  },
  created(): void {
    this.updateChart();
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/global';
@import 'src/styles/highcharts';
@import 'src/styles/custom-charts';

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
