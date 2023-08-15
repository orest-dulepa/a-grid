<template>
  <base-overlay>
    <div class="error-overlay" :class="{ 'error-overlay--with-background': withBackground }">
      <div class="error-overlay__icon">
        <exclamation-circle />
      </div>
      <div class="error-overlay__text">
        <h3>{{ label }}</h3>
        <p class="paragraph-small">{{ description }}</p>
      </div>
    </div>
  </base-overlay>
</template>

<script lang="ts">
import BaseOverlay from '@/components/ui/BaseOverlay.vue';
import ExclamationCircle from '@/components/ui/icons/ExclamationCircle.svg?inline';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    ExclamationCircle,
    BaseOverlay,
  },
})
export default class ErrorOverlay extends Vue {
  @Prop({ type: Boolean, default: true }) withBackground!: boolean;
  @Prop({ type: String, default: 'Couldn’t load the data' }) label!: string;
  @Prop({ type: String, default: 'We’ve been notified of this issue and we’ll fix it soon!' })
  description!: string;
}
</script>

<style lang="scss" scoped>
.error-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  height: 100%;
  border-radius: 20px;
  text-align: center;

  &.error-overlay--with-background {
    background: linear-gradient(
      291.37deg,
      rgba(42, 56, 96, 0.8) 35.94%,
      rgba(57, 72, 115, 0.8) 100%
    );

    .error-overlay__text {
      h3 {
        color: $white;
      }

      .paragraph-small {
        color: rgba($white, 0.7);
      }
    }
  }

  .error-overlay__text {
    h3 {
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 22px;
      color: $dark-grey-4;
      margin: 6px;
    }

    .paragraph-small {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
      color: $dark-grey-1;
      margin: 6px;
    }
  }
}
</style>
