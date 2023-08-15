<template>
  <div class="container" v-if="showShield">
    <div class="sign">
      <span class="sign-clock">
        <clock />
      </span>
      <span class="sign-header">Thank you for signing up!</span>
      <span class="sign-header">Your account is awaiting for approval.</span>
      <span class="sign-body">
        Please look for an approval email in the next couple hours. If you have
        any questions, feel free to reach out to us at
        <a href="mail:support@agrid.io">support@agrid.io</a>
      </span>
    </div>
    <div class="shield" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Clock from './icons/Clock.vue';

export default defineComponent({
  name: 'ScreenShield',
  components: { Clock },
  props: {
    showShield: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/typography';
@import '@/styles/colors';

.container {
  position: relative;
}

.sign {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  background: white;
  border-radius: 10px;
  box-shadow: 0px 6px 32px rgba(0, 0, 0, 0.3);
  width: 480px;
  height: 274px;
  max-width: 100vw;
  max-height: 100vh;
  z-index: 1001;
  text-align: center;
  padding: 32px 0;

  &-header {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    font-family: Inter;
  }

  &-body {
    padding: 10px 0;
    max-width: 336px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    font-family: Inter;
  }

  &-clock {
    color: $electric-blue;
    background: #dfe7fe;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    margin-bottom: 20px;
  }
}

.shield {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(6px);
}
</style>
