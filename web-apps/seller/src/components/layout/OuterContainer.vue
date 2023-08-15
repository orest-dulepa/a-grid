<template>
  <div
    class="ag-outer-container"
    :class="{
      'ag-outer-container--transparent': transparent,
      'ag-outer-container--fake-navbar': isContinueNavbar,
      'ag-outer-container--blue': isNavbarBlue,
    }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OuterContainer extends Vue {
  @Prop({ type: Boolean, default: false }) transparent!: boolean;

  get isContinueNavbar(): boolean {
    return this.$route.meta.isContinueNavbar;
  }

  get isNavbarBlue(): boolean {
    return this.$route.meta.isNavbarBlue;
  }
}
</script>

<style lang="scss" scoped>
$padding-y: 22px;
$padding-x: 32px;

.ag-outer-container {
  width: 100%;
  min-height: calc(100vh - var(--global-navbar-height) - var(--global-bottom-spacing));
  display: flex;
  justify-content: center;
  background-color: $dark-grey-7;
  padding-bottom: var(--global-bottom-spacing);
}

.ag-navbar-container.notification:not(.ag-navbar__subnavbar) ~ .ag-outer-container {
  min-height: calc(
    100vh - var(--global-navbar-height) - var(--global-notification-height) -
      var(--global-bottom-spacing)
  );
}

.ag-navbar-container.ag-navbar__subnavbar:not(.notification) ~ .ag-outer-container {
  min-height: calc(
    100vh - var(--global-navbar-height) - var(--global-subnavbar-height) -
      var(--global-bottom-spacing)
  );
}

.ag-navbar-container.notification.ag-navbar__subnavbar ~ .ag-outer-container {
  min-height: calc(
    100vh - var(--global-navbar-height) - var(--global-subnavbar-height) -
      var(--global-notification-height) - var(--global-bottom-spacing)
  );
}

.ag-outer-container--transparent {
  background-color: transparent;
}

.ag-outer-container--blue {
  background-image: linear-gradient(
    to bottom,
    #3f6efe 0,
    #2c5ef6 292px,
    transparent 292px,
    transparent 100%
  );
}

@media screen and (max-width: $breakpoint-tablet) {
  .ag-outer-container {
    width: calc(100% - #{$padding-x * 2});
    padding: $padding-y $padding-x $padding-y;
  }
}
</style>
