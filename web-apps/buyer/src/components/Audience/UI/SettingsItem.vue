<template>
  <div class="settings-item" :class="{ disabled: isDisabled }">
    <div class="content">
      <div class="item-title">{{ title }}</div>
      <div class="item-description">{{ description }}</div>
    </div>
    <slider :settings-title="title" :type="type" :on-save="onSave" />
  </div>
</template>

<script lang="ts">
import Slider from './Slider.vue';
import { computed, defineComponent, watch } from 'vue';
import { AudienceSettingsSliderType } from '@/store/values';
import useIsDisabled from '@/components/Audience/AudienceDetail/uses/useIsDisabled';

export default defineComponent({
  name: 'SettingsItem',
  components: { Slider },
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String as () => AudienceSettingsSliderType, required: true },
    onSave: { type: Boolean, required: true },
  },
  setup(props) {
    const { isDisabled } = useIsDisabled();

    return {
      isDisabled,
      saved: props.onSave,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/colors';

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 0;
  border-top: 1px solid $grey-10;

  &:last-child:not(.disabled) {
    border-bottom: 1px solid $grey-10;
  }

  &.disabled:last-child {
    padding-bottom: 0;
  }

  .content {
    .item-title {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: -0.02em;
      color: $dark-grey-4;
    }

    .item-description {
      max-width: 277px;
      margin-top: 8px;
      font-size: 14px;
      line-height: 18px;
      letter-spacing: -0.02em;
      color: $grey-5;
    }
  }
}
</style>
