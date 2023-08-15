<template>
  <div class="card" :class="{ card__secondary: isSecondary }">
    <div class="card__label">
      <span class="card__label-text">{{ label }} </span>
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
          <arrow-down class="footer-arrow footer-arrow__up" /><span>{{ footerText }}</span>
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import BasePopover from '@/components/ui/BasePopover.vue';
import InfoIcon from '@/components/ui/icons/Info.svg?inline';
import UserIcon from '@/components/ui/icons/User.svg?inline';
import TrafficIcon from '@/components/ui/icons/Traffic.svg?inline';
import ArrowRight from '@/components/ui/icons/ArrowRight.vue';
import { ROUTE_DASHBOARD_CHILDREN_DETAILS } from '@/routes';
import ArrowDown from '@/components/ui/icons/ArrowDown.vue';

@Component({
  components: {
    ArrowDown,
    ArrowRight,
    BasePopover,
    InfoIcon,
    TrafficIcon,
    UserIcon,
  },
})
export default class BaseCard extends Vue {
  @Prop({ type: String, required: true }) label!: string;
  @Prop({ type: String, required: true }) value!: string;
  @Prop({ type: String, required: false }) helpText!: string;
  @Prop({ type: Boolean, default: false }) isIncrease!: boolean;
  @Prop({ type: Boolean, default: false }) isDecrease!: boolean;
  @Prop({ type: Boolean, default: false }) isSecondary!: boolean;
  @Prop({ type: String, default: '' }) footerText!: string;
  @Prop({ type: String, required: false }) icon!: string;
  ROUTE_DASHBOARD_CHILDREN_DETAILS = ROUTE_DASHBOARD_CHILDREN_DETAILS;

  get isUserIcon(): boolean {
    return this.icon === 'user';
  }

  get isTrafficIcon(): boolean {
    return this.icon === 'traffic';
  }
}
</script>

<style lang="scss" scoped>
$footer-green: #0bc940;
$footer-red: #cc2751;
$empty-background-color: #e1e1e4;

.card {
  background: $white;
  border-radius: 10px;

  padding: 20px;
  text-align: center;

  &:first-child {
    min-width: 204px;
  }

  &:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 1px solid $grey-8;

    &:first-child {
      min-width: 212px;
    }
  }

  &:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &.card__secondary {
    min-width: 194px;
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
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    line-height: 47px;
    color: $dark-grey-4;
    margin: 26px 0 18px;

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
