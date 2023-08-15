<template>
  <div class="auth-container">
    <h2>Sign up</h2>
    <p class="question">
      Already have an account?
      <router-link to="login" class="login">Log in</router-link>
    </p>
    <div class="form-field">
      <google-auth-button @click.prevent="onClickGoogleAuth" />
    </div>
    <separator>OR</separator>
    <form
      @submit.prevent="onClickContinue"
      :class="{ filled: isFilled }"
      novalidate
      class="password-fieldset"
    >
      <form-field :error="isEmailTaken || isInvalidEmail ? error : {}">
        <input
          @keyup="validateInput"
          @blur="validateInput"
          :class="{ invalid: isInvalidEmail }"
          v-model="email"
          type="email"
          required
          placeholder="E-mail address"
        />
      </form-field>
      <div class="submit">
        <button :disabled="isButtonDisabled" full-width>
          {{ isLoading ? 'Loading...' : 'Continue with e-mail' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from 'vue';
import {
  checkUserEmailBelongsToOrganization,
  checkEmailIsAvailable,
  createUserInFirestore,
  signInWithPopup,
} from '@/store/api';
import {
  FirebaseAuthError,
  FirebaseAuthEmailAlreadyInUse,
  FirebaseAuthEmailInvalid,
} from '@/utils/firebase-errors';
import FirebaseErrorHandler from '@/utils/firebase-errors-handler';
import { ActionTypes } from '@/store/actions';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import GoogleAuthButton from './UI/GoogleAuthButton.vue';
import Separator from './UI/Separator.vue';
import FormField from '@/components/UI/form/FormField.vue';

export default defineComponent({
  name: 'SignupForm',
  components: {
    GoogleAuthButton,
    Separator,
    FormField,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const email = ref('');
    const error: Ref<FirebaseAuthError | null> = ref(null);
    const isLoading = ref(false);

    const isFilled = computed(() => email.value !== '');

    const validateInput = (): void => {
      if (!/^.+@.+\..+$/.test(email.value))
        error.value = FirebaseAuthEmailInvalid;
      else if (
        error.value &&
        error.value.code === FirebaseAuthEmailInvalid.code
      )
        error.value = null;
    };

    const isButtonDisabled = computed(
      () => !isFilled.value || isLoading.value || isInvalidEmail.value
    );

    const isEmailTaken = computed(
      () =>
        error.value !== null &&
        error.value.code === FirebaseAuthEmailAlreadyInUse.code
    );

    const isInvalidEmail = computed(() => {
      return error.value !== null;
    });

    const onClickContinue = async () => {
      if (isButtonDisabled.value || isInvalidEmail.value) return;

      error.value = null;
      isLoading.value = true;

      const isEmailAvailable = await checkEmailIsAvailable(email.value);
      if (!isEmailAvailable) {
        error.value = FirebaseAuthEmailAlreadyInUse;
        isLoading.value = false;
        return;
      }

      const result = await checkUserEmailBelongsToOrganization(email.value);

      if (result.type === 'error') {
        error.value = FirebaseErrorHandler.process(result);
        isLoading.value = false;
        return;
      }
      await store.dispatch(ActionTypes.SET_SIGNUP_INFO, {
        email: email.value,
        orgName: result.data.orgName,
        orgEmailDomain: result.data.orgEmailDomain,
      });
      if (result.data.hasOrg) {
        await router.push({ name: 'EmailSignup' });
      } else {
        await router.push({ name: 'FirstUserSignup' });
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

      const userResult = await createUserInFirestore(userEmail, userName, true);

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
      error,
      isLoading,
      onClickContinue,
      isFilled,
      isButtonDisabled,
      validateInput,
      isEmailTaken,
      isInvalidEmail,
      onClickGoogleAuth,
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
      color: $clr-primary-blue;
    }
  }
}

.general-error {
  text-align: center;
  color: $clr-notify-alert;
}
</style>
