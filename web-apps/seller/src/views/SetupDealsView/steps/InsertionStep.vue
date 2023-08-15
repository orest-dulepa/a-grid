<template>
  <div class="setup-deals-step">
    <container :is-nav-large="true" class="setup-deals-step__container">
      <h2 class="heading-2 insertion-step__title">Create New Insertion Order</h2>
      <p class="paragraph-large setup-deals-step__descr">
        Under the newly created Advertiser, we now create a <b>Seamless Insertion Order</b>.
      </p>
    </container>

    <container :is-large="true" :is-nav-large="true" class="setup-deals-step__gif">
      <loader-image>
        <img src="@/assets/images/xandr-3.gif" alt="Create New Insertion Order" />
      </loader-image>
    </container>

    <container :is-nav-large="true" class="setup-deals-step__container">
      <div class="setup-deals-step__list">
        <div class="setup-deals-step__list-item">
          We suggest you use <span>AGrid</span> for <b>Name</b>.
        </div>
        <div class="setup-deals-step__list-item">
          For <b>Budget Periods</b> select boxes <span>No End Date</span> and
          <span>Unlimited Budget</span>.
        </div>
        <div class="setup-deals-step__list-item">
          Proceed to the next step to create a Line Item.
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
export default class SetupDealsInsertionStep extends Vue {}
</script>
