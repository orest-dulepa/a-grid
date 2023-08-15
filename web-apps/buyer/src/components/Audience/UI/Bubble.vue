<template>
  <div v-if="count > 0" class="bubble">
    {{ count }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Bubble',
  props: {
    count: { type: Number, required: true },
  },
});
</script>

<style lang="scss" scoped>
@import './src/styles/colors';

.bubble {
  width: 18px;
  height: 16px;
  margin-left: 5px;
  background-color: $grey-8;
  border-radius: 22px;
  text-align: center;
  line-height: 16px;
  color: $grey-6;
  font-size: 10px;
}
</style>
