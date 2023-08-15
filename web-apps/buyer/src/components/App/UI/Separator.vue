<template>
  <div class="separator">
    <hr class="separator-line" />
    <span class="separator-text">
      <slot></slot>
    </span>
    <hr class="separator-line" />
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/colors';

.separator {
  display: flex;
  align-items: stretch;
  justify-content: center;
  margin: 15px 0;
  width: 100%;
  max-width: 512px;

  &-text {
    margin: 0 8px;
    color: rgba($dark-grey-4, 0.5);
    font-weight: bold;
    font-size: 14px;
  }

  &-line {
    border: 0;
    border-top: 1px solid $light-grey-2;
    flex: 1;
    margin-top: 10px;
  }
}
</style>
