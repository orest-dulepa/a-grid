<template>
  <span class="ag-subnavbar-item" :class="{ 'ag-subnavbar-item--active': isActive }">
    <span v-if="isActive">
      <slot />
    </span>
    <a v-else-if="click" @click="click">
      <slot />
    </a>
    <router-link v-else :to="to">
      <slot />
    </router-link>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SubNavbarItem extends Vue {
  @Prop({ type: Boolean, default: false }) isActive!: boolean;
  @Prop({ type: String, default: '' }) to!: string;
  @Prop({ type: Function, required: false }) click!: ((event: Event) => void) | null;
}
</script>

<style lang="scss" scoped>
.ag-subnavbar-item {
  margin: 0 16px;
  color: $dark-grey-1;
  cursor: default;
  letter-spacing: normal;
}

.ag-subnavbar-item--active {
  color: $dark-blue;
}

.ag-subnavbar-item a {
  text-decoration: none;
  color: $dark-grey-1;
  cursor: pointer;
}

.ag-subnavbar-item a:hover {
  cursor: pointer;
  color: $electric-blue;
}
</style>
