<template>
  <div class="tooltip-box">
    <slot />
    <div
      class="tooltip"
      :class="{ 'for-auth': forAuth, 'for-table': forTable }"
    >
      <span class="text">{{ primaryText }}</span>
      <div class="text secondary-text">{{ secondaryText }}</div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Tooltip',
  props: {
    primaryText: {
      type: String,
      required: true,
    },
    secondaryText: {
      type: String,
      required: false,
    },
    forAuth: {
      type: Boolean,
      required: false,
    },
    forTable: {
      type: Boolean,
      required: false,
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/colors';
@import '@/styles/shadows';

.tooltip-box {
  position: relative;
  display: flex;
}

.status-button:hover + .tooltip {
  visibility: visible;
}

.tooltip {
  color: $white;
  text-align: center;
  padding: 16px;
  font-size: 12px;
  line-height: 14px;
  font-weight: 500;

  width: 236px;
  top: 100%;
  left: 0;
  margin-left: -60px;

  visibility: hidden;
  transition: opacity 0.3s;

  position: absolute;
  z-index: 100;
  background: rgba(23, 23, 23, 0.9);
  box-shadow: $shadow-4;
  border-radius: 10px;

  &.for-auth {
    margin-top: 10px;
    margin-left: -155px;
  }

  &.for-table {
    width: auto;
    padding: 12px 12px 2px 12px;
    margin-left: 0;
    white-space: nowrap;
  }
}

.text::after {
  content: ' ';
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent rgba(23, 23, 23, 0.9) transparent;
}

.secondary-text {
  margin-top: 10px;
  font-size: 10px;
  color: $grey-2;
}
</style>
