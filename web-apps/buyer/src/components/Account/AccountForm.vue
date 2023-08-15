<template>
  <form class="account-form" @submit.prevent="updateAccount">
    <box>
      <h2 class="account-form__section-heading">Information</h2>
      <hr />
      <div class="account-form__type">
        <account-type :type="accountType"></account-type>
      </div>
      <div class="account-form__row">
        <div class="account-form__field">
          <label class="account-form__label">Full name</label>
          <input class="input" v-model="form.fullName" type="text" />
        </div>
        <div class="account-form__field">
          <label class="account-form__label">Organization name</label>
          <input class="input" v-model="form.orgName" type="text" disabled />
        </div>
      </div>
      <div class="account-form__row">
        <div class="account-form__field">
          <label class="account-form__label">Account ID</label>
          <input class="input" v-model="form.accountId" type="text" disabled />
        </div>
        <div class="account-form__field">
          <label class="account-form__label">Organization website</label>
          <input class="input" v-model="form.orgWebsite" type="text" disabled />
        </div>
      </div>
      <div class="account-form__footer">
        <base-button
          type="submit"
          :theme="BUTTON_THEMES.black"
          :size="BUTTON_SIZES.medium"
          :disabled="isDisableInfoSaveButton || isLoading"
        >
          {{ isLoading ? 'Loading...' : 'Save' }}
        </base-button>
      </div>
    </box>
    <box :class="{ filled: !isEmailFilled }">
      <h2 class="account-form__section-heading">Authentication</h2>
      <hr />
      <div class="account-form__row">
        <div class="account-form__field">
          <label class="account-form__label">Email address</label>
          <div class="account-form__field-row">
            <input
              ref="emailRef"
              class="input"
              required
              v-model="form.email"
              :class="{ invalid: isEmailInUse || isEmailInvalid }"
              type="email"
            />
            <span
              v-if="isEmailInUse"
              class="account-form__field-info form-error"
            >
              {{ isEmailInUse }}
            </span>
            <span
              v-else-if="isEmailInvalid"
              class="account-form__field-info form-error"
            >
              {{ isEmailInvalid }}
            </span>
            <span v-else class="account-form__field-info">
              Please enter a valid email address
            </span>
          </div>
        </div>
      </div>

      <div class="account-form__row">
        <div class="account-form__field">
          <label class="account-form__label">Password</label>
          <div class="account-form__field-row">
            <input
              ref="currentPasswordRef"
              class="input"
              :minlength="MIN_PASSWORD_LENGTH"
              v-model="form.currentPassword"
              type="password"
              :class="{ invalid: isPasswordInvalid }"
              placeholder="New password"
            />
            <span v-if="isPasswordInvalid" class="account-form__field-info">
              {{ isPasswordInvalid }}
            </span>
          </div>

          <div class="account-form__field-row">
            <input
              ref="newPasswordRef"
              class="input"
              :minlength="MIN_PASSWORD_LENGTH"
              v-model="form.newPassword"
              type="password"
              placeholder="New password"
            />
            <span class="account-form__field-info"
              >Password must contain 8+ characters</span
            >
          </div>
        </div>
      </div>
      <div class="account-form__footer">
        <base-button
          type="submit"
          :theme="BUTTON_THEMES.black"
          :size="BUTTON_SIZES.medium"
          :disabled="isDisableAuthSaveButton || isLoading"
        >
          {{ isLoading ? 'Loading...' : 'Save' }}
        </base-button>
      </div>
    </box>
    <div v-for="(error, index) in errors" :key="index" class="general-error">
      <span v-if="isToManyAttemptsError(error)">
        {{ error.message }}
      </span>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref, ComputedRef } from 'vue';
import { useStore } from 'vuex';

import * as api from '@/store/api/account';
import { showCustomValidity } from '@/utils';
import { ActionTypes } from '@/store/actions';
import {
  BUTTON_THEMES,
  BUTTON_SIZES,
} from '@/components/Audience/UI/BaseButton.vue';
import useErrors from '@/views/account/use/useErrors';
import Box from '@/components/layout/Box.vue';
import BaseButton from '@/components/Audience/UI/BaseButton.vue';
import AccountTypeComponent from '@/components/Account/UI/AccountType.vue';
import { AccountType } from '@/types';

interface AccountFormInitial {
  fullName?: string;
  email?: string;
}

export default defineComponent({
  name: 'AccountForm',
  components: {
    Box,
    BaseButton,
    AccountType: AccountTypeComponent,
  },
  setup(props, { emit }) {
    const MIN_PASSWORD_LENGTH = 8;
    const success = ref(false);
    const {
      errors,
      isEmailInUse,
      isEmailInvalid,
      isPasswordInvalid,
      resetNotifications,
      isToManyAttemptsError,
      processResults,
    } = useErrors(success);

    let accountFormInitial: AccountFormInitial = reactive({});
    const form = reactive({
      fullName: '',
      orgWebsite: '',
      accountId: '',
      email: '',
      currentPassword: '',
      newPassword: '',
    });
    const isLoading = ref(false);
    const emailRef = ref(null);
    const currentPasswordRef = ref(null);
    const newPasswordRef = ref(null);
    const store = useStore();

    (async (): Promise<void> => {
      await store.dispatch(ActionTypes.SET_USER);
      await setFormData();
    })();

    const isEmailFilled = computed((): boolean => form.email.length !== 0);

    const user = computed(() => store.state.auth.user);
    const accountType: ComputedRef<AccountType> = computed((): string => {
      if (!store.state.auth.user) return '';
      return store.state.auth.user.isBuyer ? 'buyer' : 'seller';
    });

    const isDisableInfoSaveButton = computed((): boolean => {
      const { fullName } = form;
      return fullName && fullName === accountFormInitial.fullName;
    });
    const isDisableAuthSaveButton = computed((): boolean => {
      let value = true;

      const { email, currentPassword, newPassword } = form;

      if (email && email !== accountFormInitial.email) {
        value = false;
      } else if (
        currentPassword.length >= MIN_PASSWORD_LENGTH &&
        newPassword.length >= MIN_PASSWORD_LENGTH
      ) {
        value = false;
      }

      return value;
    });

    const setFormData = (): void => {
      if (user) {
        accountFormInitial = {
          fullName: user.value.fullName,
          email: user.value.email,
        };
      }

      Object.assign(form, user.value);
    };

    const updateAccount = async (): Promise<void> => {
      isLoading.value = true;
      resetNotifications();

      const results = [];
      // Validate form
      if (form.email !== accountFormInitial.email) {
        if (
          !(emailRef.value as HTMLInputElement).checkValidity() &&
          form.currentPassword &&
          !(currentPasswordRef.value as HTMLInputElement).checkValidity()
        ) {
          const result = await api.updateEmail(
            form.email,
            form.currentPassword
          );
          results.push(result);
        } else {
          showCustomValidity(
            currentPasswordRef.value as HTMLInputElement,
            'You must provide your current password in order to change your email'
          );
        }
      }
      // Only check/update the password if the user fills in the password fields
      if (
        form.newPassword &&
        (newPasswordRef.value as HTMLInputElement).checkValidity()
      ) {
        if (
          form.currentPassword &&
          (currentPasswordRef.value as HTMLInputElement).checkValidity()
        ) {
          const result = await api.updatePassword(
            form.currentPassword,
            form.newPassword
          );
          results.push(result);
        } else {
          showCustomValidity(
            currentPasswordRef.value as HTMLInputElement,
            'You must provide your current password in order to change your password'
          );
        }
      }

      const emitSuccess = (value): void => {
        emit('success', value);
      };

      processResults(results, emitSuccess);

      if (success.value) {
        form.currentPassword = '';
        form.newPassword = '';
      }

      emitSuccess(success);

      await store.dispatch(ActionTypes.SET_USER);
      isLoading.value = false;
    };

    return {
      user,
      form,
      errors,
      success,
      accountType,
      isEmailFilled,
      accountFormInitial,
      isEmailInUse,
      isEmailInvalid,
      isPasswordInvalid,
      resetNotifications,
      isToManyAttemptsError,
      processResults,
      isDisableAuthSaveButton,
      isDisableInfoSaveButton,
      updateAccount,
      isLoading,
      emailRef,
      newPasswordRef,
      currentPasswordRef,
      BUTTON_THEMES,
      BUTTON_SIZES,
      MIN_PASSWORD_LENGTH,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/colors';

.account-form .ag-box {
  margin: 16px 0;
}

.account-form {
  display: flex;
  flex-direction: column;

  &__type {
    padding-top: 32px;
  }
}

.account-form .account-form__row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.account-form .account-form__field {
  display: flex;
  flex-direction: column;
  margin: 32px 0 0 0;
}

.account-form .account-form__field-row {
  display: flex;
  flex-direction: row;
  margin-top: 12px;

  [type='email'].input + .account-form__field-info {
    display: none;
  }

  .input:invalid + .account-form__field-info {
    display: flex;
    color: $error;
  }

  .input.invalid + .account-form__field-info {
    width: 250px;
    display: flex;
    color: $error;
    align-items: center;
  }
}

.account-form .account-form__field-info {
  align-self: center;
  height: 36px;
  margin-left: 32px;

  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;

  color: $grey-5;
}

.account-form .account-form__label {
  font-size: 16px;
  line-height: 16px;
  margin-bottom: 16px;
  font-weight: 500;
  color: $dark-grey-4;
}

.account-form {
  &__section-heading {
    font-size: 18px;
    font-weight: 500;
    margin: 0 0 20px 0;
    line-height: 22px;
  }
}

.account-form hr {
  height: 1px;
  background-color: $grey-16;
  border: 0;
  width: 100%;
  margin: 0;
}

.account-form .account-form__footer {
  margin-top: 32px;
}

.general-error {
  text-align: center;
  color: $error;
}

.filled .input[type='email'] {
  border: 1px solid #e84141;
}
</style>
