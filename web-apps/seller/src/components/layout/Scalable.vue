<template>
  <div class="scalable" :class="{ 'scalable--dashboard': isDashboard }">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Container extends Vue {
  @Prop({ type: Boolean, default: false }) isDashboard!: boolean;
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: $breakpoint-big-tablet) {
  .scalable {
    width: $scale-width-tablet;
    transform: scale($scale-tablet);
    transform-origin: 0 top;
    position: absolute;

    &.scalable--dashboard {
      width: $scale-width-dashboard-big-tablet;
      transform: scale($scale-dashboard-big-tablet);
    }
  }
}
@media screen and (max-width: $breakpoint-tablet) {
  .scalable {
    width: $scale-width-tablet;
    transform: scale($scale-tablet);
    transform-origin: 0 top;
    position: absolute;

    &.scalable--dashboard {
      width: $scale-width-dashboard-tablet;
      transform: scale($scale-dashboard-tablet);
    }
  }
}
@media screen and (max-width: $breakpoint-mobile) {
  .scalable {
    width: $scale-width-mobile;
    transform: scale($scale-mobile);
    transform-origin: 0 top;
    position: absolute;

    &.scalable--dashboard {
      width: $scale-width-dashboard-mobile;
      transform: scale($scale-dashboard-mobile);
    }
  }
}
@media screen and (max-width: $breakpoint-mobile) {
  .scalable {
    width: $scale-width-mobile;
    transform: scale($scale-mobile);
    transform-origin: 0 top;
    position: absolute;

    &.scalable--dashboard {
      width: $scale-width-dashboard-mobile;
      transform: scale($scale-dashboard-mobile);
    }
  }
}
@media screen and (max-width: $breakpoint-small-mobile) {
  .scalable {
    width: $scale-width-dashboard-mobile;
    transform: scale($scale-dashboard-mobile);
    transform-origin: 0 top;
    position: absolute;
  }
}
</style>
