<template>
  <div class="ag-subnavbar">
    <div class="ag-subnavbar__left">
      <sub-navbar-item
        :is-active="isActive(ROUTE_DASHBOARD_CHILDREN_DETAILS.account.name)"
        :to="ROUTE_DASHBOARD_CHILDREN_DETAILS.account.path"
      >
        Account
      </sub-navbar-item>

      <sub-navbar-item
        :is-active="isActive(ROUTE_DASHBOARD_CHILDREN_DETAILS.integration.name)"
        :to="ROUTE_DASHBOARD_CHILDREN_DETAILS.integration.path"
      >
        Integration
      </sub-navbar-item>

      <sub-navbar-item
        :is-active="isActive(ROUTE_DASHBOARD_CHILDREN_DETAILS.setupDeals.name)"
        :to="ROUTE_DASHBOARD_CHILDREN_DETAILS.setupDeals.path"
      >
        Setup deals
      </sub-navbar-item>
    </div>

    <sub-navbar-item :is-active="false" :click="logout"> Log out </sub-navbar-item>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SubNavbarItem from '@/components/navbar/SubNavbarItem.vue';
import * as api from '@/store/api';
import router, { ROUTE_DASHBOARD_CHILDREN_DETAILS } from '@/routes';
import { logger } from '@/utils/logger';

@Component({
  components: {
    SubNavbarItem,
  },
})
export default class SubNavbar extends Vue {
  ROUTE_DASHBOARD_CHILDREN_DETAILS = ROUTE_DASHBOARD_CHILDREN_DETAILS;

  isActive(name: string): boolean {
    return this.$route.name === name;
  }

  async logout(): Promise<void> {
    await api.signout();
    logger.log('Logged out, redirecting...');
    router.go(0);
  }
}
</script>

<style lang="scss" scoped>
.ag-subnavbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  background-color: $grey-4;
  font-size: 14px;
  line-height: 16px;
}

.ag-subnavbar .ag-subnavbar__left {
  display: flex;
  flex-direction: row;
}
</style>
