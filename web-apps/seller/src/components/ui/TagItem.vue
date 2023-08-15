<template>
  <span class="ag-tag" :class="{ outlined: outlined }">
    <slot />
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TagItem extends Vue {
  @Prop({ default: false }) outlined!: boolean;
}
</script>

<style lang="scss" scoped>
$blue-outlined: #95aefa;

.ag-tag {
  color: $electric-blue;
  background: $light-blue;
  border-radius: 6px;
  height: 32px;
  margin: 4px;
  padding: 9px 10px;

  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  box-sizing: border-box;

  &.outlined {
    transition: all 0.1s;
    border: 1px solid;
    border-color: $blue-outlined;
    background: $white;
    cursor: pointer;
  }

  &.outlined:hover {
    border-color: #2c5ef6;
  }
}
</style>
