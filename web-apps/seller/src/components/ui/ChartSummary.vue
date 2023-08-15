<template>
  <nav class="chart-summary">
    <chart-summary-item
      v-for="(stat, name) in stats"
      :key="name"
      :stat-label="stat.statLabel"
      :legend="name"
      :bullet-class="stat.bulletClass"
      :is-wide="isWide"
    />
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ChartSummaryItem from '@/components/ui/ChartSummaryItem.vue';
import { ChartSummaryStats } from '@/store/types';

@Component({
  components: {
    ChartSummaryItem,
  },
})
export default class ChartSummary extends Vue {
  @Prop({ type: Object, required: true }) readonly stats!: ChartSummaryStats;
  @Prop({ type: Boolean, default: false }) isWide!: boolean;
}
</script>

<style lang="scss" scoped>
.chart-summary {
  display: flex;
  flex-direction: row;
}

.chart-summary .chart-summary-item {
  margin: 0 8px;
}

.chart-summary .chart-summary-item:last-child {
  margin-right: 0;
}
</style>
