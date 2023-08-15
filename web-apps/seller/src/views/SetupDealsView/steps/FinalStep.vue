<template>
  <div class="final-step">
    <container class="setup-deals-step__container">
      <div class="final-step__icon">
        <checkmark-icon />
      </div>
      <h2 class="heading-2 final-step__title">Thank you!</h2>
      <p class="paragraph-large setup-deals-step__descr final-step__descr">
        We’ll be validating your installation soon.
      </p>
      <base-button
        class="setup-deals-step__action-btn final-step__fallback"
        :theme="BUTTON_THEMES.black"
        @click="$emit('start-over')"
        outline
      >
        Start over
      </base-button>
    </container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BaseButton, { BUTTON_THEMES } from '@/components/ui/BaseButton.vue';
import Container from '@/components/layout/Container.vue';
import CheckmarkIcon from '@/components/ui/icons/Checkmark.svg?inline';

@Component({
  components: {
    BaseButton,
    Container,
    CheckmarkIcon,
  },
  data: () => ({
    BUTTON_THEMES,
  }),
})
export default class SetupDealsFinalStep extends Vue {}
</script>

<style lang="scss" scoped>
.final-step {
  /* we need to extend it here to avoid using !important with margin-top rule below */
  @extend .setup-deals-step;

  text-align: center;
  margin-top: 180px;
}
.final-step__icon {
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #e6ecfe;
  color: $electric-blue;
  margin: 0 auto 28px;

  svg {
    width: 35px;
    height: initial;
  }
}
.final-step__descr {
  margin-bottom: 32px;
}
.final-step__fallback {
  margin: auto;
}
</style>
