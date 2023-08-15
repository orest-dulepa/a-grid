<template>
  <div class="auth-container">
    <h2>Log in to AGrid</h2>
    <p class="question">
      Don't have an account?
      <router-link to="signup" class="sign-up">Sign up</router-link>
    </p>

    <div class="form-field">
      <google-auth-button @click.prevent="onClickGoogleAuth" />
    </div>
    <separator>OR</separator>
    <form
      @submit.prevent="signInClick"
      :class="{ filled: isFilled }"
      novalidate
    >
      <form-field :error="error || {}">
        <input
          @keyup="validateInput"
          @blur="validateInput"
          :class="{ invalid: isInvalidEmail || isUserNotFound }"
          v-model="email"
          type="email"
          required
          placeholder="E-mail address"
        />
      </form-field>
      <form-field :error="isWrongPassword ? error : {}">
        <input
          class="forgot"
          :class="{ invalid: isWrongPassword }"
          v-model="password"
          type="password"
          required
          minlength="8"
          placeholder="Password"
        />
        <div class="forgot-link">
          <router-link
            class="form-field-info form-field-info-forgot"
            to="forgot-password"
          >
            Forgot?
          </router-link>
        </div>
      </form-field>
      <div class="submit">
        <p v-if="isErrorGeneral" class="general-error">{{ error?.message }}</p>

        <button :disabled="isButtonDisabled" type="submit" full-width>
          {{ isLoading ? 'Loading...' : 'Log in with e-mail' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from 'vue';
import {
  signIn,
  createUserInFirestore,
  checkUserEmailBelongsToOrganization,
  signInWithPopup,
} from '@/store/api';
import {
  FirebaseAuthError,
  FirebaseAuthEmailInvalid,
  FirebaseAuthUserNotFound,
  FirebaseAuthWrongPassword,
  FirebaseAuthEmailAlreadyInUse,
} from '@/utils/firebase-errors';
import FirebaseErrorHandler from '../../utils/firebase-errors-handler';
import { ActionTypes } from '@/store/actions';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import GoogleAuthButton from './UI/GoogleAuthButton.vue';
import Separator from './UI/Separator.vue';
import FormField from '@/components/UI/form/FormField.vue';

export default defineComponent({
  name: 'SignInForm',
  components: {
    GoogleAuthButton,
    Separator,
    FormField,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const email = ref('');
    const password = ref('');
    const error: Ref<FirebaseAuthError | null> = ref(null);
    const isLoading = ref(false);

    const isFilled = computed(
      () => email.value !== '' && password.value.length >= 8
    );

    const isEmailTaken = computed(
      () =>
        error.value !== null &&
        error.value.code === FirebaseAuthEmailAlreadyInUse.code
    );

    const isInvalidEmail = computed(
      () =>
        error.value !== null &&
        error.value.code === FirebaseAuthEmailInvalid.code
    );

    const isUserNotFound = computed(
      () =>
        error.value !== null &&
        error.value.code === FirebaseAuthUserNotFound.code
    );

    const isWrongPassword = computed(
      () =>
        error.value !== null &&
        error.value.code === FirebaseAuthWrongPassword.code
    );

    const isErrorGeneral = computed(
      () =>
        error.value !== null &&
        isInvalidEmail.value &&
        isUserNotFound.value &&
        isWrongPassword.value
    );

    const isButtonDisabled = computed(
      () => !isFilled.value || isLoading.value || isInvalidEmail.value
    );

    const validateInput = (): void => {
      if (!/^.+@.+\..+$/.test(email.value))
        error.value = FirebaseAuthEmailInvalid;
      else if (
        error.value &&
        error.value.code === FirebaseAuthEmailInvalid.code
      )
        error.value = null;
    };

    const signInClick = async () => {
      validateInput();

      if (isButtonDisabled.value || isInvalidEmail.value) return;

      error.value = null;
      isLoading.value = true;

      const result = await signIn(email.value, password.value);

      if (result.type === 'error') {
        error.value = FirebaseErrorHandler.process(result);
        isLoading.value = false;
        return;
      }

      const user = await store.dispatch(ActionTypes.SET_USER);
      if (!user.data.accountId) {
        const userInfo = await checkUserEmailBelongsToOrganization(email.value);
        await store.dispatch(ActionTypes.SET_SIGNUP_INFO, {
          email: email.value,
          orgName: userInfo.data.orgName,
          orgEmailDomain: userInfo.data.orgEmailDomain,
        });

        isLoading.value = false;
        await router.push({ name: 'CreateOrganization' });
      } else {
        isLoading.value = false;
        await router.push({ name: 'Home' });
      }
    };

    const onClickGoogleAuth = async () => {
      error.value = null;
      isLoading.value = true;

      const popupResult = await signInWithPopup();

      if (popupResult.type === 'error') {
        error.value = FirebaseErrorHandler.process(popupResult);
        isLoading.value = false;
        return;
      }

      const { userEmail, userName } = popupResult.data;

      const userResult = await createUserInFirestore(
        userEmail,
        userName,
        false
      );

      if (userResult.type === 'error') {
        error.value = FirebaseErrorHandler.process(userResult);
        isLoading.value = false;
        return;
      }

      const userOrgInfo = await checkUserEmailBelongsToOrganization(userEmail);

      if (userOrgInfo.type === 'error') {
        error.value = FirebaseErrorHandler.process(userOrgInfo);
        isLoading.value = false;
        return;
      }

      await store.dispatch(ActionTypes.SET_SIGNUP_INFO, {
        email: userEmail,
        orgName: userOrgInfo.data.orgName,
        orgEmailDomain: userOrgInfo.data.orgEmailDomain,
      });

      const user = await store.dispatch(ActionTypes.SET_USER);

      if (userOrgInfo.data.hasOrg || user.data.accountId) {
        isLoading.value = false;
        await router.push({ name: 'Home' });
      } else {
        isLoading.value = false;
        await router.push({ name: 'CreateOrganization' });
      }
    };

    return {
      email,
      password,
      error,
      isLoading,
      signInClick,
      onClickGoogleAuth,
      isInvalidEmail,
      isErrorGeneral,
      isUserNotFound,
      isWrongPassword,
      isEmailTaken,
      isFilled,
      validateInput,
      isButtonDisabled,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/colors';
@import '@/styles/form';
@import '@/styles/auth';

.form-field .form-field-info {
  color: $clr-primary-blue;

  &.form-field-info-forgot {
    width: 67px;
  }

  .form-error {
    width: 340px;
  }
}

.general-error {
  text-align: center;
  color: $clr-notify-alert;
}
</style>
