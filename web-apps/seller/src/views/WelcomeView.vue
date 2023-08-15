<template>
  <container v-if="!isLoading">
    <h1 class="heading-2">Welcome to AGrid</h1>
    <p class="paragraph-large">
      To use the AGrid platform to it full potential, complete the following steps.
    </p>

    <box class="ag-section">
      <check-circle v-if="isEmailVerified" />
      <bullet-circle v-else />
      <div class="ag-section__body">
        <div class="ag-section__content">
          <p class="ag-section__title">Verify your email</p>
          <p class="paragraph-small">
            Check the email you signed up with to confirm your email address.
          </p>
        </div>
      </div>
    </box>

    <box class="ag-section">
      <check-circle v-if="isIntegrationCheckSuccessful" />
      <bullet-circle v-else />
      <div class="ag-section__body">
        <div class="ag-section__content">
          <p class="ag-section__title">Install code</p>
          <p class="paragraph-small">
            Complete the JS code integration on your website(s), and verify correct install.
          </p>
        </div>
        <button v-if="!isIntegrationCheckSuccessful" class="button" @click="goToIntegrations">
          Install now
        </button>
      </div>
    </box>

    <box class="ag-section">
      <check-circle v-if="isXandrIdAdded" />
      <bullet-circle v-else />
      <div class="ag-section__body">
        <div class="ag-section__content">
          <p class="ag-section__title">Add your Xandr ID</p>
          <p class="ag-section__text paragraph-small">
            <span class="xandr-logo-wrapper">
              <xandr-logo />
            </span>
            <span> Add your Xandr member ID in account settings. </span>
          </p>
        </div>
        <button v-if="!isXandrIdAdded" class="button" @click="goToAccount">Add Xandr ID</button>
      </div>
    </box>

    <box class="ag-section">
      <check-circle v-if="isXandrIntegrationComplete" />
      <bullet-circle v-else />
      <div class="ag-section__body">
        <div class="ag-section__content">
          <p class="ag-section__title">Setup deals in Xandr</p>
          <p class="ag-section__text paragraph-small">
            <span class="xandr-logo-wrapper">
              <xandr-logo />
            </span>
            <span> Start to monetise your AGrid powered audiences via Xandr. </span>
          </p>
        </div>
        <button v-if="!isXandrIntegrationComplete" class="button" @click="goToDeals">
          Setup deals
        </button>
      </div>
    </box>

    <h1 class="footer-title heading-2">Need help?</h1>
    <p class="footer-subtitle paragraph-large">
      <envelope />
      <span>Contact us via <a href="mailto:hello@edgekit.org">hello@edgekit.org</a> </span>
      <a href="mailto:hello@edgekit.org"><arrow-right /></a>
    </p>
  </container>
  <div v-else>
    <template>
      <base-spinner class="search-models-chart__spinner" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Container from '@/components/layout/Container.vue';
import Box from '@/components/layout/Box.vue';
import CheckCircle from '@/components/ui/icons/CheckCircle.vue';
import BulletCircle from '@/components/ui/icons/BulletCircle.vue';
import Envelope from '@/components/ui/icons/Envelope.vue';
import ArrowRight from '@/components/ui/icons/ArrowRight.vue';
import XandrLogo from '@/components/ui/XandrLogo.vue';
import router, { ROUTE_DASHBOARD_CHILDREN_DETAILS } from '@/routes';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import { auth } from '@/firebase';
import { UserInfo } from '@/store/types';
import { authHelpers } from '@/store/modules/auth';
import { GetterTypes } from '@/store/getters';

@Component({
  components: {
    ArrowRight,
    BaseSpinner,
    Box,
    BulletCircle,
    CheckCircle,
    Container,
    Envelope,
    XandrLogo,
  },
  computed: {
    ...authHelpers.mapGetters({
      user: GetterTypes.GET_USER,
      isOnboardingComplete: GetterTypes.GET_IS_ONBOARDING_COMPLETE,
      isLoading: GetterTypes.GET_IS_LOADING,
    }),
  },
})
export default class WelcomeView extends Vue {
  user?: UserInfo;
  isOnboardingComplete!: boolean;
  isLoading?: boolean;

  @Watch('isOnboardingComplete')
  onIsIntegrationFullyCompleteChanged(): void {
    if (this.isOnboardingComplete) {
      router.push(ROUTE_DASHBOARD_CHILDREN_DETAILS.overview.path);
    }
  }

  get isEmailVerified(): boolean {
    if (auth.currentUser) return auth.currentUser.emailVerified;
    return false;
  }

  get isXandrIdAdded(): boolean {
    return !!this.user?.xandrId;
  }

  get isXandrIntegrationComplete(): boolean {
    return !!this.user?.isXandrIntegrationComplete;
  }

  get isIntegrationCheckSuccessful(): boolean {
    return !!this.user?.isIntegrationCheckSuccessful;
  }

  goToIntegrations(): void {
    router.push(ROUTE_DASHBOARD_CHILDREN_DETAILS.integration.path);
  }

  goToAccount(): void {
    router.push(ROUTE_DASHBOARD_CHILDREN_DETAILS.account.path);
  }

  goToDeals(): void {
    router.push(ROUTE_DASHBOARD_CHILDREN_DETAILS.setupDeals.path);
  }
}
</script>

<style lang="scss" scoped>
$welcome-grey: #b9b9c4;
$welcome-dark: #333333;

.xandr-logo-wrapper {
  margin-right: 10px;
}

.paragraph-large {
  margin-top: 16px;
  margin-bottom: 48px;
}

.ag-section__content .paragraph-small {
  margin: 6px 0 0 0;
  display: flex;
  align-items: center;
}

.footer-title {
  margin-top: 96px;
  margin-bottom: 28px;
  color: $welcome-grey;
}

.footer-subtitle {
  padding: 0;
  margin: 16px 0 0 0;

  display: flex;
  align-items: center;
  color: $welcome-dark;

  span {
    margin: 0 12px;
  }

  a {
    color: $welcome-dark;
    text-decoration: none;
  }
}

.ag-section {
  display: flex;
  flex-direction: row;
  align-items: center;

  svg {
    margin-right: 32px;
  }

  margin: 24px 0;
}

.ag-section .ag-section__body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.ag-section .ag-section__content {
  display: flex;
  flex-direction: column;
}

.ag-section .ag-section__title {
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
  color: $dark-grey-4;
  margin: 0;
}

.ag-section .paragraph-small {
  color: $dark-grey-1;
}

.ag-section .ag-section__text {
  margin: 6px 0 0 0;
  display: flex;
  align-items: center;

  a {
    text-decoration: none;
    color: $dark-blue;
    font-weight: 400;
    margin-left: 0.5em;
  }

  a:hover {
    cursor: pointer;
  }

  svg {
    width: 58px;
    height: 20px;
    margin-right: 10px;
  }
}

.ag-section .button {
  width: 196px;
  font-size: 16px;
  font-weight: 500; // TODO: remove once fix for fonts is in

  a {
    color: inherit;
    text-decoration: none;
  }
}
</style>
