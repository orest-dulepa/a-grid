<template>
  <div
    class="ag-popover"
    :class="{ active: showPopover }"
    @mouseover="setShowPopover(true)"
    @mouseleave="setShowPopover(false)"
  >
    <div class="ag-popover__content">
      <slot name="content" />
    </div>
    <div class="ag-popover__main">
      <div class="ag-popover__arrow"></div>
      <div>
        <slot name="popover-content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'BasePopover',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const showPopover = ref(false);
    let showPopoverTimeoutId: number | null = null;

    const setShowPopover = async (state: boolean): Promise<void> => {
      if (showPopoverTimeoutId) clearTimeout(showPopoverTimeoutId);

      showPopoverTimeoutId = setTimeout(() => {
        showPopover.value = state;
      }, 300);
    };

    watch(props.isActive, () => {
      setShowPopover(props.isActive);
    });

    return {
      showPopover,
      setShowPopover,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/colors';
@import 'src/styles/variables';

$popover-padding-y: 10px;
.ag-popover {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.ag-popover .ag-popover__main {
  transition: opacity 0.2s;
  opacity: 0;
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background-color: $dark-grey-4;
  color: $white;
  padding: $popover-padding-y 0;
  top: 28px;
  z-index: $z-negative;
}

.ag-popover__arrow {
  $arrow-height: 5px;
  $arrow-width: 8px;
  width: 0;
  height: 0;
  border-left: $arrow-width solid transparent;
  border-right: $arrow-width solid transparent;
  border-bottom: $arrow-height solid black;
  margin-top: calc((#{$arrow-height} - 1px + #{$popover-padding-y}) * -1);
  z-index: $z-popover;
  margin-bottom: calc(#{$popover-padding-y} - 1px);
  position: relative;
}

.ag-popover.active .ag-popover__main {
  opacity: 1;
  z-index: $z-popover;
}
</style>
