<template>
  <nav class="chart-summary">
    <chart-summary-item
      v-for="(stat, index) in stats"
      :key="index"
      :id="index"
      :stat-label="stat.label"
      :value="stat.value"
      :bullet-class="stat.bulletClass"
      :is-active="stat.active"
      :is-switchable="stat.switchable"
      v-on:item-click="onItemClick"
    />
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChartSummaryItem from './ChartSummaryItem.vue';
import { ChartSummaryStats } from '@/store/types';

type SeriesData = { y: number; text: string };

export type ChartSummaryType = Record<
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
  components: {
    ChartSummaryItem,
  },
  props: {
    stats: { type: Object, required: true } as () => ChartSummaryStats,
  },
  emits: ['item-click'],
  setup(props, { emit }) {
    const onItemClick = (id: string): void => {
      emit('item-click', id);
    };

    return {
      onItemClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.chart-summary {
  display: flex;
  flex-direction: row;

  .chart-summary-item {
    margin-right: 17px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
