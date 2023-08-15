<template>
  <div class="tooltip-box">
    <div class="tooltip-content">
      <slot />
    </div>
    <div class="tooltip" :class="{ 'for-details': forDetails }">
      <span class="text">{{ tooltip }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TooltipTable',
  props: {
    tooltip: { type: String, required: true },
    forDetails: { type: String, required: false },
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

.tooltip-content {
  display: flex;
  align-items: center;

  &:hover + .tooltip {
    visibility: visible;
    opacity: 1;
  }
}

.tooltip {
  color: $white;
  text-align: center;
  padding: 12px;
  font-size: 12px;
  line-height: 14px;
  font-weight: 500;

  top: 21px;
  left: 50%;
  transform: translateX(-50%);

  width: 133px;

  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s;

  position: absolute;
  z-index: 1;
  background: rgba(23, 23, 23, 0.9);
  box-shadow: $shadow-4;
  border-radius: 10px;

  &.for-details {
    margin-top: 20px;
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
</style>
