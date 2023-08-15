<template>
  <container>
    <div ref="accountHeader" class="account-header">
      <h1 class="heading-2">Account</h1>
      <base-notify :show="success"> Changes saved successfully </base-notify>
    </div>
    <form class="account-form" @submit.prevent="updateAccount">
      <box>
        <h2 class="account-form__section-heading">Information</h2>
        <hr />
        <div class="account-form__row">
          <div class="account-form__field">
            <label class="account-form__label">Full name</label>
            <input class="input" v-model="form.fullName" type="text" disabled />
          </div>
          <div class="account-form__field">
            <label class="account-form__label">Organization website</label>
            <input class="input" v-model="form.orgWebsite" type="text" disabled />
          </div>
        </div>
        <div class="account-form__row">
          <div class="account-form__field">
            <label class="account-form__label">API key</label>
            <input class="input" v-model="form.apiKey" type="text" disabled />
          </div>
          <div class="account-form__field">
            <label class="account-form__label">Account ID</label>
            <input class="input" v-model="form.accountId" type="text" disabled />
          </div>
        </div>
        <div class="account-form__row">
          <div class="account-form__field">
            <label class="account-form__label">Xandr ID</label>
            <input
              ref="xandrId"
              class="input"
              minlength="1"
              maxlength="40"
              v-model="form.xandrId"
              type="text"
            />
          </div>
        </div>
      </box>

      <box :class="{ filled: isEmailFilled }">
        <h2 class="account-form__section-heading">Authentication</h2>
        <hr />
        <div class="account-form__row">
          <div class="account-form__field">
            <label class="account-form__label">Email address</label>
            <div class="account-form__field-row">
              <input
                ref="email"
                class="input"
                required
                v-model="form.email"
                :class="{ invalid: isEmailInUse || isEmailInvalid }"
                type="email"
              />
              <span v-if="isEmailInUse" class="account-form__field-info form-error">
                {{ isEmailInUse }}
              </span>
              <span v-else-if="isEmailInvalid" class="account-form__field-info form-error">
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
                ref="currentPassword"
                class="input"
                minlength="8"
                v-model="form.currentPassword"
                type="password"
                :class="{ invalid: isPasswordInvalid }"
                placeholder="Current password"
              />
              <span v-if="isPasswordInvalid" class="account-form__field-info">
                {{ isPasswordInvalid }}
              </span>
            </div>

            <div class="account-form__field-row">
              <input
                ref="newPassword"
                class="input"
                minlength="8"
                v-model="form.newPassword"
                type="password"
                placeholder="New password"
              />
              <span class="account-form__field-info">Password must contain 8+ characters</span>
            </div>
          </div>
        </div>
      </box>

      <div v-for="(error, index) in errors" :key="index" class="general-error">
        <span v-if="isToManyAttemptsError(error)">
          {{ error.message }}
        </span>
      </div>

      <div class="account-form__footer">
        <base-button
          type="submit"
          :theme="BUTTON_THEMES.black"
          :disabled="!disableSaveButton || isLoading"
        >
          {{ isLoading ? 'Loading...' : 'Save' }}
        </base-button>
      </div>
    </form>
  </container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Container from '@/components/layout/Container.vue';
import BaseButton, { BUTTON_THEMES } from '@/components/ui/BaseButton.vue';
import Box from '@/components/layout/Box.vue';
import BaseNotify from '@/components/ui/BaseNotify.vue';
import { scrollToElement, showCustomValidity } from '@/utils/index';
import { Result } from '@/types';
import * as api from '@/store/api';
import { ActionTypes } from '@/store/actions';
import { UserInfo } from '@/store/types';
import {
  FirebaseAuthTooManyRequests,
  FirebaseAuthEmailAlreadyInUse,
  FirebaseAuthEmailInvalid,
  FirebaseAuthError,
  FirebaseAuthWrongPassword,
} from '@/utils/firebase-errors';
import FirebaseErrorHandler from '@/utils/firebase-errors-handler';
import { authHelpers } from '@/store/modules/auth';
import { GetterTypes } from '@/store/getters';

const accountHeaderRef = 'accountHeader';

// Used to check which api calls to run
interface AccountFormInitial {
  xandrId?: string;
  email?: string;
}

@Component({
  components: {
    BaseButton,
    BaseNotify,
    Box,
    Container,
  },
  computed: {
    ...authHelpers.mapGetters({
      user: GetterTypes.GET_USER,
    }),
  },
})
export default class AccountsView extends Vue {
  BUTTON_THEMES = BUTTON_THEMES;
  form = {
    fullName: '',
    apiKey: '',
    xandrId: '',
    orgWebsite: '',
    accountId: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  };
  FirebaseAuthTooManyRequests = FirebaseAuthTooManyRequests;
  accountFormInitial: AccountFormInitial = {};
  isLoading = false;
  errors: FirebaseAuthError[] = [];
  success = false;
  user?: UserInfo;

  @Watch('user')
  onUserChanged(): void {
    this.setFormData();
  }

  async created(): Promise<void> {
    this.setFormData();
  }

  setFormData(): void {
    if (this.user) {
      this.accountFormInitial = {
        email: this.user.email,
        xandrId: this.user.xandrId,
      };
    }
    Object.assign(this.form, this.user);
  }

  get isEmailFilled(): boolean {
    return this.form.email.length !== 0;
  }

  filterErrorsByCode(code?: string): FirebaseAuthError[] {
    return this.errors.filter((t: FirebaseAuthError) => t.code === code);
  }

  get isEmailInvalid(): boolean {
    if (this.errors.length === 0) {
      return false;
    }
    const error = this.filterErrorsByCode(FirebaseAuthEmailInvalid.code);
    if (error.length) {
      return !!error[0].message;
    }
    return false;
  }

  get isEmailInUse(): boolean {
    if (this.errors.length === 0) {
      return false;
    }
    const error = this.filterErrorsByCode(FirebaseAuthEmailAlreadyInUse.code);
    if (error.length) {
      return !!error[0].message;
    }
    return false;
  }

  get isPasswordInvalid(): boolean {
    if (this.errors.length === 0) {
      return false;
    }
    const error = this.filterErrorsByCode(FirebaseAuthWrongPassword.code);
    if (error.length) {
      return !!error[0].message;
    }
    return false;
  }

  isToManyAttemptsError(error: FirebaseAuthError): boolean {
    return error.code === FirebaseAuthTooManyRequests.code;
  }

  get disableSaveButton(): boolean {
    let isInitialDataChanged = false;

    if (this.form.xandrId && this.form.xandrId !== this.accountFormInitial.xandrId) {
      isInitialDataChanged = true;
    }
    if (this.form.email !== this.accountFormInitial.email) {
      isInitialDataChanged = true;
    }
    if (this.form.currentPassword.length !== 0 && this.form.newPassword.length !== 0) {
      isInitialDataChanged = true;
    }
    return isInitialDataChanged;
  }

  resetNotifications(): void {
    this.success = false;
    this.errors = [];
  }

  processResults(results: Result<void>[]): void {
    this.errors = [];
    results.forEach((result: Result<void>) => {
      if (result.type !== 'success') {
        this.errors.push(FirebaseErrorHandler.process(result));
      }
    });
    if (this.errors.length === 0) {
      this.success = true;
    }
  }

  async updateAccount(): Promise<void> {
    this.isLoading = true;
    this.resetNotifications();

    const { xandrId, email, currentPassword, newPassword } = this.$refs as Record<
      string,
      HTMLInputElement
    >;

    const results = [];

    // Validate form
    if (this.form.xandrId !== this.accountFormInitial.xandrId && xandrId.checkValidity()) {
      const result = await api.setXandrId(this.form.xandrId);
      results.push(result);
    }
    if (this.form.email !== this.accountFormInitial.email) {
      if (email.checkValidity() && this.form.currentPassword && currentPassword.checkValidity()) {
        const result = await api.updateEmail(this.form.email, this.form.currentPassword);
        results.push(result);
      } else {
        showCustomValidity(
          currentPassword,
          'You must provide your current password in order to change your email'
        );
      }
    }
    // Only check/update the password if the user fills in the password fields
    if (this.form.newPassword && newPassword.checkValidity()) {
      if (this.form.currentPassword && currentPassword.checkValidity()) {
        const result = await api.updatePassword(this.form.currentPassword, this.form.newPassword);
        results.push(result);
      } else {
        showCustomValidity(
          currentPassword,
          'You must provide your current password in order to change your password'
        );
      }
    }

    this.processResults(results);
    if (this.success) {
      const el = this.$refs[accountHeaderRef];
      if (el instanceof Element) scrollToElement(el);
    }
    await this.$store.dispatch(ActionTypes.SET_USER);
    this.isLoading = false;
  }
}
</script>

<style lang="scss" scoped>
$account-grey-1: #ebebeb;
$account-grey-2: #a8a8a8;

.heading-2 {
  margin-bottom: 24px;
}

.account-form .ag-box {
  margin: 16px 0;
}

.account-form {
  display: flex;
  flex-direction: column;
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
  width: 149px;
  height: 36px;
  margin-left: 32px;

  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;

  color: $account-grey-2;
}

.account-form .account-form__label {
  font-size: 16px;
  line-height: 16px;
  margin-bottom: 16px;
  font-weight: 500;
  color: $dark-grey-4;
}

.account-form .account-form__section-heading {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 32px 0;
  line-height: 22px;
}

.account-form hr {
  height: 1px;
  background-color: $account-grey-1;
  border: 0;
  width: 100%;
  margin: 0;
}

.account-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.account-form .account-form__footer {
  margin-top: 16px;

  * {
    width: 100%;
  }
}
.general-error {
  text-align: center;
  color: $error;
}
</style>
