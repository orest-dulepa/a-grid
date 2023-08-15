<template>
  <div
    class="card"
    :class="{ card__secondary: isSecondary, card__primary: !isSecondary }"
  >
    <div class="card__label">
      <span class="card__label-text">{{ label }}</span>
      <base-popover v-if="helpText">
        <template #content>
          <info-icon class="info-icon" />
        </template>
        <template #popover-content>
          <span class="card__help_text">{{ helpText }}</span>
        </template>
      </base-popover>
    </div>
    <div class="clearfix" />
    <div class="card__value">
      <user-icon v-if="isUserIcon" />
      <traffic-icon v-else-if="isTrafficIcon" />
      <span :class="{ card__value_empty: !value }">{{ value }}</span>
    </div>
    <div class="card__footer">
      <slot v-if="footerText">
        <span v-if="isIncrease" class="card__footer--up">
          <arrow-down class="footer-arrow footer-arrow__up" /><span>{{
            footerText
          }}</span>
        </span>
        <span v-else-if="isDecrease" class="card__footer--down">
          <arrow-down class="footer-arrow" /><span>{{ footerText }}</span>
        </span>
        <span v-else>{{ footerText }}</span>
      </slot>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import BasePopover from '@/components/UI/BasePopover.vue';
import InfoIcon from '@/components/UI/Icons/Info.vue';
import UserIcon from '@/components/UI/Icons/User.vue';
import TrafficIcon from '@/components/UI/Icons/Traffic.vue';
import ArrowDown from '@/components/UI/Icons/ArrowDown.vue';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseCard',
  components: {
    ArrowDown,
    BasePopover,
    InfoIcon,
    TrafficIcon,
    UserIcon,
  },
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    helpText: { type: String, required: false },
    isIncrease: { type: Boolean, default: false },
    isDecrease: { type: Boolean, default: false },
    isSecondary: { type: Boolean, default: false },
    footerText: { type: String, default: '' },
    icon: { type: String, required: false },
  },
  setup(props) {
    const isUserIcon = computed(() => props.icon === 'user');
    const isTrafficIcon = computed(() => props.icon === 'traffic');

    return {
      isUserIcon,
      isTrafficIcon,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/colors';

$footer-green: #0bc940;
$footer-red: #cc2751;
$empty-background-color: #e1e1e4;

.card {
  height: 190px;
  box-sizing: border-box;
  padding: 32px 32px 24px 32px;
  background: $white;
  border-radius: 10px;
  text-align: center;

  &:first-child {
    min-width: 244px;
  }

  &:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 1px solid $grey-8;

    &:first-child {
      min-width: 235px;
    }
  }

  &:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &.card__primary {
    text-align: left;

    .card__label {
      justify-content: flex-start;

      &-text {
        font-weight: 600;
        font-size: 18px;
        line-height: 18px;
        letter-spacing: -0.02em;
        color: $dark-grey-4;
      }
    }
  }

  &.card__secondary {
    min-width: 235px;
    background: $dark-grey-8;

    .card__value {
      font-size: 24px;
      .card__value_empty {
        min-width: 48px;
      }
    }

    .card__footer {
      .card__footer--up {
        background: initial;
        color: $dark-grey-1;
      }
      .card__footer--down {
        background: initial;
        color: $dark-grey-1;
      }
    }
  }

  .card__label {
    display: flex;
    justify-content: center;
    margin: 8px auto;

    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    color: $dark-grey-1;

    .info-icon {
      path {
        fill: #a8a8a8;
      }
    }

    &-text {
      font-size: 14px;
    }

    span {
      margin: 0 8px;
    }
  }

  .card__value {
    font-weight: bold;
    font-size: 32px;
    line-height: 32px;
    letter-spacing: -0.02em;
    color: $dark-grey-4;
    margin: 24px 0;

    .card__value_empty {
      display: inline-block;
      min-width: 64px;
      height: 18px;
      border-radius: 20px;
      background: $empty-background-color;
    }

    svg {
      height: 20px;
      color: $electric-blue;
      margin-right: 16px;
    }
  }

  .card__footer {
    display: inline-block;
    margin: 0 auto;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;

    &--audience {
      display: flex;
      justify-content: center;
      align-items: center;

      .audience-go {
        color: $electric-blue;
        font-weight: 500;
        font-size: 12px;
        line-height: 18px;
        padding: 8px 0;
      }

      .audience-icon {
        width: 10px;
        height: 10px;

        path {
          fill: $electric-blue;
        }
      }
    }

    svg.footer-arrow {
      width: 10px;
      height: 10px;
      margin-right: 4px;
    }

    svg {
      width: 13px;
      height: 18px;
    }

    .card__footer--up,
    .card__footer--down {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 0 12px;
      border-radius: 30px;
      height: 28px;

      > span {
        margin-left: 6px;
      }
    }

    .card__footer--up {
      background: rgba($green, 0.08);
      color: $footer-green;

      svg {
        transform: rotate(180deg);
        color: $footer-green;
      }
    }

    .card__footer--down {
      background: rgba($footer-red, 0.08);
      color: $footer-red;

      svg {
        color: $footer-red;
      }
    }
  }

  .card__help_text {
    padding: 0 10px;
    min-width: 300px;
    display: inline-block;
  }
}

.clearfix {
  display: block;
  content: '';
  clear: both;
}
</style>
