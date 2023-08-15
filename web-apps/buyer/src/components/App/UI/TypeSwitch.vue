<template>
  <div class="container">
    <button
      class="button"
      :class="{ 'button-selected': selectedType === 'buyer' }"
      @click.prevent="selectAccountType('buyer')"
    >
      <span class="button-text">Buyer account</span>
      <tooltip
        primary-text="Will allow you run programmatic campaigns targeting cookie-less audiences."
        secondary-text="This account type is suited to media agencies, trading desks and brands."
        :for-auth="true"
      >
        <info-dark class="info-icon status-button" />
      </tooltip>
    </button>

    <button
      class="button status-button"
      :class="{ 'button-selected': selectedType === 'seller' }"
      @click.prevent="selectAccountType('seller')"
    >
      <span class="button-text">Seller account</span>
      <tooltip
        primary-text="Will allow you to generate a new revenue stream through monetisation of your 1st party data assets."
        secondary-text="This account type is suited to website owners, publishers and publisher networks."
        :for-auth="true"
      >
        <info-dark class="info-icon status-button" />
      </tooltip>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Tooltip from '@/components/UI/Tooltip.vue';
import InfoDark from '@/components/UI/Icons/InfoDark.vue';

export default defineComponent({
  name: 'TypeSwitch',
  props: {
    selectedType: {
      type: String,
      required: true,
      default: 'buyer',
    },
  },
  components: {
    InfoDark,
    Tooltip,
  },
  setup(props, context) {
    const selectAccountType = (type: string) => {
      context.emit('selectAccountType', type);
    };

    return {
      selectAccountType,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/colors.scss';
@import 'src/styles/shadows.scss';
@import 'src/styles/form.scss';

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 512px;
  max-width: 100%;
  height: 64px;
  font-size: 18px;
}

.button {
  height: 56px;
  width: 248px;

  background: #f5f5f7;
  border: 1px solid #d7d7d7;
  box-sizing: border-box;
  border-radius: 6px;

  &:not([disabled]):hover {
    background: $light-blue;
  }

  &-text {
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: -0.02em;
    color: #000000;
  }

  &-selected {
    background: #eaeffe;
    border: 1px solid rgba(44, 94, 246, 0.7);
    box-sizing: border-box;
    border-radius: 6px;
  }
}

.info-icon {
  margin-left: 8px;
}
</style>
