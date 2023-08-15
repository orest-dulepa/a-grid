<template>
  <container>
    <h1 class="heading-2 heading-2__max"><span>Sign up</span><br /><span>with AGrid</span></h1>
    <form @submit.prevent="signup" :class="{ filled: isFilled }" novalidate>
      <div class="form-field">
        <input
          ref="fullName"
          class="input input_auth"
          required
          minlength="1"
          maxlength="40"
          v-model="fullName"
          type="text"
          placeholder="Full name"
        />
      </div>
      <div class="form-field">
        <input
          ref="orgWebsite"
          class="input input_auth"
          required
          minlength="1"
          maxlength="100"
          v-model="orgWebsite"
          type="text"
          placeholder="Organization website"
        />
      </div>
      <div class="form-field">
        <input
          ref="email"
          class="input input_auth"
          :class="{ invalid: isEmailInUse || isEmailInvalid }"
          v-model="email"
          type="email"
          required
          placeholder="Work email"
        />
        <div v-if="isEmailInUse || isEmailInvalid" class="form-field-info form-suggestion">
          <span class="form-error">{{ error.message }}</span>
          <div v-if="isEmailInUse">
            <span>Please try another one or &nbsp;</span>
            <router-link class="link" :to="vueRoutes.login.path">log in</router-link>
          </div>
        </div>
        <span v-else class="form-field-info">Please sign up with your business email</span>
      </div>
      <div class="form-field">
        <input
          ref="password"
          class="input input_auth"
          v-model="password"
          type="password"
          required
          minlength="8"
          placeholder="Create password"
        />
        <span class="form-field-info">Password must contain<br />8+ characters</span>
      </div>
      <password-strength :password="password" />
      <div class="submit form__elem-wide">
        <p v-if="error && error.general">{{ error.general }}</p>
        <base-button
          full-width
          :size="BUTTON_SIZES.large"
          :disabled="!isFilled || isLoading"
          @click="signup"
        >
          {{ isLoading ? 'Loading...' : 'Get started' }}
        </base-button>
      </div>
    </form>
  </container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Container from '@/components/layout/Container.vue';
import PasswordStrength from '@/components/ui/PasswordStrenght.vue';
import BaseButton, { BUTTON_SIZES } from '@/components/ui/BaseButton.vue';
import * as api from '@/store/api';
import { isPassAtLeastOkay } from '@/utils';
import { vueRoutes } from '@/routes';
import {
  FirebaseAuthEmailAlreadyInUse,
  FirebaseAuthEmailInvalid,
  FirebaseAuthError,
} from '@/utils/firebase-errors';
import FirebaseErrorHandler from '@/utils/firebase-errors-handler';
import { ActionTypes } from '@/store/actions';
import { authHelpers } from '@/store/modules/auth';
import { MutationTypes } from '@/store/mutations';

@Component({
  components: {
    Container,
    PasswordStrength,
    BaseButton,
  },
  methods: {
    ...authHelpers.mapMutations({ goToNextStep: MutationTypes.GO_TO_NEXT_SIGN_UP_STEP }),
  },
})
export default class SignupForm extends Vue {
  goToNextStep!: () => void;
  vueRoutes = vueRoutes;

  fullName = '';
  orgWebsite = '';
  email = '';
  password = '';
  isLoading = false;
  BUTTON_SIZES = BUTTON_SIZES;
  error: FirebaseAuthError | null = null;

  get isEmailInUse(): boolean {
    return this.error !== null && this.error.code === FirebaseAuthEmailAlreadyInUse.code;
  }

  get isEmailInvalid(): boolean {
    return this.error !== null && this.error.code === FirebaseAuthEmailInvalid.code;
  }

  get isFilled(): boolean {
    return this.email !== null && this.isPassAtLeastOkay && !!this.fullName && !!this.orgWebsite;
  }

  get isPassAtLeastOkay(): boolean {
    return isPassAtLeastOkay(this.password);
  }

  isFormValid(): boolean {
    const { fullName, orgWebsite, email, password } = this.$refs;
    const fields = [fullName, orgWebsite, email, password] as HTMLInputElement[];
    return fields.every((el) => el.checkValidity());
  }

  async signup(): Promise<void> {
    if (this.isFormValid()) {
      const { fullName, orgWebsite, email, password } = this;

      this.error = null;
      this.isLoading = true;

      const result = await api.signup({
        email,
        password,
        fullName,
        orgWebsite,
      });

      this.isLoading = false;
      if (result.type === 'error') {
        this.error = FirebaseErrorHandler.process(result);
      } else {
        this.$store.dispatch(ActionTypes.SET_USER);
        this.goToNextStep();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.heading-2 {
  margin-bottom: 28px;
}
</style>
