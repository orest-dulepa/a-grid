<template>
  <router-link class="ag-navbar__button" :class="{ active: isActive, white: isWhite }" :to="to">
    <slot />
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class NavbarButton extends Vue {
  @Prop({ required: true }) to!: string;
  @Prop({ type: Boolean, default: false }) isWhite!: boolean;

  get isActive(): boolean {
    return this.$route.path === this.to;
  }
}
</script>

<style lang="scss" scoped>
.ag-navbar__button {
  border-radius: 6px;
  padding: 8px 12px;
  margin-right: 16px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: $dark-grey-1;
  text-decoration: none;
}

.ag-navbar__button:hover,
.ag-navbar__button.active {
  background-color: $light-blue;
  color: $electric-blue;
}

.ag-navbar__button.white {
  color: rgba($white, 0.8);

  &:hover,
  &.active {
    color: $electric-blue;
  }
}
</style>
