<template>
  <div class="ag-box">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@import 'src/styles/colors';
@import 'src/styles/shadows';

.ag-box {
  background: $white;
  box-shadow: $shadow-0;
  border-radius: 10px;
  padding: 32px;
}
</style>
