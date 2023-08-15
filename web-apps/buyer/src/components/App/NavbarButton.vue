<template>
  <router-link
    class="ag-navbar__button"
    :class="{ active: isActive, white: isWhite }"
    :to="to"
  >
    <slot />
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NavbarButton',
  props: {
    to: {
      type: String,
      required: true,
    },
    isWhite: {
      type: String,
    },
  },
  computed: {
    isActive(): boolean {
      return this.$route.path === this.to;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/colors';
@import '@/styles/variables';

.ag-navbar__button {
  border-radius: 6px;
  padding: 8px 12px;
  margin-right: 16px;
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: $tt-default;
  color: $dark-grey-1;
}

.ag-navbar__button:hover,
.ag-navbar__button.active {
  transition: $tt-default;
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
