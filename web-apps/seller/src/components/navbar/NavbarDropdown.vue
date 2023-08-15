<template>
  <div
    ref="dropdown"
    class="ag-dropdown"
    :class="{ active: isActive, white: isWhite }"
    @click="isActive = !isActive"
  >
    <a class="ag-dropdown__button">
      <span v-if="user">{{ user.orgWebsite }}</span>
      <chevron-down />
    </a>
    <div class="ag-dropdown__content">
      <router-link class="ag-dropdown__item" :to="ROUTE_DASHBOARD_CHILDREN_DETAILS.account.path">
        Account
      </router-link>
      <router-link
        class="ag-dropdown__item"
        :to="ROUTE_DASHBOARD_CHILDREN_DETAILS.integration.path"
      >
        Integration
      </router-link>
      <router-link class="ag-dropdown__item" :to="ROUTE_DASHBOARD_CHILDREN_DETAILS.setupDeals.path">
        Setup deals
      </router-link>
      <a class="ag-dropdown__item" @click="logout">Logout</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ChevronDown from '@/components/ui/icons/ChevronDown.vue';
import * as api from '@/store/api';
import router, { ROUTE_DASHBOARD_CHILDREN_DETAILS } from '@/routes';
import { logger } from '@/utils/logger';
import { authHelpers } from '@/store/modules/auth';
import { GetterTypes } from '@/store/getters';

@Component({
  components: {
    ChevronDown,
  },
  computed: {
    ...authHelpers.mapGetters({
      user: GetterTypes.GET_USER,
    }),
  },
})
export default class NavbarDropdown extends Vue {
  @Prop({ type: Boolean, default: false }) isWhite!: boolean;
  ROUTE_DASHBOARD_CHILDREN_DETAILS = ROUTE_DASHBOARD_CHILDREN_DETAILS;
  isActive = false;
  globalListener: ((event: Event) => void) | null = null;

  async logout(): Promise<void> {
    await api.signout();
    logger.log('Logged out, redirecting...');
    router.go(0);
  }

  addCloseOnOutsideClickListener(): void {
    this.globalListener = (event: Event) => {
      if (event.target && !(this.$refs.dropdown as HTMLElement).contains(event.target as Element)) {
        this.isActive = false;
      }
    };
    document.body.addEventListener('click', this.globalListener);
  }

  removeCloseOnOutsideClickListener(): void {
    if (this.globalListener) {
      document.body.removeEventListener('click', this.globalListener);
    }
  }

  created(): void {
    this.addCloseOnOutsideClickListener();
  }

  beforeDestroy(): void {
    this.removeCloseOnOutsideClickListener();
  }
}
</script>

<style lang="scss" scoped>
.ag-dropdown {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.ag-dropdown__button {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: $dark-grey-1;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;

  &:hover {
    cursor: pointer;
    color: $electric-blue;
  }

  svg {
    margin-left: 10px;
    transform: rotate(180deg);
    height: 12px;
    width: 12px;
  }
}

.ag-dropdown .ag-dropdown__content {
  position: absolute;
  z-index: $z-dropdown;
  border-radius: 10px;
  background-color: $dark-grey-4;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
  line-height: 16px;
}

.ag-dropdown__content .ag-dropdown__item {
  display: block;
  padding: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
}

.ag-dropdown__content .ag-dropdown__item:hover {
  color: white;
}

.ag-dropdown .ag-dropdown__content {
  display: none;
  width: 127px;
}

.ag-dropdown.active .ag-dropdown__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  box-sizing: border-box;
  top: 32px;
}

.ag-dropdown.white {
  .ag-dropdown__button {
    color: rgba($white, 0.8);

    &:hover {
      color: $white;
    }
  }
}
</style>
