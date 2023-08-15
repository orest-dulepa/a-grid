<template>
  <div class="toggle" :class="{ open: isOpen }">
    <div class="toggle__button">
      <button class="button" @click="isOpen = !isOpen">
        <slot name="button" />
        <chevron-down />
      </button>
    </div>
    <div class="toggle__body">
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ChevronDown from '@/components/ui/icons/ChevronDown.vue';

@Component({
  components: {
    ChevronDown,
  },
})
export default class BaseToggle extends Vue {
  isOpen = false;
}
</script>

<style lang="scss" scoped>
.toggle {
  padding: 0;
  margin-top: 24px;
}

.toggle .toggle__button .button {
  width: 512px;
  height: 64px;
  padding: 24px 24px;

  box-sizing: border-box;
  justify-content: space-between;

  font-size: 18px;
  font-weight: 500;
  line-height: 16px;

  border: 1px solid $grey-2;
  border-radius: 6px;

  background-color: $white;
  color: $dark-grey-4;

  &:hover {
    cursor: pointer;
    border: 1px solid $electric-blue;
    background-color: $white;
    color: $dark-grey-4;
  }

  &:focus {
    outline: none;
  }
}

.toggle .toggle__button .button svg {
  height: 16px;
  width: 16px;
  transform: rotate(180deg);
}

.toggle.open .toggle__button .button {
  background-color: $dark-grey-7;
  border-radius: 6px 6px 0 0;
  border-bottom: 0;

  &:hover {
    border: 1px solid $grey-2;
    border-bottom: 0;
  }
}

.toggle.open .toggle__button svg {
  transform: rotate(0deg);
}

.toggle .toggle__body {
  display: none;
  width: 512px;
  background-color: $dark-grey-7;
  box-sizing: border-box;
  border: 1px solid #d6d6d6;
  border-radius: 0 0 6px 6px;
  padding: 24px;
}

.toggle.open .toggle__body {
  display: block;
}
</style>
