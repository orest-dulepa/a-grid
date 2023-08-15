<template>
  <div class="chart-summary-item" :class="{ 'chart-summary-item__wide': isWide }">
    <div>
      <p class="stat">{{ statLabel | dashOnEmpty }}</p>
      <p class="legend">
        <simple-circle v-if="bulletClass !== undefined" :class="bulletClass" />
        <span>{{ legend }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SimpleCircle from '@/components/ui/icons/SimpleCircle.svg?inline';
import { dashOnEmpty } from '@/utils/filters';

@Component({
  components: {
    SimpleCircle,
  },
  filters: {
    dashOnEmpty,
  },
})
export default class ChartSummaryItem extends Vue {
  @Prop({ type: [String, Number], required: true }) statLabel!: string | number;
  @Prop({ type: String, required: true }) legend!: string;
  @Prop({ type: String, required: false }) bulletClass!: string;
  @Prop({ type: Boolean, default: false }) isWide!: boolean;
}
</script>

<style lang="scss" scoped>
.chart-summary-item {
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  box-sizing: border-box;
  width: 167px;
  height: 98px;
  padding: 24px;

  &.chart-summary-item__wide {
    width: 225px;
  }
}

.stat {
  font-size: 24px;
  font-weight: bold;
  line-height: 24px;
  padding: 0;
  margin-top: 0;
  margin-bottom: 10px;
  text-transform: uppercase;
  color: $white;
}

.legend {
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: $white;
  margin: 0;
}

.legend span {
  opacity: 0.8;
}

.legend svg {
  width: 8px;
  height: 10px;
  overflow: visible;
  margin-right: 8px;
}
</style>
