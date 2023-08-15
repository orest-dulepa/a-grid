<template>
  <div class="hide-table-row-value">
    <div v-if="isHiddenValue" class="hide"></div>
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
  name: 'HideTableRowValue',
  props: {
    isHidden: Boolean,
  },
  setup(props) {
    const { isHidden } = toRefs(props);

    return {
      isHiddenValue: isHidden,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/colors';

.hide-table-row-value {
  .hide {
    width: 36px;
    height: 16px;
    background-color: $color-6;
    border-radius: 20px;
  }
}
</style>
