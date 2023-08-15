<template>
  <container>
    <h1 class="heading-2 heading-2__max">Forgot password?</h1>
    <p class="paragraph-large form-container">
      Enter the email address you’ve signed up with and we’ll send the reset link to your inbox
    </p>
    <form @submit.prevent="forgotPassword" novalidate>
      <div class="form-field">
        <input
          class="input input_auth"
          v-model="email"
          type="email"
          required
          placeholder="Email"
          :class="{ invalid: isInvalidEmail || isUserNotFound }"
        />
        <div v-if="isUserNotFound" class="form-field-info">
          <span v-for="(message, index) in error.message" class="form-error" :key="index">
            {{ message }}
          </span>
        </div>
        <div v-else-if="isInvalidEmail" class="form-field-info">
          <span class="form-error">
            {{ error.message }}
          </span>
        </div>
      </div>
      <div class="form__elem-wide">
        <base-button
          type="submit"
          full-width
          :size="BUTTON_SIZES.large"
          :disabled="!email.length || isLoading"
        >
          {{ isLoading ? 'Loading...' : 'Reset password' }}
        </base-button>
      </div>
      <router-link class="link form-container" :to="vueRoutes.login.path">Go back</router-link>
    </form>
  </container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Container from '@/components/layout/Container.vue';
import BaseButton, { BUTTON_SIZES } from '@/components/ui/BaseButton.vue';
import { forgotPassword } from '@/store/api';
import { vueRoutes } from '@/routes';
import {
  FirebaseAuthEmailInvalid,
  FirebaseAuthError,
  FirebaseAuthUserNotFound,
} from '@/utils/firebase-errors';
import FirebaseErrorHandler from '@/utils/firebase-errors-handler';

@Component({
  components: {
    Container,
    BaseButton,
  },
})
export default class ForgotPasswordForm extends Vue {
  email = '';
  error: FirebaseAuthError | null = null;
  isLoading = false;
  vueRoutes = vueRoutes;
  BUTTON_SIZES = BUTTON_SIZES;

  @Watch('email')
  handleChange(): void {
    this.error = null;
  }

  get isInvalidEmail(): boolean {
    return this.error !== null && this.error.code === FirebaseAuthEmailInvalid.code;
  }

  get isUserNotFound(): boolean {
    return this.error !== null && this.error.code === FirebaseAuthUserNotFound.code;
  }

  async forgotPassword(): Promise<void> {
    const { email } = this;
    this.isLoading = true;

    const result = await forgotPassword(email);

    this.isLoading = false;
    if (result.type === 'error') this.error = FirebaseErrorHandler.process(result);
    else this.$emit('submit');
  }
}
</script>

<style lang="scss" scoped>
.heading-2 {
  margin-bottom: 22px;
}
.paragraph-large {
  margin: 0;
  font-size: 22px;
  line-height: 34px;
}
.form-field {
  padding: 40px 0;
}
.button {
  margin-bottom: 24px;
}
.link {
  display: block;
  text-align: center;
  color: $electric-blue;
  font-weight: 500;
}
</style>
