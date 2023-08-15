<template>
  <div
    class="navbar__status-button"
    :class="componentClasses"
    @mouseover="togglePopover(true)"
    @mouseleave="togglePopover(false)"
  >
    <base-popover :is-active="isPopoverActive">
      <template #content>
        <div class="status-icon" :class="embedClass"></div>
      </template>
      <template #popover-content>
        <div v-if="isIntegrationCheckSuccessful" class="navbar__popover-content">
          <span> AGrid integration live </span>
        </div>
        <div v-else class="navbar__popover-content">
          <span> AGrid code is not installed </span>
          <base-button
            class="navbar__popover-content-action"
            :size="BUTTON_SIZES.small"
            :theme="BUTTON_THEMES.white"
            :full-width="true"
            @click="goToInstall"
          >
            Install now
          </base-button>
        </div>
      </template>
    </base-popover>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BasePopover from '@/components/ui/BasePopover.vue';
import BaseButton, { BUTTON_THEMES, BUTTON_SIZES } from '@/components/ui/BaseButton.vue';
import router, { ROUTE_DASHBOARD_CHILDREN_DETAILS } from '@/routes';
import { UserInfo } from '@/store/types';
import { authHelpers } from '@/store/modules/auth';
import { GetterTypes } from '@/store/getters';

@Component({
  components: {
    BaseButton,
    BasePopover,
  },
  computed: {
    ...authHelpers.mapGetters({
      user: GetterTypes.GET_USER,
    }),
  },
})
export default class NavbarStatusButton extends Vue {
  @Prop({ type: Boolean, default: false }) isWhite!: boolean;

  BUTTON_THEMES = BUTTON_THEMES;
  BUTTON_SIZES = BUTTON_SIZES;
  orgWebsite: string | null = null;
  isPopoverActive = false;
  user?: UserInfo;

  get isIntegrationCheckSuccessful(): boolean {
    return !!this.user?.isIntegrationCheckSuccessful;
  }

  get componentClasses(): { [index: string]: boolean } {
    return {
      ...this.embedClass,
      'navbar__status-button--white': this.isWhite,
    };
  }

  get embedClass(): { [index: string]: boolean } {
    return {
      installed: this.isIntegrationCheckSuccessful,
      'not-installed': !this.isIntegrationCheckSuccessful,
    };
  }

  togglePopover(isPopoverActive: boolean): void {
    this.isPopoverActive = isPopoverActive;
  }

  goToInstall(): void {
    router.push(ROUTE_DASHBOARD_CHILDREN_DETAILS.integration.path);
  }
}
</script>

<style lang="scss" scoped>
$navbar-status-grey: #aeaeae;

.navbar__status-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: default;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: $dark-grey-4;
  margin-left: 25px;

  &.navbar__status-button--white {
    color: $white;
  }
}

.status-icon {
  width: 10px;
  height: 10px;
  border-radius: 10px;
  margin-left: 8px;
  margin-right: 8px;

  &.installed {
    background-color: $success;
  }

  &.not-installed {
    background-color: $navbar-status-grey;
  }
}

.ag-popover.active .status-icon {
  &.installed {
    box-shadow: 0 2px 4px rgba(97, 190, 123, 0.5);
  }

  &.not-installed {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  }
}

.navbar__popover-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 500;
  padding: 2px 12px;

  span {
    white-space: nowrap;
  }
}

.navbar__popover-content-action {
  margin-top: 12px;
}
</style>
