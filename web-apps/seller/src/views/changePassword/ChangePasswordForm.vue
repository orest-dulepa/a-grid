<template>
  <container>
    <h1 class="heading-2 heading-2__max">Create new password</h1>
    <form @submit.prevent="changePassword">
      <div class="form-field">
        <input
          class="input input_auth"
          v-model="newPassword"
          type="password"
          required
          minlength="8"
          placeholder="Create new password"
        />
        <div class="form-field-info">Password must contain 8+ characters</div>
      </div>
      <div class="form-field">
        <input
          class="input input_auth"
          v-model="newPasswordRepeated"
          type="password"
          required
          minlength="8"
          placeholder="Repeat new password"
        />
        <div v-if="!!error" class="form-field-info form-error">
          {{ error }}
        </div>
      </div>
      <password-strength :password="newPassword" />
      <div class="submit form__elem-wide">
        <base-button
          type="submit"
          full-width
          :size="BUTTON_SIZES.large"
          :disabled="!isFilled || isLoading"
        >
          {{ isLoading ? 'Loading...' : 'Save new password' }}
        </base-button>
      </div>
    </form>
  </container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import router, { vueRoutes } from '@/routes';
import Container from '@/components/layout/Container.vue';
import BaseButton, { BUTTON_SIZES } from '@/components/ui/BaseButton.vue';
import PasswordStrength from '@/components/ui/PasswordStrenght.vue';
import { changePassword, verifyPasswordResetCode } from '@/store/api';

@Component({
  components: {
    Container,
    PasswordStrength,
    BaseButton,
  },
})
export default class ChangePasswordForm extends Vue {
  email = '';
  newPassword = '';
  newPasswordRepeated = '';
  error: string | null = null;
  isLoading = false;
  BUTTON_SIZES = BUTTON_SIZES;

  get isFilled(): boolean {
    return this.newPasswordRepeated.length >= 8 && this.newPassword.length >= 8;
  }

  async mounted(): Promise<void> {
    this.error = null;
    this.isLoading = true;

    const { oobCode } = this.$route.query;
    if (!oobCode) {
      this.$router.push(vueRoutes.dashboard.path);
      return;
    }
    const result = await verifyPasswordResetCode(oobCode as string);
    this.isLoading = false;
    if (result.type === 'error') this.error = result.message;
    else this.email = result.data || '';
  }

  async changePassword(): Promise<void> {
    const { oobCode } = this.$route.query;
    const { newPassword, newPasswordRepeated } = this;
    this.error = null;
    this.isLoading = true;

    const result = await changePassword(newPassword, newPasswordRepeated, oobCode as string);

    this.isLoading = false;
    if (result.type === 'error') this.error = result.message;
    else router.push(vueRoutes.login.path);
  }
}
</script>

<style lang="scss" scoped>
.heading-2 {
  margin-bottom: 28px;
}
</style>
