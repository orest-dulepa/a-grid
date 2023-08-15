<template>
  <div class="initial-step">
    <xandr-logo class="initial-step__logo" :size="XANDR_SIZES.medium" />
    <h2 class="heading-2 initial-step__title">Setup deals in Xandr</h2>
    <p class="paragraph-large initial-step__descr">
      To start the integration please log into your Xandr account. We’ll take you through the set up
      – it will only take 10 minutes.
    </p>
    <base-button
      class="initial-step__submit"
      :theme="BUTTON_THEMES.black"
      @click="$emit('next-step')"
    >
      Get started
    </base-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import XandrLogo, { XANDR_SIZES } from '@/components/ui/XandrLogo.vue';
import BaseButton, { BUTTON_THEMES } from '@/components/ui/BaseButton.vue';

@Component({
  components: {
    XandrLogo,
    BaseButton,
  },
  data: () => ({
    BUTTON_THEMES,
    XANDR_SIZES,
  }),
})
export default class SetupDealsInitialStep extends Vue {}
</script>

<style lang="scss" scoped>
.initial-step {
  max-width: 614px;
  margin: 144px auto 0;
}
.initial-step__logo {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 12px;
}
.initial-step__title {
  text-align: center;
}
.initial-step__descr {
  margin-top: 16px;
  font-size: 22px;
  text-align: center;
}
.initial-step__submit {
  margin: auto;
}
</style>
