<template>
  <div class="setup-deals-step">
    <container :is-nav-large="true" class="setup-deals-step__container">
      <h2 class="heading-2">Create Key/Value targeting</h2>
      <p class="paragraph-large setup-deals-step__descr">
        Go to <b>Network <ArrowRightIcon /> Key/Value</b> to create a new string.
      </p>
    </container>

    <container :is-large="true" :is-nav-large="true" class="setup-deals-step__gif">
      <loader-image>
        <img ref="image" src="@/assets/images/xandr-1.gif" alt="Create Key/Value targeting" />
      </loader-image>
    </container>

    <container :is-nav-large="true" class="setup-deals-step__container">
      <div class="key-value-step__list setup-deals-step__list">
        <div class="setup-deals-step__list-item">
          Click
          <b>Create New</b>.
        </div>
        <div class="setup-deals-step__list-item">
          Select
          <span>string</span>
          for <b>Key type</b>.
        </div>
        <div class="setup-deals-step__list-item">
          Type
          <span>agrid</span>
          for <b>Key name</b>.
        </div>
        <div class="setup-deals-step__list-item">
          Type
          <span>agrid</span>
          for <b>Key label</b>.
        </div>
        <div class="setup-deals-step__list-item">
          Click the
          <b>Save</b> button.
        </div>
        <div class="setup-deals-step__list-item key-value-step__list-item">
          Now upload all the needed
          <b>Values</b> from a CSV.
          <a href="#" class="key-value-step__list-item-note">
            <arrow-down-icon />
            Download CSV
          </a>
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
import ArrowDownIcon from '@/components/ui/icons/ArrowDown.vue';
import LoaderImage from '@/components/ui/LoaderImage.vue';

@Component({
  components: {
    Container,
    BaseButton,
    ArrowRightIcon,
    ArrowLeftIcon,
    ArrowDownIcon,
    LoaderImage,
  },
  data: () => ({
    BUTTON_THEMES,
  }),
})
export default class SetupDealsKeyValueStep extends Vue {}
</script>

<style lang="scss">
.key-value-step__list {
  margin-top: 48px;
}
.key-value-step__list-item-note {
  color: $electric-blue;
  text-decoration: none;
  margin-left: 16px;
  font-weight: 500;

  svg {
    height: 20px;
    margin-right: 4px;
  }
}
</style>
