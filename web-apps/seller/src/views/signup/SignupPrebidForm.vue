<template>
  <container>
    <div class="signup-prebid-form">
      <h1 class="heading-2 heading-2__max">
        <span>Are you using Prebid</span>
        <br />
        <span>with the Xandr SSP</span>
        <xandr-logo :size="XANDR_SIZES.medium" />
        <br />
        <span>adapter?</span>
      </h1>
      <p class="paragraph-large">
        We currently only support monetisation via Xandr<br />and Prebid header bidding.
      </p>

      <base-toggle>
        <template #button> Yes </template>
        <template #content>
          <p class="paragraph-small">Please enter your Xandr member ID:</p>
          <form
            @submit.prevent="submitXandrId"
            class="submit-xandr"
            :class="{ filled: xandrMemberId }"
          >
            <input
              type="text"
              required
              minlength="1"
              v-model="xandrMemberId"
              class="input"
              placeholder="Xandr member ID"
            />
            <div class="submit-xandr__button">
              <button
                class="button"
                :class="{ 'is-loading': isLoading }"
                :disabled="!xandrMemberId"
              >
                Continue
              </button>
              <a class="link submit-xandr__skip" v-on:click="goToNextStep">Skip for now</a>
            </div>
          </form>
        </template>
      </base-toggle>

      <base-toggle>
        <template #button> No </template>
        <template #content>
          <div v-if="!hasSentUnsupportedSSP">
            <p class="paragraph-small">
              Please let us know below how you monetise your site as we extend support for other
              SSPs, Ad Servers & Header Bidders.
            </p>
            <form
              @submit.prevent="sendUnsupportedSSP"
              class="submit-unsupported-ssp"
              :class="{ filled: unsupportedSSP }"
            >
              <input
                type="text"
                required
                minlength="1"
                v-model="unsupportedSSP"
                class="input"
                placeholder="Your SSP"
              />
              <button
                class="button"
                :class="{ 'is-loading': isLoading }"
                :disabled="!unsupportedSSP"
              >
                Submit
              </button>
            </form>
          </div>
          <div v-else>
            <p class="paragraph-small">
              Thank you. We'll be in touch once we add new integrations.
            </p>
          </div>
        </template>
      </base-toggle>
    </div>
  </container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Container from '@/components/layout/Container.vue';
import BaseToggle from '@/components/ui/BaseToggle.vue';
import ChevronDown from '@/components/ui/icons/ChevronDown.vue';
import XandrLogo, { XANDR_SIZES } from '@/components/ui/XandrLogo.vue';
import { logger } from '@/utils/logger';
import * as api from '@/store/api';
import { ActionTypes } from '@/store/actions';
import { authHelpers } from '@/store/modules/auth';
import { MutationTypes } from '@/store/mutations';

@Component({
  components: {
    BaseToggle,
    ChevronDown,
    Container,
    XandrLogo,
  },
  methods: {
    ...authHelpers.mapMutations({ goToNextStep: MutationTypes.GO_TO_NEXT_SIGN_UP_STEP }),
  },
  data: () => ({
    XANDR_SIZES,
  }),
})
export default class SignupPrebidForm extends Vue {
  step!: string;
  goToNextStep!: () => void;

  xandrMemberId = '';
  unsupportedSSP = '';
  isLoading = false;
  hasSentUnsupportedSSP = false;

  async sendUnsupportedSSP(): Promise<void> {
    this.isLoading = true;
    const result = await api.sendUnsupportedSSP(this.unsupportedSSP);
    this.isLoading = false;

    // TODO: show error message in app
    if (result.type === 'error') logger.error('sendUnsupportedSSP', result.message);
    else this.hasSentUnsupportedSSP = true;
  }

  async submitXandrId(): Promise<void> {
    this.isLoading = true;
    const result = await api.setXandrId(this.xandrMemberId);
    this.$store.dispatch(ActionTypes.SET_USER);
    this.isLoading = false;

    // TODO: show error message in app
    if (result.type === 'error') logger.error('submitXandrId', result.message);
    else this.goToNextStep();
  }
}
</script>

<style lang="scss" scoped>
.paragraph-large {
  margin-bottom: 40px;
  font-size: 22px;
  line-height: 34px;
}

.paragraph-small {
  margin: 0;
}

form {
  margin-top: 12px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .input {
    box-sizing: border-box;
    font-size: 16px;
    line-height: 16px;
    padding: 16px;
    width: 318px;
    height: 48px;
  }

  .button {
    width: 134px;
    box-sizing: border-box;
  }

  .submit-xandr__button {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .submit-xandr__button .submit-xandr__skip {
    margin-top: 16px;
    font-size: 14px;
    font-weight: 500;

    &:hover {
      cursor: pointer;
    }
  }
}

.submit-unsupported-ssp-response {
  font-size: 16px;
  color: #171717;
  margin: 0;
}
</style>
