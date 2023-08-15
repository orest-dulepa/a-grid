<template>
  <div class="input input_auth select" @click.stop="toggleSubmenu">
    <div class="select-input">
      <span v-if="selectedOptions.length === 0 && accountType === 'buyer'"
        >Select your DSP(s)</span
      >
      <span v-if="selectedOptions.length === 0 && accountType === 'seller'"
        >Select your SSP(s)</span
      >
      <span v-else>{{ selectedOptions }}</span>
      <arrow-down-icon
        class="select-icon"
        :class="{ 'dropdown-open': isDropdownOpen }"
      />
    </div>
    <div
      class="select-backdrop"
      @click.stop="toggleSubmenu"
      v-if="isDropdownOpen"
    />
    <transition name="fade-down">
      <div class="select-dropdown" v-if="isDropdownOpen">
        <div
          @click.stop="togglePlatforms(index)"
          class="list-item"
          v-for="(item, index) in platformOptions"
          :key="item.value"
        >
          <div
            class="custom-checkbox"
            :class="{ 'checkbox-active': item.checked }"
          />
          <input
            v-model="item.checked"
            :ref="item.value"
            class="input"
            type="checkbox"
            :value="item.value"
            :id="item.value"
          />
          <label :for="item.value" class="list-label">{{ item.value }}</label>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import ArrowDownIcon from './icons/ArrowDown.vue';
import { defineComponent, ref, Ref, computed } from 'vue';

export default defineComponent({
  name: 'SelectPlatform',
  components: {
    ArrowDownIcon,
  },
  props: {
    accountType: {
      type: String,
      required: true,
      default: 'buyer',
    },
    platformOptions: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  setup(props, context) {
    const isDropdownOpen: Ref<boolean> = ref(false);
    const toggleSubmenu = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };

    const togglePlatforms = (idx: number) => {
      context.emit('togglePlatforms', idx);
    };

    const selectedOptions = computed(() =>
      (props.platformOptions as {
        checked: boolean;
        value: string;
      }[])
        .filter((platform) => platform.checked)
        .reduce((acc, platform) => acc + `, ${platform.value}`, '')
        .slice(2)
    );

    return {
      togglePlatforms,
      isDropdownOpen,
      toggleSubmenu,
      selectedOptions,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/colors.scss';
@import 'src/styles/shadows.scss';
@import 'src/styles/form';

.select-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fade-down-enter-active {
  transition: all 0.2s ease;
  transform-origin: top center;
}

.fade-down-leave-active {
  transition: all 0.2s ease;
  transform-origin: top center;
}

.fade-down-enter-from {
  transform: scaleY(0.94);
  opacity: 0;
}

.fade-down-leave-to {
  transform: scaleY(0.94);
  opacity: 0;
}

.dropdown-open {
  transform: rotate(180deg);
}

.select {
  position: relative;
  height: 16px;
  cursor: pointer;

  &-backdrop {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
  }

  &-dropdown {
    cursor: default;
    position: absolute;
    z-index: 1;
    left: 0px;
    top: 66px;
    background: $white;
    box-shadow: $shadow-3;
    border-radius: 10px;
    padding: 20px;
    width: 154px;
    box-sizing: border-box;
    width: 100%;

    .list-item {
      position: relative;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      .list-label {
        cursor: pointer;
      }

      .input {
        opacity: 0;
        width: 20px;
        height: 20px;
        border: none;
        margin-right: 7px;
        cursor: pointer;
      }

      .custom-checkbox {
        position: absolute;
        width: 20px;
        height: 20px;
        border: 1px solid $color-3;
        box-sizing: border-box;
        border-radius: 6px;

        &.checkbox-active {
          background-color: $clr-primary-blue;
          background-image: url('./icons/check-select.svg');
          background-size: 12px 12px;
          background-repeat: no-repeat;
          background-position: center;
        }
      }
    }
  }

  &-icon {
    width: 16px;
    height: 16px;
  }
}
</style>
