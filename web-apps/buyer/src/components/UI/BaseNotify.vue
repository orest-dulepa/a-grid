<template>
  <div v-if="show" class="notify-message notify-message__success">
    <checkmark />
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Checkmark from '../../components/UI/Icons/Checkmark.svg?inline';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    Checkmark,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/colors';

.notify-message.notify-message__success {
  svg {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }

  background: $success;
  color: $white;

  height: 48px;
  padding: 16px 24px;
  border-radius: 6px;

  font-style: normal;
  font-weight: 500;
  font-size: 16px;

  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
