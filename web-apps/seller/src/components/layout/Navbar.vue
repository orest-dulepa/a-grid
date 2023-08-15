<template>
  <div
    class="ag-navbar-container"
    :class="{ notification: !isEmailVerified, 'ag-navbar__subnavbar': hasSubNavbar }"
  >
    <nav class="ag-navbar" :class="{ 'ag-navbar__dashboard': isDashboard }">
      <div v-if="!isEmailVerified" class="ag-navbar__row ag-navbar__notification">
        <transition name="fade" mode="out-in">
          <span v-if="!isEmailVerificationSent" key="1">
            Please check your inbox to verify your email address.
            <a @click="sendEmailVerification">Resend</a>
          </span>
          <span v-else key="2"> <checkmark />Sent successfully, please check your inbox </span>
        </transition>
      </div>

      <div class="ag-navbar__row" :class="{ 'ag-navbar__row--blue': isNavbarBlue }">
        <hr v-if="isSignUpStep" class="ag-navbar__signup-progress-bar" :class="signUpStep" />

        <div class="ag-navbar__left-sidebar">
          <router-link class="root-link" :to="vueRoutes.dashboard.path">
            <svg-logo
              class="ag-navbar__logo"
              :class="{
                'ag-navbar__logo--white': isWhiteLogo,
                'ag-navbar__logo--fixed': isFixedLogo,
              }"
              icon="logo"
            />
          </router-link>

          <div v-if="isDashboard" class="ag-navbar__left-sidebar-icons">
            <hr class="ag-navbar__separator" />

            <navbar-button
              v-if="!isLoading && !isOnboardingComplete"
              :to="ROUTE_DASHBOARD_CHILDREN_DETAILS.welcome.path"
              :is-white="isNavbarBlue"
            >
              Get started
            </navbar-button>
            <navbar-button
              :to="ROUTE_DASHBOARD_CHILDREN_DETAILS.overview.path"
              :is-white="isNavbarBlue"
            >
              Overview
            </navbar-button>
            <navbar-button
              :to="ROUTE_DASHBOARD_CHILDREN_DETAILS.audiences.path"
              :is-white="isNavbarBlue"
            >
              Audiences
            </navbar-button>
            <navbar-button
              :to="ROUTE_DASHBOARD_CHILDREN_DETAILS.features.path"
              :is-white="isNavbarBlue"
            >
              Features
            </navbar-button>
          </div>
        </div>
        <div v-if="isLogin" class="ag-navbar__sidebar">
          <span>New user?</span>
          <router-link class="ag-navbar__sidebar-link" :to="vueRoutes.signup.path">
            Sign up
          </router-link>
        </div>
        <div v-else-if="isShowLoginNav" class="ag-navbar__sidebar">
          <span>Have an account?</span>
          <router-link class="ag-navbar__sidebar-link" :to="vueRoutes.login.path">
            Log in
          </router-link>
        </div>
        <div v-else-if="isDashboard" class="ag-navbar__sidebar">
          <navbar-status-button :is-white="isNavbarBlue" />
          <navbar-dropdown :is-white="isNavbarBlue" />
        </div>
      </div>

      <sub-navbar v-if="hasSubNavbar" />
    </nav>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Checkmark from '@/components/ui/icons/Checkmark.svg?inline';
import NavbarStatusButton from '@/components/navbar/NavbarStatusButton.vue';
import NavbarDropdown from '@/components/navbar/NavbarDropdown.vue';
import NavbarButton from '@/components/navbar/NavbarButton.vue';
import SubNavbar from '@/components/navbar/SubNavbar.vue';
import SvgLogo from '@/assets/images/logo.svg?inline';
import { auth } from '@/firebase';
import * as api from '@/store/api';
import router, { vueRoutes, ROUTE_DASHBOARD_CHILDREN_DETAILS } from '@/routes';
import { logger } from '@/utils/logger';
import { authHelpers } from '@/store/modules/auth';
import { GetterTypes } from '@/store/getters';

@Component({
  components: {
    Checkmark,
    NavbarStatusButton,
    NavbarDropdown,
    NavbarButton,
    SubNavbar,
    SvgLogo,
  },
  computed: {
    ...authHelpers.mapGetters({
      isOnboardingComplete: GetterTypes.GET_IS_ONBOARDING_COMPLETE,
      isLoading: GetterTypes.GET_IS_LOADING,
      signUpStep: GetterTypes.GET_SIGN_UP_STEP,
    }),
  },
})
export default class Navbar extends Vue {
  @Prop({ type: Boolean, default: false }) isWhiteLogo!: boolean;
  @Prop({ type: Boolean, default: false }) isFixedLogo!: boolean;
  ROUTE_DASHBOARD_CHILDREN_DETAILS = ROUTE_DASHBOARD_CHILDREN_DETAILS;
  vueRoutes = vueRoutes;
  isLoading?: boolean;
  signUpStep!: string;
  isOnboardingComplete!: boolean;
  isEmailVerificationSent = false;

  get isEmailVerified(): boolean {
    if (
      [
        vueRoutes.login.meta.navType,
        vueRoutes.signup.meta.navType,
        vueRoutes.forgotPassword.meta.navType,
      ].includes(this.navType)
    ) {
      return true;
    }
    if (auth.currentUser) return auth.currentUser.emailVerified;
    return false;
  }

  get navType(): number {
    return this.$route.meta.navType;
  }

  get hasSubNavbar(): boolean {
    return this.$route.meta.hasSubNavbar;
  }

  get isShowLoginNav(): boolean {
    return this.isSignUpStep && !['signupPrebidForm', 'signupEmbedCode'].includes(this.signUpStep);
  }

  get isDashboard(): boolean {
    return this.navType === vueRoutes.dashboard.meta.navType;
  }

  get isSignUpStep(): boolean {
    return this.navType === vueRoutes.signup.meta.navType;
  }

  get isLogin(): boolean {
    return this.navType === vueRoutes.login.meta.navType;
  }

  get isNavbarBlue(): boolean {
    return this.$route.meta.isNavbarBlue;
  }

  sendEmailVerification(): void {
    api.sendEmailVerification();
    this.isEmailVerificationSent = true;
  }

  async logout(): Promise<void> {
    await api.signout();
    logger.log('Logged out, redirecting...');
    router.go(0);
  }
}
</script>

<style lang="scss" scoped>
$navbar-grey-1: $grey-5;
$navbar-grey-2: $grey-2;
$navbar-dark-1: #363636;

.ag-navbar {
  display: flex;
  flex-direction: column;

  .ag-navbar__row {
    $padding-y: 22px;
    $padding-x: 32px;
    box-sizing: border-box;

    width: 100%;
    height: 72px;
    padding: $padding-y $padding-x $padding-y;

    background-color: white;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &.ag-navbar__row--blue {
      background: linear-gradient(to bottom, #4170ff 0%, #3f6efe 100%);

      .ag-navbar__logo {
        color: $white;
      }

      .ag-navbar__separator {
        background-color: rgba($navbar-grey-2, 0.3);
      }
    }

    .root-link {
      z-index: $z-logo;
      display: block;
      margin: 0;
    }

    .ag-navbar__logo {
      color: $electric-blue;
      width: 34.22px;
      height: 28px;
    }

    .ag-navbar__logo--white {
      color: $white;
      fill: $white;
      position: fixed;
    }

    .ag-navbar__logo--fixed {
      position: fixed;
      top: 20px;
      left: 32px;
    }

    .ag-navbar__sidebar {
      font-size: 14px;
      display: flex;
      flex-direction: row;
      color: $navbar-grey-1;
    }

    .ag-navbar__sidebar-link {
      margin-left: 5px;
      text-decoration: none;
      font-weight: 500;
      color: $navbar-dark-1;
      transition: color 0.1s linear;

      &:hover {
        color: $electric-blue;
      }
    }

    .ag-navbar__signup-progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      margin: 0;
      padding: 0;
      border: 0;
      box-sizing: border-box;
      height: 4px;
      background-color: $electric-blue;

      &.signupForm {
        width: 33.33%;
      }

      &.signupPrebidForm {
        width: 66.66%;
      }

      &.signupEmbedCode {
        width: 98.09%;
      }
    }

    .ag-navbar__left-sidebar,
    .ag-navbar__left-sidebar-icons {
      display: flex;
      flex-direction: row;
      align-items: center;

      a {
        font-size: 14px;
      }
    }

    .ag-navbar__separator {
      background-color: $navbar-grey-2;
      border: none;
      width: 1px;
      height: 32px;
      margin: 0 32px;
    }
  }

  &.ag-navbar__dashboard {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);

    .ag-navbar__notification {
      height: var(--global-notification-height);
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $warning;
      color: $white;
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;

      a {
        cursor: pointer;
        font-weight: 700;
        &:hover {
          opacity: 0.9;
        }
      }

      svg {
        margin-right: 12px;
        width: 12px;
        height: 12px;
      }
    }
  }
}

.ag-navbar-container {
  height: var(--global-navbar-height);
}

.ag-navbar-container.notification {
  height: calc(var(--global-navbar-height) + var(--global-notification-height));
}

.ag-navbar-container.ag-navbar__subnavbar {
  height: calc(var(--global-navbar-height) + var(--global-subnavbar-height));
}

.ag-navbar-container.ag-navbar__subnavbar.notification {
  height: calc(
    var(--global-navbar-height) + var(--global-subnavbar-height) + var(--global-notification-height)
  );
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0.3;
}
</style>
