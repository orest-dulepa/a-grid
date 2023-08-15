<template>
  <div
    class="chart-summary-item"
    :class="{ active: isActive, switchable: isSwitchable }"
    @click="onClick"
  >
    <simple-circle v-if="bulletClass !== null" :class="bulletClass" />
    <div>
      <span class="label">{{ statLabel }}</span>
      <p class="value">
        <span>{{ value }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import SimpleCircle from '@/components/UI/Icons/SimpleCircle.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChartSummaryItem',
  components: {
    SimpleCircle,
  },
  props: {
    statLabel: { type: [String, Number], required: true },
    id: { type: String, required: true },
    value: { type: String, required: true },
    bulletClass: { type: String },
    isActive: { type: Boolean, default: false },
    isSwitchable: { type: Boolean, default: true },
  },
  emits: ['item-click'],
  setup(props, { emit }) {
    const onClick = (): void => {
      if (props.isSwitchable) {
        emit('item-click', props.id);
      }
    };

    return {
      onClick,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/global';
@import '@/styles/custom-charts';

$grey-circle: #d5d5d5;

.chart-summary-item {
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
