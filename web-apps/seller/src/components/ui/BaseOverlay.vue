<template>
  <div class="overlay" :class="{ 'overlay--fixed': isFixed }">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class BaseOverlay extends Vue {
  @Prop({ type: Boolean, default: false }) isFixed!: boolean;
}
</script>

<style lang="scss" scoped>
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
