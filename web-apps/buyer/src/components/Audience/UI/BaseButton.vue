<template>
  <button
    v-bind="$attrs"
    :type="type"
    :class="[
      `button button--${theme} button--${size}`,
      {
        'button--disabled': disabled,
        'button--outline': outline,
        'button--full-width': fullWidth,
      },
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export const BUTTON_THEMES = Object.freeze({
  black: 'black',
  white: 'white',
});

export const BUTTON_SIZES = Object.freeze({
  default: 'default',
  medium: 'medium',
  large: 'large',
  small: 'small',
});

export default defineComponent({
  name: 'BaseButton',
  props: {
    type: String,
    disabled: Boolean,
    outline: Boolean,
    fullWidth: Boolean,
    theme: String,
    size: String,
  },
});
</script>

<style lang="scss" scoped>
@import './src/styles/colors';
$border-width: 1px;

.button {
  height: initial;
  font-weight: 600;
  font-size: 18px;
  line-height: 0.9;
  color: $white;
  border: $border-width solid transparent;
  border-radius: 6px;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px - $border-width 32px;
  box-sizing: border-box;

  &[disabled] {
    background-color: $grey-2;
    color: $white;
    cursor: not-allowed;
  }

  &--large {
    padding: 32px !important;
  }

  &--small {
    font-weight: 500;
    font-size: 14px;
    line-height: 14px;
    padding: 9px;
    height: 32px;
    white-space: nowrap;

    &:not(:hover) {
      color: $electric-blue;
    }
  }

  &--medium {
    height: 48px;
    padding: 16px - $border-width 32px;
  }

  &--full-width {
    width: 100%;
  }
}
.button--black {
  background-color: $dark-grey-4;

  &:not([disabled]):hover {
    background-color: $electric-blue;
  }

  &.button--outline {
    background-color: transparent;
    color: $dark-grey-1;
    border-color: $grey-6;

    &:not([disabled]):hover {
      background-color: $grey-5;
      border-color: $grey-5;
      color: $white;
    }
  }
}
.button--white {
  background-color: $white;
  color: $grey-5;
  border-color: $white;

  &:not([disabled]):hover {
    color: $white;
    border-color: $electric-blue;
    background: $electric-blue;
  }

  &:not([disabled]):focus {
    border-color: $electric-blue;
  }

  &:disabled {
    background: $grey-3;
  }

  &.button--outline {
    border-color: $grey-6;

    &:not([disabled]):hover {
      border-color: $electric-blue;
      color: $white;
    }
  }
}
</style>
