<template>
  <div>
    <scalable :is-dashboard="isEmbedCodeStep || isCompleteStep">
      <navbar :is-white-logo="isCompleteStep" :is-fixed-logo="isCompleteStep" />
      <outer-container :transparent="true">
        <signup-form v-if="isFormStep" />
        <signup-prebid-form v-else-if="isPrebidStep" />
        <signup-embed-code
          v-else-if="isEmbedCodeStep || isCompleteStep"
          :is-show-success="isCompleteStep"
        />
      </outer-container>
    </scalable>
    <mobile-banner />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navbar from '@/components/layout/Navbar.vue';
import SignupForm from '@/views/signup/SignupForm.vue';
import SignupPrebidForm from '@/views/signup/SignupPrebidForm.vue';
import SignupEmbedCode from '@/components/integration/IntegrationCheck.vue';
import OuterContainer from '@/components/layout/OuterContainer.vue';
import Scalable from '@/components/layout/Scalable.vue';
import MobileBanner from '@/components/ui/MobileBanner.vue';
import { authHelpers } from '@/store/modules/auth';
import { GetterTypes } from '@/store/getters';

@Component({
  components: {
    Navbar,
    SignupForm,
    SignupPrebidForm,
    SignupEmbedCode,
    OuterContainer,
    MobileBanner,
    Scalable,
  },
  computed: {
    ...authHelpers.mapGetters({
      step: GetterTypes.GET_SIGN_UP_STEP,
    }),
  },
})
export default class SignupView extends Vue {
  step!: string;

  get isCompleteStep(): boolean {
    return this.step === 'signupComplete';
  }

  get isFormStep(): boolean {
    return this.step === 'signupForm';
  }

  get isPrebidStep(): boolean {
    return this.step === 'signupPrebidForm';
  }

  get isEmbedCodeStep(): boolean {
    return this.step === 'signupEmbedCode';
  }
}
</script>
