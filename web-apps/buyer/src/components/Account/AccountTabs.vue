<template>
  <div class="account-tabs">
    <div>
      <router-link to="/account"> Account </router-link>
    </div>
    <router-link to="javascript:void(0)" @click="clickLogOut">
      Log out
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AccountTabs',
  methods: {
    clickLogOut(e): void {
      e.preventDefault();
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.account-tabs {
  background-color: $grey-4;
  height: 48px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
    color: $dark-grey-1;

    &.router-link-active.router-link-exact-active {
      color: $dark-blue;
    }

    &:not(:last-child) {
      margin-right: 32px;
    }
  }
}
</style>
