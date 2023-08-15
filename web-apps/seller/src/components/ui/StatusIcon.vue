<template>
  <base-popover>
    <template #content>
      <span class="status" :class="{ 'status--live': isLive }">
        <span class="small-circle" />
      </span>
    </template>
    <template #popover-content>
      <span class="status__popover">Status: {{ status | capitalize }}</span>
    </template>
  </base-popover>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BasePopover from '@/components/ui/BasePopover.vue';
import { capitalize } from '@/utils/filters';

@Component({
  components: { BasePopover },
  filters: { capitalize },
})
export default class StatusIcon extends Vue {
  @Prop({ type: String, required: true }) status!: string;
  @Prop({ type: Boolean, default: true }) isLive!: boolean;
}
</script>

<style lang="scss" scoped>
.status {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: $grey-4;
  border-radius: 6px;

  &.status--live {
    background: rgba($green, 0.2);

    .small-circle {
      background: $green;
    }
  }

  .small-circle {
    display: inline-block;
    margin: 6px;
    width: 8px;
    height: 8px;
    border-radius: 50%;

    background: $dark-grey-6;
  }
}

.status__popover {
  white-space: nowrap;
  margin: 3.5px 20px 2px;
}
</style>
