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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class BasePopover extends Vue {
  @Prop({ default: false }) isActive!: boolean;
  showPopover = false;
  showPopoverTimeoutId: number | null = null;

  @Watch('isActive')
  onIsActiveChanged(): void {
    this.setShowPopover(this.isActive);
  }

  async setShowPopover(state: boolean): Promise<void> {
    if (this.showPopoverTimeoutId) clearTimeout(this.showPopoverTimeoutId);

    this.showPopoverTimeoutId = setTimeout(() => {
      this.showPopover = state;
    }, 300);
  }
}
</script>

<style lang="scss" scoped>
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
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
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
