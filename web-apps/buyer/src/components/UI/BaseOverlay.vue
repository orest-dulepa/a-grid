<template>
  <div class="overlay" :class="{ 'overlay--fixed': isFixed }">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseOverlay',
  props: {
    isFixed: { type: Boolean, default: false },
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/variables.scss';

div:has(.overlay) {
  position: relative;
}
.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  transition: 0.5s ease;
  z-index: $z-overlay;

  &.overlay--fixed {
    position: fixed;
  }
}
</style>
