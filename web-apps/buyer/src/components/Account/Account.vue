<template>
  <div class="account">
    <div ref="accountHeaderRef" class="account-header">
      <h1>Account</h1>
      <base-notify :show="success"> Changes saved successfully</base-notify>
    </div>
    <account-form v-on:success="changeSuccess"></account-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';

import AccountForm from './AccountForm.vue';
import BaseNotify from '@/components/UI/BaseNotify.vue';
import { scrollToElement } from '@/utils';

export default defineComponent({
  name: 'Account',
  components: {
    AccountForm,
    BaseNotify,
  },
  setup() {
    const success: Ref<boolean> = ref(false);
    const accountHeaderRef: Ref<Element | null> = ref(null);

    const changeSuccess = ({ value }: Ref<boolean>) => {
      success.value = value;

      if (success.value && accountHeaderRef.value !== null) {
        scrollToElement(accountHeaderRef.value);
      }
    };

    return { success, changeSuccess, accountHeaderRef };
  },
});
</script>

<style lang="scss" scoped>
.account-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
