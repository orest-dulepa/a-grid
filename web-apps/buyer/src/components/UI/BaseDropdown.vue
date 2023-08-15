<template>
  <div
    ref="dropdown"
    class="ag-dropdown"
    :class="{ active: isActive }"
    @click="isActive = !isActive"
  >
    <a class="ag-dropdown__button">
      <div class="ag-dropdown__button-icon">
        <slot name="buttonIcon"></slot>
      </div>
      <div class="ag-dropdown__button-icon hover">
        <slot name="buttonIconHover"></slot>
      </div>
      <span>{{ label }}</span>
      <chevron-down />
    </a>
    <div class="ag-dropdown__content">
      <div
        v-for="item in dropdownItems"
        class="ag-dropdown__item"
        :class="{ selected: isSelectedItem(item.key) }"
        @click="onSelect(item.key)"
        :key="item.key"
      >
        <span>{{ item.label }}</span>
        <checkmark-icon />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ChevronDown from '@/components/UI/Icons/ChevronDown.vue';
import CheckmarkIcon from '@/components/UI/Icons/Checkmark.vue';
import { computed, defineComponent, Ref, ref } from 'vue';

export default defineComponent({
  name: 'BaseDropdown',
  components: {
    ChevronDown,
    CheckmarkIcon,
  },
  props: {
    items: { type: Object, required: true },
    placeholder: { type: String, required: false },
    value: { type: String, required: false },
  },
  emits: ['selected-value'],
  setup(props, { emit }) {
    const dropdown: Ref<HTMLElement | null> = ref(null);
    const internalValue = ref();
    const globalListener: Ref<((event: Event) => void) | null> = ref(null);
    const isActive = ref(false);

    const dropdownItems = computed((): { key: string; label: string }[] => {
      return Object.keys(props.items)
        .map((key: string) => {
          return {
            key,
            label: props.items[key],
          };
        })
        .sort((a, b) => {
          return parseInt(a.key, 10) - parseInt(b.key, 10);
        });
    });

    const addCloseOnOutsideClickListener = (): void => {
      globalListener.value = (event: Event) => {
        if (
          event.target &&
          !(dropdown.value as HTMLElement)?.contains(event.target as Element)
        ) {
          isActive.value = false;
        }
      };
      document.body.addEventListener('click', globalListener.value);
    };

    const removeCloseOnOutsideClickListener = (): void => {
      if (globalListener.value) {
        document.body.removeEventListener('click', globalListener.value);
      }
    };

    const isSelectedItem = (value: string): boolean => {
      return selectedValue.value === value;
    };

    const selectedValue = computed((): string => {
      return internalValue.value || props.value;
    });

    const label = computed((): string | undefined => {
      if (internalValue.value) {
        return props.items[internalValue.value];
      }
      if (props.value) {
        return props.items[props.value];
      }
      return props.placeholder;
    });

    const onSelect = (selectedVal: string): void => {
      // Set undefined and then selected value to fix getter `label` update, nextTick not works here.
      internalValue.value = undefined;
      setTimeout(() => {
        internalValue.value = `${selectedVal}`;
      }, 0);
      emit('selected-value', selectedVal);
    };

    return {
      dropdown,
      dropdownItems,
      isActive,
      globalListener,
      selectedValue,
      label,
      addCloseOnOutsideClickListener,
      removeCloseOnOutsideClickListener,
      isSelectedItem,
      onSelect,
    };
  },
  created(): void {
    this.addCloseOnOutsideClickListener();
  },
  beforeUnmount(): void {
    this.removeCloseOnOutsideClickListener();
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/global';

.ag-dropdown {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;

  &.active .ag-dropdown__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    box-sizing: border-box;
    top: 32px;
  }

  &.active .ag-dropdown__button {
    svg {
      transform: rotate(0deg);
    }
  }

  .ag-dropdown__content {
    position: absolute;
    z-index: $z-dropdown;
    border-radius: 10px;
    background-color: $white;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    line-height: 16px;
    display: none;

    .ag-dropdown__item {
      transition: 0.2s;
      display: block;
      padding: 10px;
      color: $dark-grey-1;
      font-weight: 500;
      font-size: 14px;
      text-decoration: none;
      white-space: nowrap;
      cursor: pointer;

      span {
        display: inline-block;
        min-width: 95px;
      }

      svg {
        width: 11px;
        margin-left: 25px;
        color: $electric-blue;
        visibility: hidden;
      }

      &.selected {
        color: $dark-grey-4;

        svg {
          visibility: visible;
        }
      }

      &:hover {
        color: $electric-blue;
      }
    }
  }

  .ag-dropdown__button {
    position: relative;
    transition: all 0.2s;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-style: normal;
    line-height: 24px;
    user-select: none;
    font-weight: 500;
    font-size: 14px;
    color: $dark-grey-4;

    svg {
      transition: all 0.2s;
      margin-left: 10px;
      transform: rotate(180deg);
      height: 12px;
      width: 12px;
    }

    &-icon {
      display: flex;
      margin-right: 12px;
    }

    &-icon.hover {
      display: none;
    }

    &:hover {
      cursor: pointer;
      color: $electric-blue;

      .ag-dropdown__button-icon {
        display: none;
      }
      .ag-dropdown__button-icon.hover {
        display: flex;
      }
    }
  }
}
</style>
