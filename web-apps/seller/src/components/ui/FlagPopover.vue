<template>
  <div class="flag-wrap" @mouseover="setShowPopover(true)" @mouseleave="setShowPopover(false)">
    <base-popover :is-active="showPopover">
      <template #content>
        <flag-icon :is-error="isUrlSent" :is-solid-icon="isSolidIcon"></flag-icon>
      </template>
      <template #popover-content>
        <div class="flag-popover-info">
          <span v-if="!notified">
            Something is not right? Notify our team and we’ll look into it.
          </span>
          <span v-else> Thanks, we’ve been notified. </span>
        </div>
      </template>
    </base-popover>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import BasePopover from '@/components/ui/BasePopover.vue';
import FlagIcon from '@/components/ui/icons/Flag.vue';

@Component({
  components: { BasePopover, FlagIcon },
})
export default class FlagPopover extends Vue {
  @Prop({ default: false }) notified!: boolean;
  showPopover = false;

  get isSolidIcon(): boolean {
    return this.notified;
  }

  get isUrlSent(): boolean {
    return this.showPopover || this.notified;
  }

  setShowPopover(state: boolean): void {
    this.showPopover = state;
  }
}
</script>

<style lang="scss" scoped>
.flag-wrap {
  height: 16px;
  width: 16px;
}

.flag-popover-info {
  padding: 2px 20px;
  text-align: center;
  width: 148px;

  span {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
  }
}
</style>
