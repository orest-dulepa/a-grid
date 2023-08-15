<template>
  <nav class="chart-summary">
    <chart-summary-overview-item
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import ChartSummaryOverviewItem from '@/components/ui/ChartSummaryOverviewItem.vue';
import { ChartSummaryStats } from '@/store/types';

@Component({
  components: {
    ChartSummaryOverviewItem,
  },
})
export default class ChartSummaryOverview extends Vue {
  @Prop({ type: Object, required: true }) readonly stats!: ChartSummaryStats;

  onItemClick(id: string): void {
    this.$emit('item-click', id);
  }
}
</script>

<style lang="scss" scoped>
.chart-summary {
  display: flex;
  flex-direction: row;
}

.chart-summary .chart-summary-overview-item {
  margin: 0 8px;
}

.chart-summary .chart-summary-overview-item:last-child {
  margin-right: 0;
}

.chart-summary .chart-summary-overview-item:first-child {
  margin-left: 0;
  margin-right: 0;
}
</style>
