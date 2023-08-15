<template>
  <div
    class="chart-summary-overview-item"
    :class="{ active: isActive, switchable: isSwitchable }"
    @click="onClick"
  >
    <simple-circle v-if="bulletClass !== null" :class="bulletClass" />
    <div>
      <span class="label">{{ statLabel }}</span>
      <p class="value">
        <span>{{ value | dashOnEmpty }}</span>
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
export default class ChartSummaryOverviewItem extends Vue {
  @Prop({ type: [String, Number], required: true }) statLabel!: string | number;
  @Prop({ type: String, required: true }) id!: string;
  @Prop({ type: String, required: true }) value!: string;
  @Prop({ type: String }) bulletClass!: string;
  @Prop({ type: Boolean, default: false }) isActive!: boolean;
  @Prop({ type: Boolean, default: true }) isSwitchable!: boolean;

  onClick(): void {
    if (this.isSwitchable) {
      this.$emit('item-click', this.id);
    }
  }
}
</script>

<style lang="scss" scoped>
$grey-circle: #d5d5d5;

.chart-summary-overview-item {
  transition: all 0.2s;
  position: relative;
  border-radius: 10px;
  box-sizing: border-box;
  width: 168px;
  height: 110px;
  padding: 24px;

  background-color: $white;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.04), 0 4px 15px rgba(0, 0, 0, 0.06);

  &.active {
    background-color: $dark-grey-7;
    box-shadow: none;
  }

  svg,
  .label,
  span {
    transition: all 0.2s;
  }

  &.switchable:not(.active) {
    .label {
      color: rgba($dark-grey-1, 0.5);
    }

    .value {
      color: rgba($dark-grey-4, 0.5);
    }

    &:not(:hover) {
      svg {
        color: $grey-circle;
        stroke: $grey-circle;
      }
    }

    &:hover {
      .label {
        color: $dark-grey-1;
      }

      .value {
        color: $dark-grey-4;
      }

      background-color: $white;
      box-shadow: 0 2px 2px rgba($black, 0.04), 0 4px 15px rgba($black, 0.1);
    }
  }

  &.switchable {
    cursor: pointer;
    user-select: none;
  }

  .label {
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    color: rgba($dark-grey-1, 0.8);
  }

  .value {
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 24px;
    color: $dark-grey-4;
    margin-top: 20px;
  }

  svg {
    position: absolute;
    top: -3px;
    left: -3px;
    border: 4px solid white;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    overflow: visible;
    margin-right: 8px;
  }
}
</style>
