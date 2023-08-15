<template>
  <div class="custom-chart custom-chart--electric feature-chart">
    <base-overlay v-if="!isIntegrationCheckSuccessful">
      <div class="custom-chart__no-integration">
        <div class="custom-chart__no-integration-icon">
          <cog />
        </div>
        <div class="custom-chart__no-integration-text">
          <h3>Complete the site integration</h3>
          <p class="paragraph-small">
            Please complete the site integration steps so we can begin extracting features.
          </p>
        </div>
        <base-button
          class="custom-chart__no-integration-action"
          @click="goToIntegration"
          :theme="BUTTON_THEMES.black"
          :size="BUTTON_SIZES.medium"
        >
          Get started
        </base-button>
      </div>
    </base-overlay>
    <error-overlay v-else-if="!isLoadedSuccessfully" />
    <template v-if="chartOptions">
      <div v-if="summary" class="chart-header">
        <div class="chart-header__title">
          <div class="heading-2">Crawl stats</div>
          <p class="paragraph-large">Last 7 days</p>
        </div>
        <chart-summary :stats="summary" :is-wide="true" />
      </div>
      <charts :options="chartOptions" class="chart" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BaseButton, { BUTTON_THEMES, BUTTON_SIZES } from '@/components/ui/BaseButton.vue';
import ChartSummary from '@/components/ui/ChartSummary.vue';
import BaseOverlay from '@/components/ui/BaseOverlay.vue';
import Cog from '@/assets/icons/cog.svg?inline';
import SimpleCircle from '@/components/ui/icons/SimpleCircle.vue';
import { ChartSummaryStats, PageCrawlsStat } from '@/store/types';
import { Chart as Charts } from 'highcharts-vue';
import { averageValueByKey } from '@/utils';
import { dashOnEmpty, formatNumber } from '@/utils/filters';
import ErrorOverlay from '@/components/ui/ErrorOverlay.vue';
import {
  DefaultChartOptions,
  EMPTY_CHART_VALUE,
  ShowPlotBandOnHover,
  TooltipFormatter,
} from '@/utils/highcharts-custom';
import router from '@/routes';
import Highcharts from 'highcharts';

@Component({
  components: {
    BaseButton,
    BaseOverlay,
    Charts,
    ChartSummary,
    Cog,
    ErrorOverlay,
    SimpleCircle,
  },
})
export default class FeaturesChart extends Vue {
  @Prop({ type: Array, required: true }) stats!: PageCrawlsStat[];
  @Prop({ type: Boolean, required: true }) isIntegrationCheckSuccessful!: boolean;
  @Prop({ type: Boolean, required: true }) isLoadedSuccessfully!: boolean;

  chartOptions: Highcharts.Options | null = null;
  BUTTON_THEMES = BUTTON_THEMES;
  BUTTON_SIZES = BUTTON_SIZES;

  async created(): Promise<void> {
    await this.getStats();
  }

  goToIntegration(): void {
    router.push('/integration');
  }

  get isCrawled(): boolean {
    return !!this.stats.length;
  }

  get crawledYesterday(): string {
    return this.isCrawled
      ? formatNumber(this.stats.sort((a, b) => a.daysAgo - b.daysAgo)[1].pagesCrawled)
      : '-';
  }

  get averagePagesPerDay(): string {
    const average = this.isCrawled ? averageValueByKey(this.stats, 'pagesCrawled') : 0;
    return dashOnEmpty(formatNumber(average, 0));
  }

  get summary(): ChartSummaryStats {
    return {
      'Pages crawled yesterday': {
        bulletClass: '',
        statLabel: this.crawledYesterday,
      },
      'Average pages per day': {
        bulletClass: undefined,
        statLabel: this.averagePagesPerDay,
      },
    };
  }

  async getStats(): Promise<void> {
    await this.getCrawled();
  }

  async getCrawled(): Promise<void> {
    if (this.stats.length === 0) {
      const seriesData =
        this.isIntegrationCheckSuccessful && this.isLoadedSuccessfully ? [EMPTY_CHART_VALUE] : [];
      const line =
        this.isIntegrationCheckSuccessful && this.isLoadedSuccessfully
          ? { value: EMPTY_CHART_VALUE }
          : {};

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
          series: [{ type: 'line', name: '', data: seriesData }],
        },
      };
      return;
    }

    const categories = this.stats
      .sort((a, b) => b.daysAgo - a.daysAgo)
      .map(({ daysAgo }) => {
        return daysAgo.toString();
      });

    const pagesCrawled = this.stats
      .sort((a, b) => b.daysAgo - a.daysAgo)
      .map((stat) => {
        return {
          y: stat.pagesCrawled,
          text: formatNumber(stat.pagesCrawled),
        };
      });

    this.chartOptions = {
      ...DefaultChartOptions(categories),
      ...{
        tooltip: {
          shared: true,
          useHTML: true,
          borderRadius: 20,
          padding: 12,

          shadow: {
            width: 4,
            offsetX: 0,
            offsetY: 1,
            opacity: 0.15,
          },
          formatter(this: Highcharts.TooltipFormatterContextObject) {
            return TooltipFormatter(this);
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
            marker: {
              radius: 3,
            },
            clip: false,
            type: 'line',
            name: 'Pages crawled',
            data: pagesCrawled,
            point: { events: ShowPlotBandOnHover(0.15) },
          },
        ],
      },
    };
  }
}
</script>

<style lang="scss" scoped>
.feature-chart {
  .custom-chart__no-integration {
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    background: linear-gradient(
      122.14deg,
      $electric-chart-main-color-gradient 0%,
      $electric-blue 69.29%
    );
    opacity: 0.9;

    .button {
      font-weight: 600;
      font-size: 16px;
      line-height: 16px;
    }

    .button:hover {
      background-color: $white;
      color: $electric-blue;
    }

    .custom-chart__no-integration-text {
      text-align: center;
      margin: 20px 0 24px;

      h3,
      p {
        margin: 0;
      }

      h3 {
        font-weight: 600;
        font-size: 18px;
        line-height: 22px;
        margin-bottom: 10px;
        color: $white;
      }

      p {
        color: rgba($white, 0.8);
        max-width: 267px;
      }
    }

    .custom-chart__no-integration-action {
      width: 196px;
    }
  }
}

.custom-chart__no-integration-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: $dark-grey-7;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: $electric-blue;
    width: 34px;
  }
}
</style>
