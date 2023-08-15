<template>
  <div
    class="ag-container"
    :class="{
      'ag-container--large': isLarge,
      'ag-container--nav-large': isNavLarge,
    }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Container',
  props: {
    isLarge: Boolean,
    isNavLarge: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.ag-container {
  width: 100%;
  margin: 80px auto 0;
  max-width: 1024px;
}

.ag-container.ag-container--large {
  width: 1216px;
  max-width: 100%;
}
.ag-container.ag-container--nav-large {
  margin-top: 64px;
}
</style>
