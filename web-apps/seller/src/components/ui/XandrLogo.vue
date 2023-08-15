<template>
  <div :class="['xandr-logo', `xandr-logo--${size}`]">
    <img src="@/assets/images/xandr-logo.png" alt="Xandr logo" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

export const XANDR_SIZES = Object.freeze({
  small: 'small',
  medium: 'medium',
});

@Component
export default class XandrLogo extends Vue {
  @Prop({
    type: String,
    required: false,
    default: XANDR_SIZES.small,
    validator(size) {
      return Object.values(XANDR_SIZES).includes(size);
    },
  })
  public size!: string;
}
</script>

<style lang="scss" scoped>
.xandr-logo {
  display: inline-block;
  padding: 5px;
  border-radius: 6px;
  background-color: $grey-4;
  box-sizing: border-box;

  &--medium {
    width: 95px;
  }

  &--small {
    width: 58px;
  }

  img {
    width: 100%;
    display: block;
  }
}
</style>
