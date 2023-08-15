<template>
  <div
    class="ag-container"
    :class="{ 'ag-container--large': isLarge, 'ag-container--nav-large': isNavLarge }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Container extends Vue {
  @Prop({ default: false }) isLarge!: boolean;
  @Prop({ default: false }) isNavLarge!: boolean;
}
</script>

<style lang="scss" scoped>
.ag-container {
  width: 1024px;
  margin: 80px auto 0;
}

.ag-container.ag-container--large {
  width: 1216px;
}
.ag-container.ag-container--nav-large {
  margin-top: 64px;
}
</style>
