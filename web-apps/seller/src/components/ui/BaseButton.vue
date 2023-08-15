<template>
  <button
    v-bind="$attrs"
    v-on="$listeners"
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
import { Component, Prop, Vue } from 'vue-property-decorator';

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

@Component
export default class BaseButton extends Vue {
  @Prop({ type: String, default: 'button' }) type!: string;
  @Prop({ type: Boolean, default: false }) disabled!: boolean;
  @Prop({ type: Boolean, default: false }) outline!: boolean;
  @Prop({ type: Boolean, default: false }) fullWidth!: boolean;
  @Prop({
    type: String,
    default: BUTTON_THEMES.black,
    validator: (theme) => Object.values(BUTTON_THEMES).includes(theme),
  })
  theme!: string;
  @Prop({
    type: String,
    default: BUTTON_SIZES.default,
    validator: (size) => Object.values(BUTTON_SIZES).includes(size),
  })
  size!: string;
}
</script>

<style lang="scss" scoped>
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
    background-color: $grey-3;
    color: $white;
    cursor: not-allowed;
  }

  &--large {
    padding: 24px - $border-width 32px;
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
      background-color: $dark-grey-4;
      border-color: $dark-grey-4;
      color: $white;
    }
  }
}
.button--white {
  background-color: $white;
  color: $dark-grey-4;
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
