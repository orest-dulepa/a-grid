<template>
  <div class="setup-deals-step">
    <container :is-nav-large="true" class="setup-deals-step__container">
      <h2 class="heading-2 line-item-step__title">Create a new Line Item</h2>
      <p class="paragraph-large setup-deals-step__descr">
        Create a <b>Line Item</b> for each audience under the newly created
        <b>Seamless Insertion Order</b>.
      </p>
    </container>

    <container :is-large="true" :is-nav-large="true" class="setup-deals-step__gif">
      <loader-image>
        <img src="@/assets/images/xandr-4.gif" alt="Create a new Line Item" />
      </loader-image>
    </container>

    <container :is-nav-large="true" class="setup-deals-step__container">
      <div class="setup-deals-step__list">
        <div class="setup-deals-step__list-item">
          Set <span>AGrid – [REPLACE_AUDIENCE_NAME]</span> for <b>Name</b>.
        </div>
        <div class="setup-deals-step__list-item">
          Select
          <span>Banner</span> for the <b>Ad Type</b>.
        </div>
      </div>

      <p class="paragraph-large setup-deals-step__descr setup-deals-step__descr--inner">
        We must now also create a <b>Deal</b> within this new <b>Line Item</b>.
      </p>

      <div class="setup-deals-step__list setup-deals-step__list--inner">
        <div class="setup-deals-step__list-item">
          Set <span>AGrid – [REPLACE_AUDIENCE_NAME]</span> for <b>Deal Name</b>.
        </div>
        <div class="setup-deals-step__list-item">
          Search and select <span>AGrid</span> for the <b>Buyer</b>.
        </div>
        <div class="setup-deals-step__list-item">
          For Revenue Type select <span>Dynamic CPM</span> and set your <b>floor price</b> or use
          <b>market rate</b>.
        </div>
        <div class="setup-deals-step__list-item">
          For
          <b>Budget</b> set <span>Unlimited Budget</span>.
        </div>
        <div class="setup-deals-step__list-item">
          For <b>Flights</b> set to <b>No End Date</b>, <b>Start Date</b> set to <b>Today</b>.
        </div>
      </div>

      <p class="paragraph-large setup-deals-step__descr setup-deals-step__descr--inner">
        All other restrictions & targeting we can leave as the default apart from in the
        <b>Targeting</b> section, we must assign the correct <b>Key/Value</b> to pass inventory only
        related to the corresponding audience.
      </p>

      <div class="setup-deals-step__list setup-deals-step__list--inner">
        <div class="setup-deals-step__list-item">
          For <b>Key/Value</b> select the <span>AGrid</span> for <b>Key</b> created earlier, and
          then the <b>Value</b> corresponding to the audience for which this line item is being
          created.
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
export default class SetupDealsLineItemStep extends Vue {}
</script>
