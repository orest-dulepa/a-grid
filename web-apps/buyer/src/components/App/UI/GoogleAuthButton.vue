<template>
  <div class="container">
    <button class="button" @click.prevent>
      <google-icon class="button-icon" />
      <span class="button-text">Continue with Google</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GoogleIcon from './icons/Google.vue';

export default defineComponent({
  name: 'GoogleAuthButton',
  components: { GoogleIcon },
});
</script>

<style lang="scss" scoped>
@import '@/styles/colors';
@import '@/styles/form';

.button {
  height: 48px;
  width: 100%;

  background: $dark-grey-7;
  border: 1px solid $grey-15;
  box-sizing: border-box;
  border-radius: 6px;

  &:not([disabled]):hover {
    background: $light-blue;
  }

  &-text {
    font-weight: 500;
    font-size: 18px;
    line-height: 16px;
    letter-spacing: -0.02em;
    color: $dark-grey-4;
  }

  &-icon {
    height: 22px;
    width: 22px;
    margin-right: 16px;
  }
}
</style>
