<template>
  <div class="image-wrap">
    <div class="slot" :class="{ loaded: isLoaded }">
      <slot></slot>
    </div>
    <div v-if="!isLoaded" class="image-spinner">
      <base-spinner />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import { sleep } from '@/utils';

@Component({
  components: { BaseSpinner },
})
export default class LoaderImage extends Vue {
  isLoaded = false;

  async mounted(): Promise<void> {
    await sleep(1000);
    this.isLoaded = true;
  }
}
</script>

<style lang="scss" scoped>
.slot {
  min-height: 550px;
  opacity: 0;
  transition: all 0.8s;

  &.loaded {
    opacity: 1;
  }
}
.not-visible {
  visibility: hidden;
}
.image-wrap {
  position: relative;
}
.image-spinner {
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: 1px solid $grey-4;
  background-color: $dark-grey-7;
  width: 1216px;
  min-height: 450px;
  padding-bottom: 100px;
}
</style>
