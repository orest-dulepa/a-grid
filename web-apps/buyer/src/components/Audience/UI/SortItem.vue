<template>
  <span class="ag-sortable" :class="{ active: isActive }">
    <span class="sort-label" @click.stop="toggleSort">{{ label }}</span>
    <span class="sort-actions-wrap">
      <slot></slot>
      <span @click.stop="toggleSort" class="sort-arrow-container">
        <arrow-down
          @click.stop="toggleSort"
          class="sort-arrow"
          :class="{ 'arrow-up': !isDesc }"
        />
      </span>
    </span>
  </span>
</template>

<script>
import ArrowDown from './icons/ArrowDown.vue';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SortItem',
  props: {
    path: { type: Array, required: true },
    defaultSort: { type: Boolean, required: false },
    sort: { type: Object, required: true },
    model: { type: Array, required: true },
    label: { type: String, required: true },
  },
  components: {
    ArrowDown,
  },
  data() {
    return {
      direction: 'asc',
    };
  },
  created() {
    if (this.defaultSort) {
      this.toggleSort();
    }
  },
  methods: {
    toggleSort() {
      this.direction = this.isAsc ? 'desc' : 'asc';
      this.$emit('sort', this.direction, this.path);
    },
  },
  computed: {
    isDesc() {
      return this.direction === 'desc' && this.sort.sortBy === this.path;
    },

    isAsc() {
      return this.direction === 'asc' && this.sort.sortBy === this.path;
    },

    isActive() {
      return this.path === this.sort.sortBy;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';
@import '@/styles/variables';

.ag-sortable {
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: color $tt-default linear;
  color: $dark-grey-1;
  cursor: pointer;
  width: 100%;
  z-index: 1;

  .sort-arrow-container {
    display: flex;
    cursor: pointer;
  }

  .sort-arrow {
    width: 12px;
    height: 12px;
    margin: 0 0 0 10px;
    transition: $tt-default;
  }

  .sort-actions-wrap {
    display: flex;
    align-items: center;
  }

  &.active {
    color: $dark-grey-1;
    .sort-arrow {
      transition: all $tt-default;
      transform: rotate(180deg);
      color: $clr-primary-blue;
      &.arrow-up {
        transform: none;
      }
    }
  }

  .sort-label {
    user-select: none;
  }

  &:hover .sort-label {
    color: $clr-primary-blue;
    cursor: pointer;
  }
}
</style>
