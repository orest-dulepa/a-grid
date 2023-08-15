<template>
  <div
    ref="dropdown"
    class="ag-dropdown"
    :class="{ active: isActive }"
    @click="isActive = !isActive"
  >
    <a class="ag-dropdown__button">
      <span>{{ label }}</span>
      <chevron-down />
    </a>
    <div class="ag-dropdown__content">
      <div
        v-for="item in DropdownItems"
        class="ag-dropdown__item"
        :class="{ selected: isSelectedItem(item.key) }"
        @click="onSelect(item.key)"
        v-bind:key="item.key"
      >
        <span>{{ item.label }}</span>
        <checkmark-icon />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ChevronDown from '@/components/ui/icons/ChevronDown.vue';
import CheckmarkIcon from '@/components/ui/icons/Checkmark.svg?inline';

@Component({
  components: {
    ChevronDown,
    CheckmarkIcon,
  },
})
export default class BaseDropdown extends Vue {
  @Prop({ type: Object, required: true }) items!: { [key: string]: string };
  @Prop({ type: String, required: false }) placeholder!: string;
  @Prop({ type: String, required: false }) value!: string;

  internalValue?: string;
  isActive = false;
  globalListener: ((event: Event) => void) | null = null;

  get DropdownItems(): { key: string; label: string }[] {
    return Object.keys(this.items)
      .map((key: string) => {
        return {
          key,
          label: this.items[key],
        };
      })
      .sort((a, b) => {
        return parseInt(a.key, 10) - parseInt(b.key, 10);
      });
  }

  addCloseOnOutsideClickListener(): void {
    this.globalListener = (event: Event) => {
      if (event.target && !(this.$refs.dropdown as HTMLElement).contains(event.target as Element)) {
        this.isActive = false;
      }
    };
    document.body.addEventListener('click', this.globalListener);
  }

  removeCloseOnOutsideClickListener(): void {
    if (this.globalListener) {
      document.body.removeEventListener('click', this.globalListener);
    }
  }

  created(): void {
    this.addCloseOnOutsideClickListener();
  }

  beforeDestroy(): void {
    this.removeCloseOnOutsideClickListener();
  }

  isSelectedItem(value: string): boolean {
    return this.selectedValue === value;
  }

  get selectedValue(): string {
    return this.internalValue || this.value;
  }

  get label(): string {
    if (this.internalValue) {
      return this.items[this.internalValue];
    }
    if (this.value) {
      return this.items[this.value];
    }
    return this.placeholder;
  }

  onSelect(selectedValue: string): void {
    // Set undefined and then selected value to fix getter `label` update, nextTick not works here.
    this.internalValue = undefined;
    setTimeout(() => {
      this.internalValue = `${selectedValue}`;
    }, 0);
    this.$emit('selected-value', selectedValue);
  }
}
</script>

<style lang="scss" scoped>
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
    transition: all 0.2s;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: $dark-grey-1;
    font-weight: normal;
    font-style: normal;
    font-size: 22px;
    line-height: 24px;
    user-select: none;

    &:hover {
      cursor: pointer;
      color: $electric-blue;
    }

    svg {
      transition: all 0.2s;
      margin-left: 10px;
      transform: rotate(180deg);
      height: 12px;
      width: 12px;
    }
  }
}
</style>
