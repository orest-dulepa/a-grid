<template>
  <container>
    <h1 class="heading-2 heading-2__max"><span>Log in</span><br /><span>with AGrid</span></h1>
    <form @submit.prevent="signin" :class="{ filled: isFilled }" novalidate>
      <div class="form-field">
        <input
          @change="handleEmailChange"
          class="input input_auth"
          :class="{ invalid: isInvalidEmail }"
          v-model="email"
          type="email"
          required
          placeholder="Work email"
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
      <div class="form-field">
        <input
          class="input input_auth"
          :class="{ invalid: isWrongPassword }"
          v-model="password"
          type="password"
          required
          minlength="8"
          placeholder="Password"
        />
        <div v-if="isWrongPassword" class="form-field-info form-error__with_link">
          <span class="form-error">{{ error.message }}</span>
          <router-link to="forgot-password"> Forgot password? </router-link>
        </div>
        <router-link v-else class="form-field-info form-field-info-forgot" to="forgot-password">
          Forgot password?
        </router-link>
      </div>
      <div class="submit form__elem-wide">
        <p v-if="isErrorGeneral" class="general-error">{{ error.message }}</p>
        <base-button
          type="submit"
          :size="BUTTON_SIZES.large"
          full-width
          :disabled="!isFilled || isLoading"
        >
          {{ isLoading ? 'Loading...' : 'Log in' }}
        </base-button>
      </div>
    </form>
  </container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Container from '@/components/layout/Container.vue';
import BaseButton, { BUTTON_SIZES } from '@/components/ui/BaseButton.vue';
import routes, { vueRoutes } from '@/routes';
import { signin } from '@/store/api';
import {
  FirebaseAuthEmailInvalid,
  FirebaseAuthError,
  FirebaseAuthUserNotFound,
  FirebaseAuthWrongPassword,
} from '@/utils/firebase-errors';
import FirebaseErrorHandler from '@/utils/firebase-errors-handler';
import { ActionTypes } from '@/store/actions';

type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
};

@Component({
  components: {
    Container,
    BaseButton,
  },
})
export default class SigninForm extends Vue {
  email = '';
  password = '';
  error: FirebaseAuthError | null = null;
  isLoading = false;
  BUTTON_SIZES = BUTTON_SIZES;

  get isInvalidEmail(): boolean {
    return this.error !== null && this.error.code === FirebaseAuthEmailInvalid.code;
  }

  get isUserNotFound(): boolean {
    return this.error !== null && this.error.code === FirebaseAuthUserNotFound.code;
  }

  get isWrongPassword(): boolean {
    return this.error !== null && this.error.code === FirebaseAuthWrongPassword.code;
  }

  get isErrorGeneral(): boolean {
    return (
      this.error !== null && !this.isInvalidEmail && !this.isUserNotFound && !this.isWrongPassword
    );
  }

  get isFilled(): boolean {
    return this.email !== null && this.password.length >= 8;
  }

  handleEmailChange(event: HTMLElementEvent<HTMLInputElement>): void {
    if (event.target && event.target.validity && !event.target.validity.valid) {
      this.error = FirebaseAuthEmailInvalid;
    } else if (this.error?.code === FirebaseAuthEmailInvalid.code) {
      this.error = null;
    }
  }

  async signin(): Promise<void> {
    const { email, password } = this;
    this.error = null;
    this.isLoading = true;

    const result = await signin(email, password);

    this.isLoading = false;
    if (result.type === 'error') {
      this.error = FirebaseErrorHandler.process(result);
    } else {
      await this.$store.dispatch(ActionTypes.SET_USER);
      routes.push(vueRoutes.dashboard.path);
    }
  }
}
</script>

<style lang="scss" scoped>
.heading-2 {
  margin-bottom: 28px;
}

.form-field .form-field-info {
  color: $electric-blue;

  &.form-field-info-forgot {
    width: 67px;
  }

  .form-error {
    width: 340px;
  }

  &.form-error__with_link {
    flex-direction: row;
    width: 330px;
    align-items: center;

    span {
      border-right: 1px solid $grey-2;
      padding-right: 28px;
    }

    a {
      padding-left: 28px;
    }

    a:visited {
      color: $electric-blue;
    }
  }
}

.general-error {
  text-align: center;
  color: $error;
}
</style>
