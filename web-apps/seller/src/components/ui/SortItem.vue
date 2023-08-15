<template>
  <span class="ag-sortable" :class="{ active: isActive }">
    <span class="sort-label" @click.stop="toggleSort">{{ label }}</span>
    <span class="sort-actions-wrap">
      <slot></slot>
      <span @click.stop="toggleSort" class="sort-arrow-container">
        <arrow-down @click.stop="toggleSort" class="sort-arrow" :class="{ 'arrow-up': !isDesc }" />
      </span>
    </span>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SortDirection, SortItem as SortItemType } from '@/store/types';
import ArrowDown from '@/components/ui/icons/ArrowDown.vue';

@Component({
  components: {
    ArrowDown,
  },
})
export default class SortItem extends Vue {
  @Prop({ type: Array, required: true }) path!: string[];
  @Prop({ type: Boolean, required: false }) defaultSort!: boolean;
  @Prop({ type: Object, required: true }) sort!: { sort: string; sortBy: string[] };
  @Prop({ type: Array, required: true }) model!: SortItemType[];
  @Prop({ type: String, required: true }) label!: string;
  direction: SortDirection = 'asc';

  created(): void {
    if (this.defaultSort) {
      this.toggleSort();
    }
  }

  get isDesc(): boolean {
    return this.direction === 'desc' && this.sort.sortBy === this.path;
  }

  get isAsc(): boolean {
    return this.direction === 'asc' && this.sort.sortBy === this.path;
  }

  get isActive(): boolean {
    return this.path === this.sort.sortBy;
  }

  toggleSort(): void {
    this.direction = this.isAsc ? 'desc' : 'asc';
    this.$emit('sort', this.direction, this.path);
  }
}
</script>

<style lang="scss" scoped>
.ag-sortable {
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: color 0.1s linear;
  color: $dark-grey-1;
  width: 100%;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;

  .sort-arrow-container {
    display: flex;
  }

  .sort-arrow {
    width: 12px;
    height: 12px;
    margin: 0 0 0 10px;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      color: $electric-blue;
    }
  }

  .sort-actions-wrap {
    display: flex;
    align-items: center;
  }

  &.active {
    color: $dark-grey-1;

    .sort-arrow {
      transition: all 0.2s;
      transform: rotate(180deg);
      color: $electric-blue;

      &.arrow-up {
        transform: none;
      }
    }
  }

  &:hover .sort-label {
    color: $electric-blue;
    cursor: pointer;
  }
}
</style>
