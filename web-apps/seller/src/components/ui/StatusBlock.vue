<template>
  <div class="status-block">
    <div class="status-block__indicator" :class="{ enabled: item.status === 'live' }">
      <tooltip-table :tooltip="textForTooltip(item.status)">
        <div class="indicator"></div>
      </tooltip-table>
      <div class="status-block__text">{{ item.status }}</div>
    </div>
    <label
      class="status-block__switch"
      :class="{
        enabled: item.status === 'live',
        disabled: disabled,
      }"
    >
      <input
        @change="changeStatus(item.id, item.status)"
        :disabled="disabled"
        type="checkbox"
        class="switch"
      />
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TooltipTable from '@/components/ui/TooltipTable.vue';
import { updateAudienceStatus } from '@/store/api';
import { AudienceStatus } from '@/store/types';

@Component({
  name: 'StatusBlock',
  components: { TooltipTable },
})
export default class StatusBlock extends Vue {
  @Prop({ type: Object, required: true }) item: { id: ''; status: '' } | undefined;
  @Prop({ type: Boolean, default: false }) disabled: boolean | undefined;

  textForTooltip(status: AudienceStatus): string {
    if (status === AudienceStatus.LIVE) {
      return 'This audience is live';
    }
    if (status === AudienceStatus.PAUSED) {
      return 'This audience is paused';
    }
    throw new Error('Invalid audience status found.');
  }

  async changeStatus(id: string, oldStatus: AudienceStatus): Promise<void> {
    if (this.disabled) return;
    const newStatus = await updateAudienceStatus(id, oldStatus);
    this.$emit(newStatus);
  }
}
</script>

<style lang="scss" scoped>
$dot-switch: #2b3961;
$dot-disabled: #e1e1e1;
$indicator: #a8a8a8;
$indicator-enabled: #02c038;
$border-switch: #e6e6e6;
.status-block {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &__indicator {
    display: flex;
    align-items: center;
    transition: background-color 0.3s;
    .indicator {
      cursor: pointer;
      margin-right: 6px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $border-switch;
    }
    .status-block__text {
      text-transform: capitalize;
      font-size: 14px;
      line-height: 14px;
      color: $dark-grey-1;
    }
    &.enabled {
      .indicator {
        background-color: $indicator-enabled;
      }
      .status-block__text {
        color: $dark-grey-4;
      }
    }
  }

  &__switch {
    cursor: pointer;
    position: relative;
    width: 30px;
    height: 18px;
    border-radius: 30px;
    border: 1px solid $border-switch;
    transition: 0.3s;
    &:before {
      position: absolute;
      top: 3px;
      left: 4px;
      content: '';
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: $dot-switch;
    }
    &.enabled {
      background: #dfe7fe;
      &:before {
        left: unset;
        right: 4px;
        background-color: $electric-blue;
      }
    }
    &.disabled {
      &:before {
        background: $dot-disabled;
      }
    }
    .switch {
      visibility: hidden;
    }
  }
}
</style>
