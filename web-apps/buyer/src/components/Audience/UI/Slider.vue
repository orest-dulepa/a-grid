<template>
  <div class="slider-container">
    <div class="value">
      {{ isSmaller ? value : `${secondsToDays(value)} days` }}
    </div>
    <div class="pseudo-slider"></div>
    <input
      v-model="value"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :style="`background: ${linearGradient}`"
      :class="{ smaller: isSmaller, disabled: isDisabled }"
      :disabled="isDisabled"
      class="slider"
    />
    <div v-if="!isSmaller" class="values">
      <span>1</span>
      <span>15</span>
      <span>30</span>
    </div>
    <div v-else class="values smaller-slider-values">
      <span>0</span>
      <span class="min">0.5</span>
      <span class="max">0.9</span>
      <span>1</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { NAMESPACE as AUDIENCES_NAMESPACE } from '@/store/modules/audiences';
import { GetterTypes } from '@/store/getters';
import useIsDisabled from '@/components/Audience/AudienceDetail/uses/useIsDisabled';

export default defineComponent({
  name: 'Slider',
  props: {
    type: { type: String, required: true },
    onSave: { type: Boolean, required: true },
  },
  async created() {
    this.value = this.$store.getters[
      `${AUDIENCES_NAMESPACE}/GET_AUDIENCE_${this.$props.type}`
    ](this.$route.params.id);
  },
  setup(props) {
    const Colors = {
      GREY_6: '#9b9b9b',
      GREY_12: '#c4c4c4',
      ELECTRIC_BLUE: '#2c5ef6',
    };

    const value: Ref<number> = ref(0);
    const min: Ref<number> = ref(0);
    const max: Ref<number> = ref(0);
    const step: Ref<number> = ref(1);

    const store = useStore();
    const route = useRoute();

    const onSave = computed(() => props.onSave);
    watch(onSave, () => {
      store.dispatch(`${AUDIENCES_NAMESPACE}/SET_AUDIENCE_${props.type}`, {
        id: route.params.id,
        value: value.value,
      });
    });

    const isSmaller = computed(() => props.type === 'CONFIDENCE');
    const { isDisabled } = useIsDisabled();
    const activeColor = isDisabled.value ? Colors.GREY_6 : Colors.ELECTRIC_BLUE;

    const linearGradient = computed(() => {
      return `linear-gradient(to right, ${activeColor} 0%, ${activeColor} ${
        ((value.value - min.value) / (max.value - min.value)) * 100
      }%, ${Colors.GREY_12} ${
        ((value.value - min.value) / (max.value - min.value)) * 100
      }%, ${Colors.GREY_12} 100%)`;
    });

    if (['TTL', 'LOOKBACK'].includes(props.type)) {
      min.value = 24 * 60 * 60;
      max.value = 30 * 24 * 60 * 60;
      step.value = 24 * 60 * 60;
    }

    if (props.type === 'CONFIDENCE') {
      min.value = 0.5;
      max.value = 0.9;
      step.value = 0.1;
    }

    const secondsToDays = (seconds: number): number => {
      return Math.round(seconds / 60 / 60 / 24);
    };

    return {
      value,
      min,
      max,
      step,
      linearGradient,
      isSmaller,
      isDisabled,
      secondsToDays,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/colors';

.value {
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: -0.02em;
  color: $electric-blue;

  &.disabled {
    color: $dark-grey-4;
  }
}

.values {
  display: flex;
  justify-content: space-between;
  margin: 10px 2px 0 2px;

  font-size: 14px;
  line-height: 18px;
  letter-spacing: -0.02em;
  color: $grey-5;

  &.smaller-slider-values {
    .min {
      margin-left: 45px;
    }
    .max {
      margin-right: -60px;
    }
  }
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 320px;
  height: 4px;
  border-radius: 20px;

  &.smaller {
    width: 110px;
    margin-left: 160px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    box-sizing: unset;
    width: 6px;
    height: 6px;
    border: 7px solid $electric-blue;
    border-radius: 100%;
    background-color: white;
    cursor: ew-resize;
  }

  &.disabled::-webkit-slider-thumb {
    border: 7px solid $grey-6;
  }
}

.pseudo-slider {
  width: 320px;
  height: 4px;
  margin: 12px 0 -16px 2px;
  border-radius: 20px;
  background-color: $grey-13;
}

.slider::-moz-range-progress {
  background-color: $electric-blue;

  &.disabled {
    background-color: $grey-6;
  }
}
.slider::-moz-range-track {
  background-color: $electric-blue;

  &.disabled {
    background-color: $grey-6;
  }
}
.slider::-ms-fill-lower {
  background-color: $electric-blue;

  &.disabled {
    background-color: $grey-6;
  }
}
.slider::-ms-fill-upper {
  background-color: $electric-blue;

  &.disabled {
    background-color: $grey-6;
  }
}
</style>
