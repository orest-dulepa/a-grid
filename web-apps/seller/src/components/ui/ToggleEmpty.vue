<template>
  <div class="toggle" :class="{ 'toggle--open': isOpen, 'toggle--disabled': !isActive }">
    <div class="toggle__header" @click="toggleOpen">
      <slot name="header" />
    </div>
    <div v-if="isActive" class="toggle__body">
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Toggle extends Vue {
  @Prop({ type: Boolean, default: true }) isActive!: boolean;
  isOpen = false;

  toggleOpen(): void {
    this.isOpen = this.isActive && !this.isOpen;
  }
}
</script>

<style lang="scss" scoped>
.toggle__header {
  cursor: pointer;
}

.toggle--disabled .toggle__header {
  cursor: initial;
}

.toggle__body {
  display: none;
}

.toggle--open .toggle__body {
  display: block;
}
</style>
