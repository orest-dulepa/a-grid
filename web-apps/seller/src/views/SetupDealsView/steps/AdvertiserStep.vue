<template>
  <div class="setup-deals-step">
    <container :is-nav-large="true" class="setup-deals-step__container">
      <h2 class="heading-2 advertiser-step__title">Create an Advertiser</h2>
      <p class="paragraph-large setup-deals-step__descr">
        Go to <b>Advertisers</b> to create a new Advertiser.
      </p>
    </container>

    <container :is-large="true" :is-nav-large="true" class="setup-deals-step__gif">
      <loader-image>
        <img src="@/assets/images/xandr-2.gif" alt="Create an Advertiser" />
      </loader-image>
    </container>

    <container :is-nav-large="true" class="setup-deals-step__container">
      <div class="setup-deals-step__list">
        <div class="setup-deals-step__list-item">
          We suggest you use <span>AGrid</span> for <b>Name</b>, the only required field.
        </div>
        <div class="setup-deals-step__list-item">
          Click the
          <b>Save</b> button.
        </div>
      </div>
    </container>

    <hr class="setup-deals-step__separator" />

    <container class="setup-deals-step__container setup-deals-step__actions">
      <base-button
        class="setup-deals-step__action-btn setup-deals-step__action-btn--icon-left"
        @click="$emit('prev-step')"
        :theme="BUTTON_THEMES.black"
        outline
      >
        <arrow-left-icon />
        Previous
      </base-button>
      <base-button
        class="setup-deals-step__action-btn setup-deals-step__action-btn--icon-right"
        @click="$emit('next-step')"
        :theme="BUTTON_THEMES.black"
      >
        Next
        <arrow-right-icon />
      </base-button>
    </container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Container from '@/components/layout/Container.vue';
import BaseButton, { BUTTON_THEMES } from '@/components/ui/BaseButton.vue';
import ArrowRightIcon from '@/components/ui/icons/ArrowRight.vue';
import ArrowLeftIcon from '@/components/ui/icons/ArrowLeft.vue';
import LoaderImage from '@/components/ui/LoaderImage.vue';

@Component({
  components: {
    Container,
    BaseButton,
    ArrowRightIcon,
    ArrowLeftIcon,
    LoaderImage,
  },
  data: () => ({
    BUTTON_THEMES,
  }),
})
export default class SetupDealsInitialStep extends Vue {}
</script>
